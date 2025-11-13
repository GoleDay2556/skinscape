import "./style.scss";

import React from "react";

import { useSettingsContext } from "../../stores";

type ThemeProps = {
    theme: { 
        id: string, name: string,
        previewBackground: string, previewForeground: string
    }
};

export const ThemeCard: React.FC<ThemeProps> = ({
    theme
}) => {
    const { setTheme } = useSettingsContext();

    const onClick = () => {
        setTheme(theme.id);
    }

    const style = {
        "--background-color": theme.previewBackground,
        "--foreground-color": theme.previewForeground,
    } as React.CSSProperties;
    
    return (
        <button className="theme-card" style={style} onClick={onClick}>
            <p>
                {theme.name}
            </p>
        </button>
    );
}