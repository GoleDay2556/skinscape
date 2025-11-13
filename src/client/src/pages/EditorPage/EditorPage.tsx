import "./style.scss";

import logo from "../../assets/icons/logo.png";

import React, { useEffect } from "react";

import { Editor } from "../../components/Editor";
import { Toolbar } from "../../components/Toolbar";
import { MenuItem, MenuItemDropdown, MenuItemToggle } from "../../components/Menu";
import { Menubar, MenubarItem } from "../../components/Menubar";
import { useEditorContext, useEditorSettingsContext, useEditorViewContext } from "../../stores";
import { Models } from "../../models/model";
import { Layer, MutableSkin } from "../../models/skin";
import { InputDialog } from "./InputDialog";
import { useWindow } from "../../hooks/useWindow/index.ts";
import { DISCORD_URL, getSkinSubsection, GITHUB_URL, makePossessive, parseTexture, textureToDataUrl } from "../../utils/helpers";
import { useDocumentEvent } from "../../hooks/useDocumentEvent";
import { useEditorKeybinds } from "./keybinds";
import { useActiveEditor } from "../../hooks/useActiveEditor";
import { useShallow } from "zustand/shallow";
import { AboutWindow } from "./AboutWindow.tsx";
import { VERSION } from "../../utils/env.ts";
import { HsvDialog } from "./HsvDialog";
import { BLEND_FUNC_KINDS } from "../../utils/blending.ts";
import { SettingsDialog } from "../../components/SettingsDialog/SettingsDialog.tsx";
import { NewSkinDialog } from "./NewSkinDialog.tsx";
import { LoadingDialog } from "../../components/LoadingDialog/LoadingDialog.tsx";
import { ElementsDialog } from "../../components/ElementsDialog/ElementsDialog.tsx";
import { LayersWindow } from "../../components/LayersWindow/LayersWindow.tsx";

