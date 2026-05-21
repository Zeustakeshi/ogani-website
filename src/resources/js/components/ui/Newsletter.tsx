import React from "react";

interface NewsletterProps {}

const Newsletter: React.FC<NewsletterProps> = () => {
    return (
        <div className="footer__widget">
            <h6>Join Our Newsletter Now</h6>
            <p>Get E-mail updates about our latest shop and special offers.</p>
            <form action="#">
                <input type="text" placeholder="Enter your mail" />
                <button type="submit" className="site-btn">
                    Subscribe
                </button>
            </form>
        </div>
    );
};

export default Newsletter;
