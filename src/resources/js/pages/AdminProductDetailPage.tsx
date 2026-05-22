import ProductGallery from "@/components/product/ProductGallery";
import { PATHS } from "@/router/paths";
import api from "@/services/api";
import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

type AdminProductDetail = {
    id: string;
    name: string;
    price: number;
    description: string;
    is_availability: boolean;
    reviews: number;
    weight: number;
    images: string[];
};

type ProductDetailResponse = {
    data?: AdminProductDetail;
} & AdminProductDetail;

type ProductFormState = {
    name: string;
    price: string;
    description: string;
    weight: string;
    isAvailability: boolean;
};

const fallbackImage = "/img/product/details/product-details-1.jpg";

const normalizeProduct = (
    payload: ProductDetailResponse | undefined,
): AdminProductDetail | null => {
    const product = payload?.data ?? payload;

    if (!product?.id) {
        return null;
    }

    return {
        id: String(product.id),
        name: product.name ?? "",
        price: Number(product.price ?? 0),
        description: product.description ?? "",
        is_availability: Boolean(product.is_availability),
        reviews: Number(product.reviews ?? 0),
        weight: Number(product.weight ?? 0),
        images: Array.isArray(product.images) ? product.images : [],
    };
};

const AdminProductDetailPage: React.FC = () => {
    const { id } = useParams();
    const [product, setProduct] = useState<AdminProductDetail | null>(null);
    const [formState, setFormState] = useState<ProductFormState>({
        name: "",
        price: "",
        description: "",
        weight: "",
        isAvailability: true,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

    const priceFormatter = useMemo(
        () =>
            new Intl.NumberFormat("vi-VN", {
                maximumFractionDigits: 0,
            }),
        [],
    );

    useEffect(() => {
        if (!id) {
            setLoadError("Không tìm thấy sản phẩm cần chỉnh sửa.");
            setIsLoading(false);
            return;
        }

        let isActive = true;

        (async () => {
            setIsLoading(true);
            setLoadError(null);
            setSaveError(null);
            setSaveSuccess(null);

            try {
                const response = await api.get<ProductDetailResponse>(
                    `/products/${id}`,
                );
                const normalizedProduct = normalizeProduct(response.data);

                if (!isActive) {
                    return;
                }

                if (!normalizedProduct) {
                    setLoadError("Không thể tải thông tin sản phẩm.");
                    setProduct(null);
                    setFormState({
                        name: "",
                        price: "",
                        description: "",
                        weight: "",
                        isAvailability: true,
                    });
                    return;
                }

                setProduct(normalizedProduct);
                setFormState({
                    name: normalizedProduct.name,
                    price: String(normalizedProduct.price),
                    description: normalizedProduct.description,
                    weight: String(normalizedProduct.weight),
                    isAvailability: normalizedProduct.is_availability,
                });
            } catch {
                if (isActive) {
                    setLoadError(
                        "Không thể tải thông tin sản phẩm. Vui lòng thử lại.",
                    );
                    setProduct(null);
                    setFormState({
                        name: "",
                        price: "",
                        description: "",
                        weight: "",
                        isAvailability: true,
                    });
                }
            } finally {
                if (isActive) {
                    setIsLoading(false);
                }
            }
        })();

        return () => {
            isActive = false;
        };
    }, [id]);

    const hasChanges =
        Boolean(product) &&
        (formState.name.trim() !== (product?.name ?? "").trim() ||
            formState.price.trim() !== String(product?.price ?? "") ||
            formState.description.trim() !==
                (product?.description ?? "").trim() ||
            formState.weight.trim() !== String(product?.weight ?? "") ||
            formState.isAvailability !== (product?.is_availability ?? true));

    const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!id || !hasChanges) {
            return;
        }

        setIsSaving(true);
        setSaveError(null);
        setSaveSuccess(null);

        try {
            const response = await api.patch<ProductDetailResponse>(
                `/products/${id}`,
                {
                    name: formState.name.trim(),
                    price: Number(formState.price),
                    description: formState.description.trim(),
                    weight: Number(formState.weight),
                    is_availability: formState.isAvailability,
                },
                { suppressUnauthorizedRedirect: true } as any,
            );

            const updatedProduct = normalizeProduct(response.data);

            if (updatedProduct) {
                setProduct(updatedProduct);
                setFormState({
                    name: updatedProduct.name,
                    price: String(updatedProduct.price),
                    description: updatedProduct.description,
                    weight: String(updatedProduct.weight),
                    isAvailability: updatedProduct.is_availability,
                });
            }

            setSaveSuccess("Đã cập nhật thông tin sản phẩm.");
        } catch (error: any) {
            setSaveError(
                error?.response?.status === 401
                    ? "Phiên đăng nhập không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập admin lại."
                    : error?.response?.data?.message ||
                          "Không thể cập nhật sản phẩm. Vui lòng thử lại.",
            );
        } finally {
            setIsSaving(false);
        }
    };

    const galleryImages = product?.images ?? [];
    const mainImage = galleryImages[0] || fallbackImage;
    const thumbnails =
        galleryImages.length > 1
            ? galleryImages.slice(1).map((image) => ({
                  bigImage: image,
                  thumbnailImage: image,
              }))
            : [
                  {
                      bigImage: mainImage,
                      thumbnailImage: mainImage,
                  },
              ];

    const inputStyle = {
        width: "100%",
        height: 54,
        border: "1px solid #dfe7d2",
        borderRadius: 0,
        padding: "0 18px",
        fontSize: 15,
        color: "#1c1c1c",
        background: "#ffffff",
    };

    const successAlertStyle = {
        borderRadius: 0,
        background: "rgba(127, 173, 57, 0.10)",
        color: "#4f7d1f",
        border: "1px solid rgba(127, 173, 57, 0.22)",
    };

    const imageColumnStyle = {
        maxWidth: "full",
        margin: "0 auto",
    };

    const imageBoxStyle = {
        transform: "scale(0.78)",
        transformOrigin: "top center",
    };

    return (
        <section className="admin-page">
            <div className="admin-page__header">
                <div>
                    <h1>Chi tiết sản phẩm</h1>
                    <p>
                        Chỉnh sửa nhanh thông tin sản phẩm trong giao diện
                        phẳng, không dùng bo góc.
                    </p>
                </div>
                <div>
                    <Link
                        className="admin-page__view-link"
                        to="/admin/products"
                    >
                        Quay lại danh sách
                    </Link>
                </div>
            </div>

            {isLoading ? (
                <div
                    className="admin-page__table-card"
                    style={{ padding: 24, borderRadius: 0 }}
                >
                    <p>Đang tải thông tin sản phẩm...</p>
                </div>
            ) : loadError ? (
                <div
                    className="admin-page__table-card"
                    style={{ padding: 24, borderRadius: 0 }}
                >
                    <p>{loadError}</p>
                </div>
            ) : product ? (
                <div className="row">
                    <div className="col-lg-6 col-md-12">
                        <div
                            className="product__details__pic"
                            style={imageColumnStyle}
                        >
                            <div style={imageBoxStyle}>
                                <ProductGallery
                                    mainImage={mainImage}
                                    thumbnails={thumbnails}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-6 col-md-12">
                        <div
                            style={{
                                background: "rgba(255, 255, 255, 0.96)",
                                border: "1px solid rgba(28, 28, 28, 0.06)",
                                boxShadow: "0 16px 34px rgba(28, 28, 28, 0.06)",
                                padding: 32,
                                borderRadius: 0,
                            }}
                        >
                            <h2 style={{ marginBottom: 12 }}>
                                Chỉnh sửa sản phẩm
                            </h2>
                            <p style={{ marginBottom: 24 }}>
                                Mã sản phẩm được khóa. Các trường còn lại có thể
                                chỉnh sửa trực tiếp.
                            </p>

                            <form onSubmit={handleSave} noValidate>
                                <div className="admin-auth-page__field">
                                    <label htmlFor="admin-product-name">
                                        Tên sản phẩm
                                    </label>
                                    <input
                                        id="admin-product-name"
                                        name="name"
                                        type="text"
                                        value={formState.name}
                                        onChange={(event) =>
                                            setFormState((current) => ({
                                                ...current,
                                                name: event.target.value,
                                            }))
                                        }
                                        placeholder="Nhập tên sản phẩm"
                                        style={{ ...inputStyle }}
                                    />
                                </div>

                                <div className="admin-auth-page__field">
                                    <label htmlFor="admin-product-code">
                                        Mã sản phẩm
                                    </label>
                                    <input
                                        id="admin-product-code"
                                        value={product.id}
                                        disabled
                                        readOnly
                                        style={{ ...inputStyle }}
                                    />
                                </div>

                                <div className="admin-auth-page__field">
                                    <label htmlFor="admin-product-price">
                                        Giá
                                    </label>
                                    <input
                                        id="admin-product-price"
                                        name="price"
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={formState.price}
                                        onChange={(event) =>
                                            setFormState((current) => ({
                                                ...current,
                                                price: event.target.value,
                                            }))
                                        }
                                        placeholder="Nhập giá sản phẩm"
                                        style={{ ...inputStyle }}
                                    />
                                </div>

                                <div className="admin-auth-page__field">
                                    <label htmlFor="admin-product-weight">
                                        Cân nặng
                                    </label>
                                    <input
                                        id="admin-product-weight"
                                        name="weight"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={formState.weight}
                                        onChange={(event) =>
                                            setFormState((current) => ({
                                                ...current,
                                                weight: event.target.value,
                                            }))
                                        }
                                        placeholder="Nhập cân nặng sản phẩm"
                                        style={{ ...inputStyle }}
                                    />
                                </div>

                                <div className="admin-auth-page__field">
                                    <label htmlFor="admin-product-status">
                                        Trạng thái
                                    </label>
                                    <select
                                        id="admin-product-status"
                                        value={
                                            formState.isAvailability ? "1" : "0"
                                        }
                                        onChange={(event) =>
                                            setFormState((current) => ({
                                                ...current,
                                                isAvailability:
                                                    event.target.value === "1",
                                            }))
                                        }
                                        style={{
                                            ...inputStyle,
                                            padding: "0 14px",
                                        }}
                                    >
                                        <option value="1">Đang bán</option>
                                        <option value="0">Ngừng bán</option>
                                    </select>
                                </div>

                                <div className="admin-auth-page__field">
                                    <label htmlFor="admin-product-description">
                                        Mô tả
                                    </label>
                                    <textarea
                                        id="admin-product-description"
                                        name="description"
                                        value={formState.description}
                                        onChange={(event) =>
                                            setFormState((current) => ({
                                                ...current,
                                                description: event.target.value,
                                            }))
                                        }
                                        placeholder="Nhập mô tả sản phẩm"
                                        rows={8}
                                        style={{
                                            width: "100%",
                                            border: "1px solid #dfe7d2",
                                            borderRadius: 0,
                                            padding: 18,
                                            fontSize: 15,
                                            color: "#1c1c1c",
                                            resize: "vertical",
                                        }}
                                    />
                                </div>

                                {saveError ? (
                                    <div
                                        className="admin-auth-page__alert"
                                        style={{ borderRadius: 0 }}
                                    >
                                        {saveError}
                                    </div>
                                ) : null}

                                {saveSuccess ? (
                                    <div
                                        className="admin-auth-page__alert"
                                        style={successAlertStyle}
                                    >
                                        {saveSuccess}
                                    </div>
                                ) : null}

                                <button
                                    type="submit"
                                    className="admin-auth-page__submit"
                                    disabled={isSaving || !hasChanges}
                                    style={{ borderRadius: 0 }}
                                >
                                    {isSaving
                                        ? "Đang cập nhật..."
                                        : "Cập nhật sản phẩm"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            ) : null}
        </section>
    );
};

export default AdminProductDetailPage;
