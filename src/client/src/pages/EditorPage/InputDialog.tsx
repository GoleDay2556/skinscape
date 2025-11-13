import React from "react";
import { forwardRef } from "react";

import { Input } from "../../components/Input";
import { useWindow } from "../../hooks/useWindow/useWindow";
import { Window } from "../../components/Window";
import { useWindowId } from "../../hooks/useWindowId/useWindowId";

type InputDialogProps = {
    title?: string,
    label?: string,
    onEnter: (input: string) => void,
};

export const InputDialog = forwardRef<
    HTMLInputElement, InputDialogProps & React.ComponentProps<typeof Input>
>(({ title, label, onEnter, ...props }, ref) => {
    const { hideWindow } = useWindow();
    const { wid } = useWindowId();

    const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key != "Enter") return;

        hideWindow(wid);
        onEnter(event.currentTarget.value);
    }

    return (
        <Window title={title}>
            {label && <p>{label}:</p>}
            <Input
                ref={ref}
                onKeyDown={onKeyDown}
                {...props}
            />
        </Window>
    );
});