import React, { createContext, useState } from "react";
import { createPortal } from "react-dom";

export const WindowContext = createContext({
    showWindow: (window: React.ReactNode, id?: string): string => "",
    hideWindow: (id: string) => {},
});

export const WindowIdContext = createContext({ wid: "" });

export const WindowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [windows, setWindows] = useState<Record<string, React.ReactNode>>({});

    const showWindow = (window: React.ReactNode, id?: string): string => {
        const _id = id ?? crypto.randomUUID();
        const _windows = { ...windows };
        _windows[_id] = window;
        setWindows(_windows);
        return _id;
    }

    function hideWindow(id: string) {
        const _windows = { ...windows };
        _windows[id] = undefined;
        setWindows(_windows);
    }

    return (
        <WindowContext.Provider value={{ showWindow, hideWindow }}>
            {children}
            {Object.entries(windows).map(([id, node]) => createPortal(
                <WindowIdContext.Provider value={{ wid: id }}>
                    {node}
                </WindowIdContext.Provider>,
                 document.body
            ))}
        </WindowContext.Provider>
    );
};