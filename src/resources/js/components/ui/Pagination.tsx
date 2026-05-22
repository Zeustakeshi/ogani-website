import React from "react";

interface PaginationProps {
    currentPage?: number;
    totalPages?: number;
    totalCount?: number;
    onPageChange?: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage = 1,
    totalPages = 3,
    totalCount = 16,
    onPageChange,
}) => {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    const handlePageClick = (
        event: React.MouseEvent<HTMLAnchorElement>,
        page: number,
    ) => {
        event.preventDefault();

        if (page < 1 || page > totalPages || page === currentPage) {
            return;
        }

        onPageChange?.(page);
    };

    return (
        <div className="pagination-option">
            <div className="product-count">
                <span>{totalCount} Products found</span>
            </div>
            <div className="product-pagination product__pagination">
                {pages.map((page) => (
                    <a
                        key={page}
                        href="#"
                        className={page === currentPage ? "active" : ""}
                        onClick={(event) => handlePageClick(event, page)}
                    >
                        {page}
                    </a>
                ))}
                <a
                    href="#"
                    onClick={(event) => handlePageClick(event, currentPage + 1)}
                    className={currentPage >= totalPages ? "disabled" : ""}
                >
                    <i className="fa fa-angle-double-right"></i>
                </a>
            </div>
        </div>
    );
};

export default Pagination;
