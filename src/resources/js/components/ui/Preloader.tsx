import React from "react";

interface PreloaderProps {}

const Preloader: React.FC<PreloaderProps> = () => {
    return (
        <div id="preloder">
            <div className="loader"></div>
        </div>
    );
};

export default Preloader;
