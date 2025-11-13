import "./style.scss";

import React, { useRef } from "react";

import { ColorPicker } from "../ColorPicker";
import { classNames, noContextMenu } from "../../utils/helpers.ts";
import { EditorScene } from "./EditorScene.tsx";
import { Palette } from "../Palette";
import { Editor as EditorModel } from "../../models/editor.ts";
import { ContextMenu } from "../ContextMenu/ContextMenu.tsx";
import { MenuItem } from "../Menu/Menu.tsx";
import { MutableSkin } from "../../models/skin.ts";
import { useWindow } from "../../hooks/useWindow/useWindow.tsx";
import { useEditorContext, useToolContext } from "../../stores.ts";
import { useWindowId } from "../../hooks/useWindowId/useWindowId.tsx";

type EditorProps = {
    editor: EditorModel,
    index: number,
}

export const Editor: React.FC<EditorProps> = ({ editor, index }) => {
    const editorRef = useRef<HTMLDivElement>(null);

    function onMouseDown() {
        const { editors, activeEditor, setActiveEditor } = useEditorContext.getState();
        if (editors[activeEditor] != editor) setActiveEditor(index);
    }

    useToolContext.subscribe(({ activeTool }) => {
        if (!editorRef.current) return;
        if (activeTool == "eyedropper") {
            editorRef.current.style.cursor = "url('/icons/eyedropper@2x.png') 0 23, auto";
        } else {
            editorRef.current.style.cursor = "url('/icons/crosshair@2x.png') 12 12, auto";
        }
    });

    return (
        <React.Fragment>
            <div className="editor-sidebar">
                <div className="palette-container">
                    <Palette />
                </div>
                {index == 0 &&
                    <div className="picker-container">
                        <ColorPicker />
                    </div>
                }
            </div>

            <div className="editor-center" onMouseDown={onMouseDown}>
                <div className="editor-tabs">
                    {editor.skins.map((skin, index) => {
                        const className = classNames({
                            "editor-tab": true,
                            "active": editor.activeSkinIndex == index
                        });

                        return (
                            <ContextMenu key={index} menu={
                                <EditorTabMenu editor={editor} skin={skin} />
                            }>
                                <div className={className} onClick={() => editor.setActiveSkin(index)}>
                                    {skin.name}
                                    <div className="editor-tab-close" onClick={() => editor.removeSkin(skin)}>X</div>
                                </div>
                            </ContextMenu>
                        );
                    })}
                </div>
                <div ref={editorRef} className="editor-scene border" onContextMenu={noContextMenu}>
                    {editor.activeSkin && <EditorScene skin={editor.activeSkin} />}
                </div>
            </div>
        </React.Fragment>
    );
}

type EditorTabMenuProps = {
    editor: EditorModel,
    skin: MutableSkin,
};

const EditorTabMenu: React.FC<EditorTabMenuProps> = ({
    editor, skin
}) => {
    const { hideWindow } = useWindow();
    const { wid } = useWindowId();
    const { editors, activeEditor, setActiveEditor } = useEditorContext();

    function onClickOpen() {
        editor.setActiveSkin(editor.skins.indexOf(skin));
        hideWindow(wid);
    }

    function onClickDuplicate() {
        const index = editor.skins.indexOf(skin);
        const copy = skin.copy();
        editor.skins.splice(index, 0, copy);
        editor.setActiveSkin(index + 1);
        hideWindow(wid);
    }

    function onClickClose() {
        editor.removeSkin(skin);
        hideWindow(wid);
    }

    function onClickCloseOthers() {
        editor.skins = [skin];
        editor.activeSkinIndex = 0;
        editor.update();
        hideWindow(wid);
    }

    function onClickCloseRight() {
        const index = editor.skins.indexOf(skin) + 1;
        editor.skins.splice(index, editor.skins.length - index);
        if (editor.activeSkinIndex >= editor.skins.length) {
            editor.activeSkinIndex = index - 1;
        }
        editor.update();
        hideWindow(wid);
    }

    function onClickSplitRight() {
        const newEditor = new EditorModel();
        newEditor.skins.push(skin);
        editors.splice(activeEditor + 1, 0, newEditor);
        setActiveEditor(activeEditor + 1);
        hideWindow(wid);
    }

    function onClickSplitLeft() {
        const newEditor = new EditorModel();
        newEditor.skins.push(skin);
        editors.splice(activeEditor, 0, newEditor);
        hideWindow(wid);
    }

    return (<>
        <MenuItem label="Open" onClick={onClickOpen} />
        <MenuItem label="Duplicate" onClick={onClickDuplicate} />
        <hr />
        <MenuItem label="Close" shortcut="Ctrl+F4" onClick={onClickClose} />
        <MenuItem label="Close Others" onClick={onClickCloseOthers} />
        <MenuItem label="Close Right" onClick={onClickCloseRight} />
        <hr />
        <MenuItem label="Split Right" onClick={onClickSplitRight} />
        <MenuItem label="Split Left" onClick={onClickSplitLeft} />
    </>);
};