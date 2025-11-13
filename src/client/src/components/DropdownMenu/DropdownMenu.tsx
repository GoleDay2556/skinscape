import React, { useRef, useState } from "react";

import { Menu } from "../Menu";

type DropdownMenuProps = {
    label: string,
    children: React.ReactNode,
};

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
    label, children
}) => {
    const [visible, setVisible] = useState<boolean>(false);
    const [pos, setPos] = useState({ x: 0, y: 0 });

    const divRef = useRef<HTMLDivElement | null>(null);

    function onMouseOver() {
        if (!divRef.current) return;

        setPos({ x: divRef.current.offsetLeft - 4, y: divRef.current.offsetTop + divRef.current.offsetHeight - 4 });
        setVisible(true);
    }

    function onMouseLeave() {
        setVisible(false);
    }

    const style = {
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        display: visible ? "block" : "none",
    } as React.CSSProperties;

    return (
        <div
            ref={divRef}
            className="menubar-item"
            onMouseOver={onMouseOver}
            onMouseLeave={onMouseLeave}
        >
            {label}
            <div style={style} onMouseOver={onMouseOver} onMouseLeave={onMouseLeave}>
                <Menu>
                    {children}
                </Menu>
            </div>
        </div>
    );
};