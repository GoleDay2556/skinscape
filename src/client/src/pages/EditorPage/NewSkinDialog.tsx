import { useRef } from "react";
import { Button } from "../../components/Button";
import { Window } from "../../components/Window";
import { Input } from "../../components/Input";
import { useActiveEditor } from "../../hooks/useActiveEditor";
import { useWindow } from "../../hooks/useWindow";
import { Models } from "../../models/model";
import { MutableSkin } from "../../models/skin";
import { DropdownMenu } from "../../components/DropdownMenu";
import { MenuItem } from "../../components/Menu";
import { useEditorViewContext } from "../../stores";
import { useWindowId } from "../../hooks/useWindowId/useWindowId";

export const NewSkinDialog: React.FC = () => {
    const { editor } = useActiveEditor();
    const { setGridlines, setOverlay } = useEditorViewContext();
    const { hideWindow } = useWindow();
    const { wid } = useWindowId();

    const inputRef = useRef<HTMLInputElement>(null);

    const onConfirm = () => {
        let name = inputRef.current?.value ?? "";
        if (name.trim().length == 0) name = "Untitled Skin";

        const skin = new MutableSkin(Models.alex64);
        skin.name = name;

        editor.addSkin(skin);
        setGridlines(true);
        setOverlay(false);

        hideWindow(wid);
    };

    return (
        <Window title="New Skin">
            <p>Name:</p>
            <Input ref={inputRef} />
            <p>Model:</p>
            <DropdownMenu label="Models">
                <MenuItem label="Steve 64x" />
                <MenuItem label="Alex 64x" />
                <MenuItem label="Steve 128x" />
                <MenuItem label="Alex 128x" />
            </DropdownMenu>
            <div className="dialog-new-skin-buttons">
                <Button variant="primary" onClick={onConfirm}>Confirm</Button>
                <Button variant="secondary" onClick={() => hideWindow(wid)}>Cancel</Button>
            </div>
        </Window>
    );
}