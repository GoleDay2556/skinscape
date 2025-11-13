import "./style.scss";

import React, { forwardRef } from "react";

export const Input = forwardRef<
    HTMLInputElement, React.ComponentProps<"input">
>(({ type, onKeyDown, onKeyUp, ...props }, ref) => {
    return (
        <input 
            ref={ref}
            type={type}
            className="input"
            spellCheck={false}
            onKeyDown={(e) => {
                e.stopPropagation();
                onKeyDown?.call(undefined, e);
            }}
            onKeyUp={(e) => {
                e.stopPropagation();
                onKeyUp?.call(undefined, e);
            }}
            {...props}
        />
    );
});