import "./style.scss";

import closeImage from "../../assets/icons/close@2x.png";

import React, { useEffect, useRef, useState } from "react";

import { useWindow } from "../../hooks/useWindow";
import { Button } from "../Button";
import { Icon } from "../Icon";
import { useWindowEvent } from "../../hooks/useWindowEvent";
import { useWindowId } from "../../hooks/useWindowId";

type WindowProps = {
    title?: string,
    children: React.ReactNode,
    onClose?: () => void;
};

export const Window: React.FC<WindowProps> = ({
    title, children, onClose,
}) => {
    const { hideWindow } = useWindow();
    const { wid } = useWindowId();

    const windowRef = useRef<HTMLDivElement>(null);

    const [visible, setVisible] = useState(false);
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const isDragging = useRef(false);
    const startPos = useRef({ x: 0, y: 0 });

    function resize() {
        if (!windowRef.current) return;
        const { width, height } = windowRef.current.getBoundingClientRect();

        const x = Math.floor((window.innerWidth - width) / 4) * 2;
        const y = Math.floor((window.innerHeight - height) / 4) * 2;

        setPos({ x, y });
        setVisible(true);
    }

    function onMouseDown(event: React.MouseEvent) {
        if (!windowRef.current) return;

        isDragging.current = true;
        startPos.current = {
            x: event.clientX - pos.x,
            y: event.clientY - pos.y
        };
    }

    function onMouseMove(event: MouseEvent) {
        if (!windowRef.current || !isDragging.current) return;
        const { width, height } = windowRef.current.getBoundingClientRect();

        let x = event.clientX - startPos.current.x;
        let y = event.clientY - startPos.current.y;

        if (x < 0) x = 0;
        if (y < 0) y = 0;

        if (x + width > window.innerWidth) x = window.innerWidth - width;
        if (y + height > window.innerHeight) y = window.innerHeight - height;

        setPos({ x, y });
    }

    function onMouseUp() {
        isDragging.current = false;
    }

    function onKeyDown(event: KeyboardEvent) {
        if (event.key == "Escape") hideWindow(wid);
    }

    function onCloseClicked() {
        if (onClose) onClose();
        hideWindow(wid);
    }

    useWindowEvent("mousemove", onMouseMove);
    useWindowEvent("mouseup", onMouseUp);
    useWindowEvent("keydown", onKeyDown);

    useWindowEvent("resize", resize);
    useEffect(resize, [windowRef]);

    const style = {
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        visibility: visible ? "visible" : "hidden",
    } as React.CSSProperties;

    return (
        <div ref={windowRef} className="window" style={style}>
            {title && <div className="window-title" onMouseDown={onMouseDown}>
                {title}
                <Button variant="icon" onClick={onCloseClicked}>
                    <Icon image={closeImage} />
                </Button>
            </div>}
            <div className="window-content">
                {children}
            </div>
        </div>
    );
};