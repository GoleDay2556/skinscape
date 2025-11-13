import "./style.css";

import logo from "../../assets/icons/logo.png";

import React from "react";

type MessagePageProps = {
    children: JSX.Element[],
}

export const MessagePage: React.FC<MessagePageProps> = ({
    children
}) => {

    return (
        <div className="message-page">
            <a href="https://skinscape.app">
                <img src={logo} alt="Logo" width={152} height={36} />
            </a>
            <div className="message-page-container">
                {children}
            </div>
        </div>
    )
}