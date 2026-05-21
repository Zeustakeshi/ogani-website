import React from "react";

interface PaginationProps {
    currentPage?: number;
    totalPages?: number;
    totalCount?: number;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage = 1,
    totalPages = 3,
    totalCount = 16,
}) => {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="pagination-option">
            <div className="product-count">
                <span>{totalCount} Products found</span>
            </div>
            <div className="product-pagination">
                {pages.map((page) => (
                    <a
                        key={page}
                        href="#"
                        className={page === currentPage ? "active" : ""}
                    >
                        {page}
                    </a>
                ))}
                <a href="#">
                    <i className="fa fa-angle-double-right"></i>
                </a>
            </div>
        </div>
    );
};

export default Pagination;
