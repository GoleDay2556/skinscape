import "./style.scss";

import themes from "../../assets/themes.json";

import React from "react";

import { Window } from "../Window";
import { useSettingsContext } from "../../stores";
import { ThemeCard } from "../ThemeCard";

export const SettingsDialog: React.FC = () => {
    const { theme, setTheme } = useSettingsContext();

    return (
        <Window title="Settings">
            <div className="settings-dialog">
                {themes.map(theme => {
                    return (
                        <ThemeCard theme={theme} />
                    );
                })}
            </div>
        </Window>
    );
};