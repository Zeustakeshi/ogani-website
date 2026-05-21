import React from "react";

interface CategorySidebarProps {}

const CategorySidebar: React.FC<CategorySidebarProps> = () => {
    return (
        <div className="sidebar__item">
            <h4>Department</h4>
            <ul>
                <li>
                    <a href="#">Fresh Meat</a>
                </li>
                <li>
                    <a href="#">Vegetables</a>
                </li>
                <li>
                    <a href="#">Fruit &amp; Nut Gifts</a>
                </li>
                <li>
                    <a href="#">Fresh Berries</a>
                </li>
                <li>
                    <a href="#">Ocean Foods</a>
                </li>
                <li>
                    <a href="#">Butter &amp; Eggs</a>
                </li>
                <li>
                    <a href="#">Fastfood</a>
                </li>
                <li>
                    <a href="#">Fresh Onion</a>
                </li>
                <li>
                    <a href="#">Papayaya &amp; Crisps</a>
                </li>
                <li>
                    <a href="#">Oatmeal</a>
                </li>
                <li>
                    <a href="#">Fresh Bananas</a>
                </li>
            </ul>
        </div>
    );
};

export default CategorySidebar;