export const EditorPage: React.FC = () => {
    const { editors } = useEditorContext(
        useShallow(({ editors }) => { return { editors }; })
    );
    const { editor } = useActiveEditor();
    useEditorKeybinds();

    useEffect(() => {
        if (!editor.activeSkin) return;

        const head = getSkinSubsection(editor.activeSkin, 8, 8, 8, 8);
        const dataUrl = textureToDataUrl({ size: [8, 8], data: head });

        let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.getElementsByTagName('head')[0].appendChild(link);
        }
        link.href = dataUrl;


    }, [editor.activeSkin]);

    useDocumentEvent("visibilitychange", () => {
        editor.update();
    }, [editor]);

    return (
        <React.Fragment>
            <div className="editor-page">
                <div className="editor-page-menubar">
                    <Menubar>
                        <EditorPageMenubarLogo />
                        <EditorPageMenubarFile />
                        <EditorPageMenubarEdit />
                        <EditorPageMenubarLayer />
                        <EditorPageMenubarView />
                    </Menubar>
                </div>
                <div className="editor-page-content">
                    <div className="editor-page-editors">
                        <Toolbar />
                        {editors.map((editor, index) => {
                            return <Editor key={index} editor={editor} index={index} />
                        })}
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

const EditorPageMenubarLogo: React.FC = () => {
    const { showWindow } = useWindow();

    return (
        <MenubarItem label={<img src={logo} alt="Logo" width={76} height={18} />}>
            <MenuItem label="Profile..." enabled={false} />
            <MenuItem label="Browser..." enabled={false} />
            <MenuItem label="About..." onClick={() => {
                showWindow(<AboutWindow />, "window_about");
            }} />
            <MenuItemDropdown label="Community">
                <MenuItem label="Discord..." onClick={() => {
                    window.open(DISCORD_URL, "_blank")?.focus();
                }} />
                <MenuItem label="Github..." onClick={() => {
                    window.open(GITHUB_URL, "_blank")?.focus();
                }} />
            </MenuItemDropdown>
            <hr />
            <MenuItem label="Settings..." onClick={() => {
                showWindow(<SettingsDialog />, "dialog_settings");
            }} />
            <hr />
            <MenuItem label={`Version ${VERSION}`} enabled={false} />
        </MenubarItem>
    );
};

const EditorPageMenubarFile: React.FC = () => {
    const { editor } = useActiveEditor();
    const { showWindow, hideWindow } = useWindow();

    const setSkinFromUsername = (username: string) => {
        const wid = showWindow(<LoadingDialog />);
        fetch(`/api/skin/${username}`)
            .then(res => res.arrayBuffer())
            .then(buffer => parseTexture(buffer))
            .then(texture => {
                const skin = new MutableSkin(Models.alex64);
                skin.name = `${makePossessive(username)} Skin`;
                skin.setTexture(texture);
                editor.addSkin(skin);
                hideWindow(wid);
            });
    };

    const downloadSkin = () => {
        const skin = editor.activeSkin!;
        const texture = skin.getTexture();
        const dataUrl = textureToDataUrl(texture);

        const element = document.createElement("a");
        element.href = dataUrl;
        element.download = `${skin.name}.png`;
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
        document.body.removeChild(element);
    };

    return (
        <MenubarItem label="File">
            <MenuItem label="New Skin..." onClick={() => showWindow(
                <NewSkinDialog />, "NewSkinDialog"
            )} />
            <MenuItemDropdown label="Import Skin">
                <MenuItem label="From File..." />
                <MenuItem label="From Username..." onClick={() => showWindow(
                    <InputDialog title="Username" maxLength={16} onEnter={setSkinFromUsername} />,
                    "dialog_import_skin_from_username"
                )} />
            </MenuItemDropdown>
            <hr />
            <MenuItem label="Export Skin" onClick={downloadSkin} enabled={editor.isSkinOpen} />
            <MenuItem label="Publish Skin" enabled={false && editor.isSkinOpen} />
        </MenubarItem>
    );
};

const EditorPageMenubarEdit: React.FC = () => {
    const { editor } = useActiveEditor();
    const { showWindow } = useWindow();
    const { blendFunc, setBlendFunc } = useEditorSettingsContext();

    return (
        <MenubarItem label="Edit">
            <MenuItem label="Undo" shortcut="Ctrl+Z" onClick={() => editor.activeSkin!.history.undo()} enabled={editor.isSkinOpen} />
            <MenuItem label="Redo" shortcut="Ctrl+Y" onClick={() => editor.activeSkin!.history.redo()} enabled={editor.isSkinOpen} />
            <hr />
            <MenuItem label="Cut" shortcut="Ctrl+X" enabled={editor.isSkinOpen} />
            <MenuItem label="Copy" shortcut="Ctrl+C" enabled={editor.isSkinOpen} />
            <MenuItem label="Paste" shortcut="Ctrl+V" enabled={editor.isSkinOpen} />
            <hr />
            <MenuItem label="Replace Color..." enabled={false && editor.isSkinOpen} />
            <MenuItem label="Hue/Saturation..." onClick={() => showWindow(<HsvDialog />, "HsvDialog")} enabled={editor.isSkinOpen} />
            <MenuItem label="Brightness/Contrast..." enabled={false && editor.isSkinOpen} />
            <hr />
            <MenuItemDropdown label="Blending Mode" enabled={editor.isSkinOpen}>
                {BLEND_FUNC_KINDS.map(kind => {
                    const setToggled = () => {
                        setBlendFunc(kind);
                    }

                    return <MenuItemToggle key={kind} label={kind} toggled={blendFunc == kind} setToggled={setToggled} />;
                })}
            </MenuItemDropdown>
            <MenuItemToggle label="Enable Symmetry" toggled={false} setToggled={() => { }} enabled={false} />
        </MenubarItem>
    );
};

const EditorPageMenubarLayer: React.FC = () => {
    const { editor } = useActiveEditor();
    const { showWindow } = useWindow();

    return (
        <MenubarItem label="Layer">
            <MenuItem label="Layers..." enabled={editor.isSkinOpen} onClick={() => {
                showWindow(<LayersWindow />)
            }} />            
            <MenuItem label="New Layer" enabled={editor.isSkinOpen} onClick={() => {
                editor.activeSkin?.layers.push(new Layer(editor.activeSkin, "Layer 2"));
            }} />
        </MenubarItem>
    );
};

const EditorPageMenubarView: React.FC = () => {
    const { editor } = useActiveEditor();
    const {
        gridlines, setGridlines,
        overlay, setOverlay,
        elementToggles, setElementToggles
    } = useEditorViewContext();
    const { showWindow: showDialog } = useWindow();

    const getSkinElements = (skin: MutableSkin): Array<string> => {
        return Array.from(new Set(skin.model.elements.map(element => {
            const name = element.name!;
            if (name.startsWith("overlay:")) return name.substring(8);
            return name;
        })));
    }

    return (
        <MenubarItem label="View">
            <MenuItemToggle label="Show Overlay" shortcut="O" toggled={overlay} setToggled={setOverlay} enabled={editor.isSkinOpen} />
            <MenuItemToggle label="Show Gridlines" shortcut="G" toggled={gridlines} setToggled={setGridlines} enabled={editor.isSkinOpen} />
            <MenuItem label="Elements..." enabled={editor.isSkinOpen} onClick={() => {
                showDialog(<ElementsDialog />);
            }} />
            <MenuItemDropdown label="Element Toggles" enabled={editor.isSkinOpen}>
                {editor.activeSkin && getSkinElements(editor.activeSkin!).map(element => {
                    const toggled = !elementToggles.includes(element);
                    const setToggled = () => {
                        const index = elementToggles.indexOf(element);
                        if (index > -1) {
                            elementToggles.splice(index, 1);
                        } else {
                            elementToggles.push(element);
                        }
                        setElementToggles(elementToggles);
                    }

                    return <MenuItemToggle key={element} label={`Show ${element}`} toggled={toggled} setToggled={setToggled} />;
                })}
            </MenuItemDropdown>
            <hr />
            <MenuItem label="Reset Model Position" enabled={false && editor.isSkinOpen} />
        </MenubarItem>
    );
};