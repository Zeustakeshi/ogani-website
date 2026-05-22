import api from "@/services/api";
import React, { useEffect, useState } from "react";

export type ProductReviewItem = {
    id: number;
    user_id: number;
    product_id: string;
    user?: {
        id: number;
        username?: string | null;
    } | null;
    review_text: string;
    rating: number;
    created_at?: string;
};

interface ProductReviewListProps {
    reviews: ProductReviewItem[];
    reviewsCount?: number;
    isLoading?: boolean;
    productId?: string;
    currentUser?: {
        id: number;
        username?: string | null;
    } | null;
    onMutated?: () => void | Promise<void>;
}

const starValues = [1, 2, 3, 4, 5];

const renderStars = (rating: number) =>
    starValues.map((starNumber) => (
        <i
            key={`review-star-${starNumber}`}
            className={starNumber <= rating ? "fa fa-star" : "fa fa-star-o"}
            aria-hidden="true"
        />
    ));

const formatDate = (value?: string) => {
    if (!value) {
        return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(date);
};

const ProductReviewList: React.FC<ProductReviewListProps> = ({
    reviews,
    reviewsCount,
    isLoading = false,
    productId,
    currentUser,
    onMutated,
}) => {
    const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
    const [draftRating, setDraftRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [draftText, setDraftText] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!editingReviewId) {
            return;
        }

        const stillExists = reviews.some(
            (review) => review.id === editingReviewId,
        );

        if (!stillExists) {
            setEditingReviewId(null);
            setDraftRating(0);
            setHoverRating(0);
            setDraftText("");
        }
    }, [editingReviewId, reviews]);

    const totalReviews = reviewsCount ?? reviews.length;
    const averageRating =
        reviews.length > 0
            ? reviews.reduce(
                  (sum, review) => sum + Number(review.rating || 0),
                  0,
              ) / reviews.length
            : 0;

    const startEditing = (review: ProductReviewItem) => {
        setEditingReviewId(review.id);
        setDraftRating(Number(review.rating || 0));
        setHoverRating(0);
        setDraftText(review.review_text || "");
        setMessage(null);
        setErrorMessage(null);
    };

    const stopEditing = () => {
        setEditingReviewId(null);
        setDraftRating(0);
        setHoverRating(0);
        setDraftText("");
    };

    const submitEditing = async (reviewId: number) => {
        if (!productId) {
            return;
        }

        if (!draftRating) {
            setErrorMessage("Vui lòng chọn số sao đánh giá.");
            return;
        }

        if (!draftText.trim()) {
            setErrorMessage("Vui lòng nhập nội dung bình luận.");
            return;
        }

        setIsSaving(true);
        setErrorMessage(null);
        setMessage(null);

        try {
            await api.patch(`/products/${productId}/reviews/${reviewId}`, {
                review_text: draftText.trim(),
                rating: draftRating,
            });

            stopEditing();
            setMessage("Đánh giá của bạn đã được cập nhật.");
            await onMutated?.();
        } catch {
            setErrorMessage("Không thể cập nhật đánh giá. Vui lòng thử lại.");
        } finally {
            setIsSaving(false);
        }
    };

    const deleteReview = async (reviewId: number) => {
        if (!productId) {
            return;
        }

        const confirmed = window.confirm(
            "Bạn có chắc chắn muốn xóa review này không?",
        );

        if (!confirmed) {
            return;
        }

        setIsSaving(true);
        setErrorMessage(null);
        setMessage(null);

        try {
            await api.delete(`/products/${productId}/reviews/${reviewId}`);
            stopEditing();
            setMessage("Đánh giá của bạn đã được xóa.");
            await onMutated?.();
        } catch {
            setErrorMessage("Không thể xóa đánh giá. Vui lòng thử lại.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="product__reviews__panel">
            <div className="product__reviews__header">
                <div>
                    <h6>Danh sách bình luận</h6>
                    <p>{totalReviews} đánh giá từ người dùng</p>
                </div>
                <div
                    className="product__reviews__summary"
                    aria-label="Rating summary"
                >
                    <div>{renderStars(Math.round(averageRating))}</div>
                    <span>
                        {averageRating > 0 ? averageRating.toFixed(1) : "0.0"}/5
                    </span>
                </div>
            </div>

            {message && <p className="product__reviews__status">{message}</p>}
            {errorMessage && (
                <p className="product__reviews__status product__reviews__status--error">
                    {errorMessage}
                </p>
            )}

            {isLoading ? (
                <p className="product__reviews__empty">Đang tải bình luận...</p>
            ) : reviews.length === 0 ? (
                <p className="product__reviews__empty">
                    Chưa có bình luận nào cho sản phẩm này. Hãy là người đầu
                    tiên chia sẻ trải nghiệm của bạn.
                </p>
            ) : (
                <div className="product__reviews__list">
                    {reviews.map((review) => {
                        const isOwnReview = Boolean(
                            currentUser && review.user_id === currentUser.id,
                        );
                        const isEditing = editingReviewId === review.id;
                        const visibleRating = hoverRating || draftRating;

                        return (
                            <article
                                key={review.id}
                                className="product__reviews__item"
                            >
                                {isEditing ? (
                                    <div className="product__reviews__edit">
                                        <div className="product__reviews__meta">
                                            <div>
                                                <p className="product__reviews__author">
                                                    {review.user?.username ??
                                                        "Người dùng ẩn danh"}
                                                </p>
                                                <div className="product__reviews__stars">
                                                    {renderStars(
                                                        Number(
                                                            review.rating || 0,
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                            <span className="product__reviews__date">
                                                {formatDate(review.created_at)}
                                            </span>
                                        </div>

                                        <div className="product__review__stars product__reviews__edit-stars">
                                            {starValues.map((value) => (
                                                <button
                                                    key={`edit-rating-${value}`}
                                                    type="button"
                                                    className={`product__review__star-btn ${value <= visibleRating ? "is-active" : ""}`}
                                                    aria-label={`${value} sao`}
                                                    onMouseEnter={() =>
                                                        setHoverRating(value)
                                                    }
                                                    onMouseLeave={() =>
                                                        setHoverRating(0)
                                                    }
                                                    onClick={() =>
                                                        setDraftRating(value)
                                                    }
                                                >
                                                    <i
                                                        className={
                                                            value <=
                                                            visibleRating
                                                                ? "fa fa-star"
                                                                : "fa fa-star-o"
                                                        }
                                                    />
                                                </button>
                                            ))}
                                            <span className="product__review__notice">
                                                {visibleRating
                                                    ? `${visibleRating}/5 sao`
                                                    : "Chọn số sao"}
                                            </span>
                                        </div>

                                        <textarea
                                            className="product__review__textarea"
                                            value={draftText}
                                            onChange={(event) =>
                                                setDraftText(event.target.value)
                                            }
                                        />

                                        <div className="product__reviews__edit-actions">
                                            <button
                                                type="button"
                                                className="product__review__submit"
                                                onClick={() =>
                                                    submitEditing(review.id)
                                                }
                                                disabled={isSaving}
                                            >
                                                {isSaving
                                                    ? "Đang lưu..."
                                                    : "Lưu"}
                                            </button>
                                            <button
                                                type="button"
                                                className="product__reviews__action-btn"
                                                onClick={stopEditing}
                                                disabled={isSaving}
                                            >
                                                Hủy
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="product__reviews__meta">
                                            <div>
                                                <p className="product__reviews__author">
                                                    {review.user?.username ??
                                                        "Người dùng ẩn danh"}
                                                </p>
                                                <div className="product__reviews__stars">
                                                    {renderStars(
                                                        Number(
                                                            review.rating || 0,
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                            <div className="product__reviews__meta-actions">
                                                <span className="product__reviews__date">
                                                    {formatDate(
                                                        review.created_at,
                                                    )}
                                                </span>
                                                {isOwnReview && (
                                                    <div className="product__reviews__own-actions">
                                                        <button
                                                            type="button"
                                                            className="product__reviews__action-link"
                                                            onClick={() =>
                                                                startEditing(
                                                                    review,
                                                                )
                                                            }
                                                        >
                                                            Sửa
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="product__reviews__action-link product__reviews__action-link--danger"
                                                            onClick={() =>
                                                                deleteReview(
                                                                    review.id,
                                                                )
                                                            }
                                                        >
                                                            Xóa
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <p className="product__reviews__text">
                                            {review.review_text}
                                        </p>
                                    </>
                                )}
                            </article>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ProductReviewList;
