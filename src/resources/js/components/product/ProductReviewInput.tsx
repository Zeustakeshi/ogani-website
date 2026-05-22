import api from "@/services/api";
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

interface CurrentUser {
    id: number;
    username?: string | null;
}

interface ProductReviewInputProps {
    productId?: string;
    currentUser?: CurrentUser | null;
    hasExistingReview?: boolean;
    onSubmitted?: () => void | Promise<void>;
}

const starValues = [1, 2, 3, 4, 5];

const ProductReviewInput: React.FC<ProductReviewInputProps> = ({
    productId,
    currentUser,
    hasExistingReview = false,
    onSubmitted,
}) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewText, setReviewText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const selectedRating = hoverRating || rating;

    const activeLabel = useMemo(() => {
        if (!selectedRating) {
            return "Chọn số sao";
        }

        return `${selectedRating}/5 sao`;
    }, [selectedRating]);

    const renderStarButtons = () =>
        starValues.map((value) => {
            const isActive = value <= selectedRating;

            return (
                <button
                    key={`rating-star-${value}`}
                    type="button"
                    className={`product__review__star-btn ${isActive ? "is-active" : ""}`}
                    aria-label={`${value} sao`}
                    onMouseEnter={() => setHoverRating(value)}
                    onMouseLeave={() => setHoverRating(0)}
                    onFocus={() => setHoverRating(value)}
                    onBlur={() => setHoverRating(0)}
                    onClick={() => setRating(value)}
                >
                    <i className={isActive ? "fa fa-star" : "fa fa-star-o"} />
                </button>
            );
        });

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!productId || !currentUser) {
            return;
        }

        if (!rating) {
            setErrorMessage("Vui lòng chọn số sao đánh giá.");
            return;
        }

        if (!reviewText.trim()) {
            setErrorMessage("Vui lòng nhập nội dung bình luận.");
            return;
        }

        setIsSubmitting(true);
        setErrorMessage(null);
        setMessage(null);

        try {
            await api.post(`/products/${productId}/reviews`, {
                review_text: reviewText.trim(),
                rating,
            });

            setReviewText("");
            setRating(0);
            setHoverRating(0);
            setMessage("Đánh giá của bạn đã được gửi thành công.");

            await onSubmitted?.();
        } catch {
            setErrorMessage("Không thể gửi đánh giá. Vui lòng thử lại.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!currentUser) {
        return (
            <div className="product__review__auth">
                <h6>Đăng nhập để viết đánh giá</h6>
                <p>
                    Bạn cần đăng nhập trước khi có thể chấm sao và bình luận sản
                    phẩm này.
                </p>
                <Link to="/login">Đăng nhập ngay</Link>
            </div>
        );
    }

    if (hasExistingReview) {
        return (
            <div className="product__review__locked">
                <h6>Bạn đã đánh giá sản phẩm này</h6>
                <p>
                    Mỗi người chỉ được bình luận một lần. Bạn có thể chỉnh sửa
                    hoặc xóa review của mình ở danh sách bên dưới.
                </p>
            </div>
        );
    }

    return (
        <div className="product__review__input">
            <h6>Viết bình luận</h6>
            <p>
                Chào {currentUser.username ?? "bạn"}, hãy chia sẻ trải nghiệm
                thật của mình về sản phẩm.
            </p>
            <form onSubmit={handleSubmit}>
                <label className="product__review__rating-label">
                    Đánh giá của bạn
                </label>
                <div
                    className="product__review__stars"
                    aria-label="Chọn số sao đánh giá"
                >
                    {renderStarButtons()}
                    <span className="product__review__notice">
                        {activeLabel}
                    </span>
                </div>

                <textarea
                    className="product__review__textarea"
                    value={reviewText}
                    onChange={(event) => setReviewText(event.target.value)}
                    placeholder="Viết nhận xét của bạn về chất lượng, mùi vị, đóng gói, hoặc trải nghiệm sử dụng..."
                />

                <div className="product__review__actions">
                    <button
                        type="submit"
                        className="product__review__submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
                    </button>
                    <p className="product__review__notice">
                        Bình luận sẽ được lưu cùng số sao bạn chọn.
                    </p>
                </div>

                {message && (
                    <p className="product__review__notice">{message}</p>
                )}
                {errorMessage && (
                    <p className="product__review__notice">{errorMessage}</p>
                )}
            </form>
        </div>
    );
};

export default ProductReviewInput;
