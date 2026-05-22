import React, { useEffect, useMemo, useRef, useState } from "react";

interface SortBarProps {
    options?: Array<{ label: string; value: string }>;
    value?: string;
    onSortChange?: (value: string) => void;
}

const SortBar: React.FC<SortBarProps> = ({
    options = [
        { label: "Default", value: "" },
        { label: "Rating: High to Low", value: "rating_desc" },
        { label: "Price: Low to High", value: "price_asc" },
        { label: "Price: High to Low", value: "price_desc" },
    ],
    value,
    onSortChange,
}) => {
    const normalizedOptions = useMemo(
        () =>
            options.length > 0 ? options : [{ label: "Default", value: "" }],
        [options],
    );
    const [selected, setSelected] = useState(
        value ?? normalizedOptions[0].value,
    );
    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (value !== undefined) {
            setSelected(value);
            return;
        }

        if (
            normalizedOptions.length > 0 &&
            !normalizedOptions.some((option) => option.value === selected)
        ) {
            setSelected(normalizedOptions[0].value);
        }
    }, [normalizedOptions, selected, value]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                rootRef.current &&
                event.target instanceof Node &&
                !rootRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const selectedOption =
        normalizedOptions.find((option) => option.value === selected) ??
        normalizedOptions[0];

    const handleSelect = (value: string) => {
        setSelected(value);
        setOpen(false);
        onSortChange?.(value);
    };

    return (
        <div className="filter__sort">
            <span>Sort By</span>
            <div
                ref={rootRef}
                className={`nice-select${open ? " open" : ""}`}
                tabIndex={0}
                role="button"
                aria-haspopup="listbox"
                aria-expanded={open}
                onClick={() => setOpen((current) => !current)}
                onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setOpen((current) => !current);
                    }
                }}
            >
                <span className="current">{selectedOption.label}</span>
                <ul className="list" role="listbox">
                    {normalizedOptions.map((option) => (
                        <li
                            key={option.value}
                            className={`option${option.value === selected ? " selected focus" : ""}`}
                            role="option"
                            aria-selected={option.value === selected}
                            onClick={(event) => {
                                event.stopPropagation();
                                handleSelect(option.value);
                            }}
                        >
                            {option.label}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default SortBar;
