import React from "react";

interface SearchBarProps {}

const SearchBar: React.FC<SearchBarProps> = () => {
    return (
        <div className="header__search">
            <form action="#">
                <input type="text" placeholder="All Categories" />
                <input type="text" placeholder="SEARCH" />
                <button type="submit">
                    <span className="icon_search"></span>
                </button>
            </form>
        </div>
    );
};

export default SearchBar;
