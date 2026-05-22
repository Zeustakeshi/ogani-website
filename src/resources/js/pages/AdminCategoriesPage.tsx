import api from "@/services/api";
import React, { useEffect, useMemo, useState } from "react";

type AdminCategory = {
    id: string;
    name: string;
    description: string;
    created_at?: string | null;
    updated_at?: string | null;
};

type CategoryListResponse = {
    data?: AdminCategory[];
    meta?: {
        current_page?: number;
        last_page?: number;
        total?: number;
    };
};

type CategoryDetailResponse = {
    data?: AdminCategory;
} & AdminCategory;

type CategoryFormState = {
    name: string;
    description: string;
};

const createEmptyFormState = (): CategoryFormState => ({
    name: "",
    description: "",
});

const formatDateTime = (value?: string | null) => {
    if (!value) {
        return "-";
    }

    return new Intl.DateTimeFormat("vi-VN", {
        dateStyle: "short",
        timeStyle: "short",
    }).format(new Date(value));
};

const normalizeCategory = (
    payload: CategoryDetailResponse | undefined,
): AdminCategory | null => {
    const category = payload?.data ?? payload;

    if (!category?.id) {
        return null;
    }

    return {
        id: String(category.id),
        name: category.name ?? "",
        description: category.description ?? "",
        created_at: category.created_at ?? null,
        updated_at: category.updated_at ?? null,
    };
};

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<AdminCategory[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
        null,
    );
    const [formState, setFormState] = useState<CategoryFormState>(
        createEmptyFormState(),
    );
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

    const selectedCategory = useMemo(
        () =>
            categories.find((category) => category.id === selectedCategoryId) ??
            null,
        [categories, selectedCategoryId],
    );

    const isEditing = Boolean(selectedCategory);

    const loadCategories = async (guard?: () => boolean) => {
        setIsLoading(true);
        setLoadError(null);

        try {
            const response = await api.get<CategoryListResponse>(
                "/categories",
                {
                    params: {
                        per_page: 1000,
                    },
                },
            );

            if (guard && !guard()) {
                return;
            }

            setCategories(response.data?.data ?? []);
        } catch {
            if (!guard || guard()) {
                setCategories([]);
                setLoadError("Không thể tải danh sách danh mục.");
            }
        } finally {
            if (!guard || guard()) {
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        let isActive = true;

        void loadCategories(() => isActive);

        return () => {
            isActive = false;
        };
    }, []);

    const resetForm = () => {
        setSelectedCategoryId(null);
        setFormState(createEmptyFormState());
    };

    const handleEdit = (category: AdminCategory) => {
        setSelectedCategoryId(category.id);
        setFormState({
            name: category.name ?? "",
            description: category.description ?? "",
        });
        setSaveError(null);
        setSaveSuccess(null);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const name = formState.name.trim();
        const description = formState.description.trim();

        if (!name || !description) {
            setSaveError("Vui lòng nhập đầy đủ tên và mô tả danh mục.");
            return;
        }

        if (isEditing && selectedCategory) {
            const hasChanges =
                name !== (selectedCategory.name ?? "").trim() ||
                description !== (selectedCategory.description ?? "").trim();

            if (!hasChanges) {
                setSaveError("Không có thay đổi nào để cập nhật.");
                return;
            }
        }

        setIsSaving(true);
        setSaveError(null);
        setSaveSuccess(null);

        try {
            if (isEditing && selectedCategory) {
                const response = await api.patch<CategoryDetailResponse>(
                    `/categories/${selectedCategory.id}`,
                    {
                        name,
                        description,
                    },
                    { suppressUnauthorizedRedirect: true } as any,
                );

                const updatedCategory = normalizeCategory(response.data);

                if (updatedCategory) {
                    setCategories((current) =>
                        current.map((category) =>
                            category.id === updatedCategory.id
                                ? updatedCategory
                                : category,
                        ),
                    );
                    setSelectedCategoryId(updatedCategory.id);
                    setFormState({
                        name: updatedCategory.name,
                        description: updatedCategory.description,
                    });
                }

                setSaveSuccess("Đã cập nhật danh mục.");
            } else {
                const response = await api.post<CategoryDetailResponse>(
                    "/categories",
                    {
                        name,
                        description,
                    },
                    { suppressUnauthorizedRedirect: true } as any,
                );

                const createdCategory = normalizeCategory(response.data);

                if (createdCategory) {
                    setCategories((current) => [createdCategory, ...current]);
                }

                setFormState(createEmptyFormState());
                setSaveSuccess("Đã tạo danh mục mới.");
            }
        } catch (error: any) {
            setSaveError(
                error?.response?.status === 401
                    ? "Phiên đăng nhập không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập admin lại."
                    : error?.response?.data?.message ||
                          "Không thể lưu danh mục. Vui lòng thử lại.",
            );
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <section className="admin-page">
            <div className="admin-page__header">
                <div>
                    <span className="admin-page__eyebrow">
                        Quản lý danh mục
                    </span>
                    <h1>Danh mục</h1>
                    <p>
                        Tạo danh mục mới, xem toàn bộ danh sách và chỉnh sửa
                        thông tin ngay trên cùng một màn hình.
                    </p>
                </div>
            </div>

            <div className="admin-page__category-grid">
                <div className="admin-page__category-panel">
                    <div>
                        <h2>
                            {isEditing
                                ? "Chỉnh sửa danh mục"
                                : "Tạo danh mục mới"}
                        </h2>
                        <p>
                            Nhập thông tin để{" "}
                            {isEditing ? "cập nhật" : "tạo mới"} danh mục trong
                            hệ thống.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} noValidate>
                        <div className="admin-page__form-grid">
                            <div className="admin-auth-page__field admin-page__form-grid--full">
                                <label htmlFor="category-name">
                                    Tên danh mục
                                </label>
                                <input
                                    id="category-name"
                                    type="text"
                                    value={formState.name}
                                    onChange={(event) =>
                                        setFormState((current) => ({
                                            ...current,
                                            name: event.target.value,
                                        }))
                                    }
                                    placeholder="VD: Thực phẩm"
                                />
                            </div>

                            <div className="admin-auth-page__field admin-page__form-grid--full">
                                <label htmlFor="category-description">
                                    Mô tả
                                </label>
                                <textarea
                                    id="category-description"
                                    value={formState.description}
                                    onChange={(event) =>
                                        setFormState((current) => ({
                                            ...current,
                                            description: event.target.value,
                                        }))
                                    }
                                    placeholder="Nhập mô tả ngắn cho danh mục"
                                    rows={5}
                                />
                            </div>
                        </div>

                        {saveError && (
                            <p className="admin-page__form-error">
                                {saveError}
                            </p>
                        )}
                        {saveSuccess && (
                            <p className="admin-page__form-success">
                                {saveSuccess}
                            </p>
                        )}

                        <div className="admin-page__category-toolbar">
                            <button
                                type="submit"
                                className="admin-page__action-link"
                                disabled={isSaving}
                            >
                                {isSaving
                                    ? "Đang lưu..."
                                    : isEditing
                                      ? "Cập nhật danh mục"
                                      : "Tạo danh mục"}
                            </button>

                            {isEditing && (
                                <button
                                    type="button"
                                    className="admin-page__secondary-link"
                                    onClick={resetForm}
                                    disabled={isSaving}
                                >
                                    Hủy chỉnh sửa
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <div className="admin-page__table-card admin-page__table-card--categories">
                    <div className="admin-page__table-head">
                        <span>Tên danh mục</span>
                        <span>Mô tả</span>
                        <span>Cập nhật</span>
                        <span>Hành động</span>
                    </div>

                    <div className="admin-page__table-body">
                        {isLoading && (
                            <article className="admin-page__table-row">
                                <strong>Đang tải dữ liệu...</strong>
                                <span>-</span>
                                <span>-</span>
                                <span>-</span>
                            </article>
                        )}

                        {!isLoading && loadError && (
                            <article className="admin-page__table-row">
                                <strong>{loadError}</strong>
                                <span>-</span>
                                <span>-</span>
                                <span>-</span>
                            </article>
                        )}

                        {!isLoading &&
                            !loadError &&
                            categories.length === 0 && (
                                <div className="admin-page__empty-state">
                                    Chưa có danh mục nào trong hệ thống.
                                </div>
                            )}

                        {!isLoading &&
                            !loadError &&
                            categories.map((category) => (
                                <article
                                    key={category.id}
                                    className={`admin-page__table-row${
                                        selectedCategoryId === category.id
                                            ? " is-selected"
                                            : ""
                                    }`}
                                >
                                    <strong>{category.name}</strong>
                                    <div className="admin-page__table-cell-wrap">
                                        <span>{category.description}</span>
                                    </div>
                                    <span>
                                        {formatDateTime(
                                            category.updated_at ||
                                                category.created_at,
                                        )}
                                    </span>
                                    <div className="admin-page__row-actions">
                                        <button
                                            type="button"
                                            className="admin-page__view-link"
                                            onClick={() => handleEdit(category)}
                                        >
                                            Sửa
                                        </button>
                                    </div>
                                </article>
                            ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
