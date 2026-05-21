import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "site" | "primary";
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
    variant = "site",
    children,
    className = "",
    ...props
}) => {
    const baseClass = variant === "primary" ? "primary-btn" : "site-btn";

    return (
        <button className={`${baseClass} ${className}`} {...props}>
            {children}
        </button>
    );
};

export default Button;
