import React, { useEffect, useState } from "react";
import CategorySidebar from "../common/CategorySidebar";
import { useSearchParams } from "react-router-dom";

interface ShopSidebarProps {}

const ShopSidebar: React.FC<ShopSidebarProps> = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const getParam = (key: string) => searchParams.get(key) ?? "";

    const [min, setMin] = useState<string>(getParam("min_price"));
    const [max, setMax] = useState<string>(getParam("max_price"));
    const [selectedSizes, setSelectedSizes] = useState<string[]>(
        getParam("size") ? getParam("size").split(",") : [],
    );

    useEffect(() => {
        setMin(getParam("min_price"));
        setMax(getParam("max_price"));
        setSelectedSizes(getParam("size") ? getParam("size").split(",") : []);
    }, [searchParams]);

    const updateParams = (entries: Record<string, string | null>) => {
        const next = new URLSearchParams(searchParams as any);

        Object.entries(entries).forEach(([key, value]) => {
            if (value === null || value === "") {
                next.delete(key);
            } else {
                next.set(key, value);
            }
        });

        next.delete("page");
        setSearchParams(next);
    };

    const clampPrice = (value: number) => {
        if (Number.isNaN(value)) return 10;
        return Math.max(10, Math.min(540, value));
    };

    const formatPrice = (value: number) =>
        new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            maximumFractionDigits: 0,
        }).format(value);

    const handleMinPriceChange = (value: string) => {
        const normalized = String(clampPrice(Number(value)));
        setMin(normalized);
        if (max && Number(normalized) > Number(max)) {
            setMax(normalized);
        }
    };

    const handleMaxPriceChange = (value: string) => {
        const normalized = String(clampPrice(Number(value)));
        setMax(normalized);
        if (min && Number(normalized) < Number(min)) {
            setMin(normalized);
        }
    };

    const getWeightRangeFromSizes = (sizes: string[]) => {
        const SIZE_RULES: Record<
            string,
            { min?: number | null; max?: number | null }
        > = {
            large: { min: 5, max: null },
            medium: { min: 3, max: 5 },
            small: { min: 1, max: 3 },
            tiny: { min: null, max: 1 },
        };

        if (sizes.length === 0) {
            return { min_weight: null, max_weight: null };
        }

        const mins = sizes.map((size) => SIZE_RULES[size]?.min ?? 0);
        const maxs = sizes.map((size) => SIZE_RULES[size]?.max ?? Infinity);

        const overallMin = mins.length > 0 ? Math.min(...mins) : null;
        const overallMaxVal = maxs.length > 0 ? Math.max(...maxs) : null;
        const overallMax = overallMaxVal === Infinity ? null : overallMaxVal;

        return {
            min_weight: overallMin !== null ? String(overallMin) : null,
            max_weight: overallMax !== null ? String(overallMax) : null,
        };
    };

    const applyFilters = () => {
        updateParams({
            min_price: min || null,
            max_price: max || null,
            size: selectedSizes.length > 0 ? selectedSizes.join(",") : null,
            ...getWeightRangeFromSizes(selectedSizes),
        });
    };

    const clearFilters = () => {
        setMin("");
        setMax("");
        setSelectedSizes([]);
        updateParams({
            category_id: null,
            search: null,
            sort: null,
            color: null,
            min_price: null,
            max_price: null,
            min_weight: null,
            max_weight: null,
            size: null,
        });
    };

    const onSizeToggle = (value: string) => {
        const next = new Set(selectedSizes);
        if (next.has(value)) {
            next.delete(value);
        } else {
            next.add(value);
        }
        const arr = Array.from(next);
        setSelectedSizes(arr);
    };

    return (
        <div className="sidebar">
            <div className="sidebar__actions sidebar__actions--top">
                <button
                    type="button"
                    className="sidebar__reset"
                    onClick={clearFilters}
                >
                    Clear Filters
                </button>
                <button
                    type="button"
                    className="sidebar__apply"
                    onClick={applyFilters}
                >
                    Apply Filters
                </button>
            </div>

            <div className="sidebar__item">
                <h4>Price</h4>
                <div className="price-range-wrap">
                    <div className="range-slider">
                        <div className="slider-labels">
                            <span>{formatPrice(Number(min || 10))}</span>
                            <span>{formatPrice(Number(max || 540))}</span>
                        </div>
                        <div className="range-inputs">
                            <input
                                type="range"
                                min={10}
                                max={540}
                                value={min || "10"}
                                onChange={(e) => {
                                    handleMinPriceChange(e.target.value);
                                }}
                            />
                            <input
                                type="range"
                                min={10}
                                max={540}
                                value={max || "540"}
                                onChange={(e) => {
                                    handleMaxPriceChange(e.target.value);
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="sidebar__item">
                <h4>Popular Size</h4>
                {[
                    { id: "large", label: "Large" },
                    { id: "medium", label: "Medium" },
                    { id: "small", label: "Small" },
                    { id: "tiny", label: "Tiny" },
                ].map((s) => (
                    <div className="sidebar__item__size" key={s.id}>
                        <label
                            htmlFor={`size-${s.id}`}
                            className={
                                selectedSizes.includes(s.id) ? "active" : ""
                            }
                        >
                            {s.label}
                            <input
                                type="checkbox"
                                id={`size-${s.id}`}
                                checked={selectedSizes.includes(s.id)}
                                onChange={() => onSizeToggle(s.id)}
                            />
                        </label>
                    </div>
                ))}
            </div>

            <CategorySidebar />
        </div>
    );
};

export default ShopSidebar;
