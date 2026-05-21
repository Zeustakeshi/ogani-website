import React from "react";

interface FilterPanelProps {
    onPriceChange?: (min: number, max: number) => void;
    onColorChange?: (color: string) => void;
    onSizeChange?: (size: string) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
    onPriceChange,
    onColorChange,
    onSizeChange,
}) => {
    return (
        <div className="filter__panel">
            {/* Price Filter */}
            <div className="filter__section">
                <h5>Price</h5>
                <div className="filter__price">
                    <input
                        type="number"
                        placeholder="Min"
                        onChange={(e) =>
                            onPriceChange?.(Number(e.target.value), 0)
                        }
                    />
                    <span>-</span>
                    <input
                        type="number"
                        placeholder="Max"
                        onChange={(e) =>
                            onPriceChange?.(0, Number(e.target.value))
                        }
                    />
                </div>
            </div>

            {/* Color Filter */}
            <div className="filter__section">
                <h5>Colors</h5>
                <div className="filter__colors">
                    {["White", "Gray", "Red", "Black", "Blue", "Green"].map(
                        (color) => (
                            <label key={color} className="filter__color__item">
                                <input
                                    type="checkbox"
                                    name="color"
                                    value={color.toLowerCase()}
                                    onChange={(e) =>
                                        onColorChange?.(e.target.value)
                                    }
                                />
                                <span
                                    className={`color__box ${color.toLowerCase()}`}
                                ></span>
                                {color}
                            </label>
                        ),
                    )}
                </div>
            </div>

            {/* Size Filter */}
            <div className="filter__section">
                <h5>Popular Size</h5>
                <div className="filter__sizes">
                    {["Large", "Medium", "Small", "Tiny"].map((size) => (
                        <label key={size} className="filter__size__item">
                            <input
                                type="checkbox"
                                name="size"
                                value={size.toLowerCase()}
                                onChange={(e) => onSizeChange?.(e.target.value)}
                            />
                            <span className="size__box">{size}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FilterPanel;
