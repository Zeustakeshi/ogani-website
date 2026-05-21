import React from "react";

interface BreadcrumbItem {
    label: string;
    path?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
    return (
        <div className="breadcrumb-option">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="breadcrumb__links">
                            {items.map((item, index) => {
                                const isLast = index === items.length - 1;
                                return isLast ? (
                                    <span key={index}>{item.label}</span>
                                ) : (
                                    <a key={index} href={item.path || "#"}>
                                        {index === 0 && (
                                            <i className="fa fa-home"></i>
                                        )}{" "}
                                        {item.label}
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Breadcrumb;
