import React, { useState } from "react";

interface BillingFormProps {
    address: string;
    orderNote: string;
    onAddressChange: (value: string) => void;
    onOrderNoteChange: (value: string) => void;
}

const BillingForm: React.FC<BillingFormProps> = ({
    address,
    orderNote,
    onAddressChange,
    onOrderNoteChange,
}) => {
    const [location, setLocation] = useState<{
        latitude: number;
        longitude: number;
    } | null>(null);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [isLocating, setIsLocating] = useState(false);

    const mapUrl = location
        ? `https://www.openstreetmap.org/export/embed.html?bbox=${(
              location.longitude - 0.01
          ).toFixed(6)}%2C${(location.latitude - 0.01).toFixed(6)}%2C${(
              location.longitude + 0.01
          ).toFixed(
              6,
          )}%2C${(location.latitude + 0.01).toFixed(6)}&layer=mapnik&marker=${location.latitude.toFixed(6)}%2C${location.longitude.toFixed(6)}`
        : null;

    const handleUseCurrentLocation = () => {
        setLocationError(null);

        if (!navigator.geolocation) {
            setLocationError("Trình duyệt của bạn không hỗ trợ lấy vị trí.");
            return;
        }

        setIsLocating(true);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;

                setLocation({ latitude, longitude });
                onAddressChange(
                    `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
                );
                setIsLocating(false);
            },
            () => {
                setLocationError(
                    "Không thể lấy vị trí hiện tại. Vui lòng kiểm tra quyền truy cập vị trí.",
                );
                setIsLocating(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            },
        );
    };

    return (
        <>
            <div className="checkout__input checkout__input--address">
                <p>
                    Địa chỉ<span>*</span>
                </p>
                <div className="checkout__address-row">
                    <input
                        type="text"
                        value={address}
                        onChange={(event) =>
                            onAddressChange(event.target.value)
                        }
                        placeholder="Nhập địa chỉ giao hàng"
                    />
                    <button
                        type="button"
                        className="checkout__location-button"
                        onClick={handleUseCurrentLocation}
                        disabled={isLocating}
                    >
                        {isLocating
                            ? "Đang lấy vị trí..."
                            : "Lấy vị trí hiện tại"}
                    </button>
                </div>
                {locationError && (
                    <p className="checkout__input__error">{locationError}</p>
                )}
                {mapUrl && (
                    <div className="checkout__map">
                        <iframe
                            title="OpenStreetMap preview"
                            src={mapUrl}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>
                )}
            </div>

            <div className="checkout__input">
                <p>
                    Order note<span>*</span>
                </p>
                <textarea
                    value={orderNote}
                    onChange={(event) => onOrderNoteChange(event.target.value)}
                    placeholder="Ghi chú cho đơn hàng, ví dụ: giao giờ hành chính, gọi trước khi đến..."
                    rows={5}
                />
            </div>
        </>
    );
};

export default BillingForm;
