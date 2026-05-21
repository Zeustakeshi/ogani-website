import React from "react";

interface BreadcrumbItem {
    label: string;
    path?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
    backgroundImage?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
    items,
    backgroundImage = "/img/breadcrumb.jpg",
}) => {
    const currentLabel = items[items.length - 1]?.label || "";

    return (
        <section
            className="breadcrumb-section set-bg"
            data-setbg={backgroundImage}
        >
            <div className="container">
                <div className="row">
                    <div className="col-lg-12 text-center">
                        <div className="breadcrumb__text">
                            <h2>{currentLabel}</h2>
                            <div className="breadcrumb__option">
                                {items.map((item, index) => {
                                    const isLast = index === items.length - 1;

                                    if (isLast) {
                                        return (
                                            <span
                                                key={`${item.label}-${index}`}
                                            >
                                                {item.label}
                                            </span>
                                        );
                                    }

                                    return (
                                        <a
                                            key={`${item.label}-${index}`}
                                            href={item.path || "#"}
                                        >
                                            {item.label}
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Breadcrumb;
