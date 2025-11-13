import "./style.scss";

import React, { useEffect, useRef, useState } from "react";

import { useWindowEvent } from "../../hooks/useWindowEvent";
import { noContextMenu } from "../../utils/helpers.ts";
import { Indicator } from "../Indicator";
import { colord, HsvaColor } from "colord";

type ColorAlphaSliderProps = {
    hsva: HsvaColor,
    setHsva: (hsva: HsvaColor) => void
};

export const ColorAlphaSlider: React.FC<ColorAlphaSliderProps> = ({
    hsva, setHsva
}) => {
    const [pos, setPos] = useState({ x: 0, y: 0 });

    const button = useRef(-1);
    const divRef = useRef<HTMLDivElement>(null);

    function onMouseDown(event: React.MouseEvent) {
        button.current = event.button;
        if (button.current !== -1) {
            document.getElementById("color-cursor-overlay")!.style.display = "block";
            updateAlpha(event.clientX);
        }
    }

    function updateAlpha(clientX: number) {
        if (!divRef.current) return;
        const rect = divRef.current.getBoundingClientRect();

        const a = Math.min(1, Math.max(0,
            (clientX - rect.left) / rect.width * 1
        ));

        const newHsva = { h: hsva.h, s: hsva.s, v: hsva.v, a };
        setHsva(newHsva);
    }

    function updatePos() {
        if (!divRef.current) return;
        const rect = divRef.current.getBoundingClientRect();

        const x = Math.floor(rect.width * hsva.a / 2) * 2;
        const y = rect.height / 2;
        setPos({ x, y });
    }

    useWindowEvent("mouseup", (event: MouseEvent) => {
        if (button.current === event.button) {
            document.getElementById("color-cursor-overlay")!.style.display = "none";
            button.current = -1;
        }
    });

    useWindowEvent("mousemove", (event: MouseEvent) => {
        if (button.current !== -1) updateAlpha(event.clientX);
    }, [hsva]);

    useWindowEvent("resize", updatePos);
    useEffect(updatePos, [hsva]);

    const style = {
        "--color": colord({ h: hsva.h, s: hsva.s, v: hsva.v, a: 1 }).toHex(),
    } as React.CSSProperties;

    return (
        <div
            className="color-alpha-slider"
            tabIndex={0}
            ref={divRef}
            onMouseDown={onMouseDown}
            onContextMenu={noContextMenu}
            style={style}
        >
            <Indicator pos={pos}/>
        </div>
    )
}