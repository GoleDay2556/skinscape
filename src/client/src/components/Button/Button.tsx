import "./style.scss";

import React, {forwardRef} from "react";

type ButtonProps = {
    variant?: ButtonVariant,
    children: React.ReactNode,
} & React.ComponentProps<"button">;

type ButtonVariant = "primary" | "secondary" | "destructive" | "icon";

export const Button = forwardRef<
    HTMLButtonElement, ButtonProps
>(({ variant, children, ...props }, ref) => {
    const v = variant ?? "primary";

    return (
        <button ref={ref} className={`button button-${v}`} {...props}>
            {children}
        </button>
    );
});