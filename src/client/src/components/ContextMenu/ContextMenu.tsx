import "./style.scss";

import React from "react";

import { noContextMenu } from "../../utils/helpers";
import { Menu } from "../Menu";
import { useWindow } from "../../hooks/useWindow";
import { useWindowEvent } from "../../hooks/useWindowEvent";
import { useWindowId } from "../../hooks/useWindowId";

type ContextMenuProps = {
    menu: React.ReactNode,
    children: React.ReactNode,
};

export const ContextMenu: React.FC<ContextMenuProps> = ({
    menu, children
}) => {
    const { showWindow } = useWindow();

    function onContextMenu(event: React.MouseEvent) {
        event.preventDefault();
        const x = Math.floor(event.clientX / 2) * 2;
        const y = Math.floor(event.clientY / 2) * 2;

        showWindow(
            <ContextMenuDialog menu={menu} x={x} y={y} />
        );
    };

    return (
        <React.Fragment>
            <div onContextMenu={onContextMenu} style={{ display: "contents" }}>
                {children}
            </div>
        </React.Fragment>
    )
};

type ContextMenuDialogProps = {
    menu: React.ReactNode,
    x: number,
    y: number,
}

const ContextMenuDialog: React.FC<ContextMenuDialogProps> = ({ menu, x, y }) => {
    const { hideWindow } = useWindow();
    const { wid } = useWindowId();

    function onClick(event: React.MouseEvent) {
        event.stopPropagation();
    }

    useWindowEvent("click", () => {
        hideWindow(wid);
    });

    const style = {
        left: `${x}px`,
        top: `${y}px`,
    } as React.CSSProperties;

    return (
        <div
            className="context-menu"
            style={style}
            onClick={onClick}
            onContextMenu={noContextMenu}
        >
            <Menu>
                {menu}
            </Menu>
        </div>
    );
};