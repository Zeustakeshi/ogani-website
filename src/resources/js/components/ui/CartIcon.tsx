import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { PATHS } from "@/router/paths";
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

interface CartIconProps {
    className?: string;
}

type CartSummaryResponse = {
    data?: {
        item_count?: number;
        total?: number;
    };
} & Partial<{
    item_count: number;
    total: number;
}>;

const CartIcon: React.FC<CartIconProps> = ({ className = "header__cart" }) => {
    const { user } = useAuth();
    const [itemCount, setItemCount] = useState(0);
    const [total, setTotal] = useState(0);

    const priceFormatter = useMemo(
        () =>
            new Intl.NumberFormat("vi-VN", {
                maximumFractionDigits: 0,
            }),
        [],
    );

    useEffect(() => {
        let isActive = true;

        const loadSummary = async () => {
            if (!user?.id) {
                if (isActive) {
                    setItemCount(0);
                    setTotal(0);
                }

                return;
            }

            try {
                const response = await api.get<CartSummaryResponse>(
                    "/cart/summary",
                    {
                        suppressUnauthorizedRedirect: true,
                    } as any,
                );

                if (!isActive) {
                    return;
                }

                const payload = response.data?.data ?? response.data;

                setItemCount(Number(payload?.item_count ?? 0));
                setTotal(Number(payload?.total ?? 0));
            } catch {
                if (isActive) {
                    setItemCount(0);
                    setTotal(0);
                }
            }
        };

        void loadSummary();

        const handleCartUpdated = () => {
            void loadSummary();
        };

        window.addEventListener("cart:updated", handleCartUpdated);

        return () => {
            isActive = false;
            window.removeEventListener("cart:updated", handleCartUpdated);
        };
    }, [user?.id]);

    return (
        <div className={className}>
            <ul>
                <li>
                    <a href="#">
                        <i className="fa fa-heart"></i> <span>1</span>
                    </a>
                </li>
                <li>
                    <Link to={PATHS.CART}>
                        <i className="fa fa-shopping-bag"></i>{" "}
                        <span>{itemCount}</span>
                    </Link>
                </li>
            </ul>
            <div className="header__cart__price">
                item: <span>{`${priceFormatter.format(total)}đ`}</span>
            </div>
        </div>
    );
};

export default CartIcon;
