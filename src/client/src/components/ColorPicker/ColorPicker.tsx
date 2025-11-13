import "./style.scss";

import React from "react";
import { ColorRange } from "./ColorRange.tsx";
import { ColorButton } from "./ColorButton.tsx";
import { ColorHueSlider } from "../ColorHueSlider";
import { ColorAlphaSlider } from "../ColorAlphaSlider";
import { useColorContext } from "../../stores.ts";

export const ColorPicker: React.FC = () => {
    const {
        rgba, setRgba,
        hsva, setHsva
    } = useColorContext();

    return (
        <React.Fragment>
            <div id="color-cursor-overlay"></div>

            <div className="color-picker">
                <div className="color-picker-inner border-small">
                    <ColorRange hsva={hsva} setHsva={setHsva} />
                    <div className="color-picker-hue">
                        <ColorHueSlider hsva={hsva} setHsva={setHsva} />
                    </div>
                    <ColorAlphaSlider hsva={hsva} setHsva={setHsva} />
                </div>
                <ColorButton rgba={rgba} setRgba={setRgba} />
            </div>
        </React.Fragment>
    );
}