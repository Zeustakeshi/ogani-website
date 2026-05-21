import React, { useEffect, useMemo, useRef, useState } from "react";

interface SortBarProps {
    options?: Array<{ label: string; value: string }>;
    onSortChange?: (value: string) => void;
}

const SortBar: React.FC<SortBarProps> = ({
    options = [
        { label: "Default", value: "0" },
        { label: "Default", value: "1" },
    ],
    onSortChange,
}) => {
    const normalizedOptions = useMemo(
        () =>
            options.length > 0 ? options : [{ label: "Default", value: "0" }],
        [options],
    );
    const [selected, setSelected] = useState(normalizedOptions[0].value);
    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement | null>(null);

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
