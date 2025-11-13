import "./style.scss";

import React from "react";

import { useEditorViewContext } from "../../stores";
import { Window } from "../Window";
import { classNames } from "../../utils/helpers";

export const ElementsDialog: React.FC = () => {
    const view = useEditorViewContext();

    const togglePart = (name: string) => {
        let toggles = [...view.elementToggles];
        if (toggles.includes(name)) {
            toggles = toggles.filter(it => it !== name);
        } else {
            toggles.push(name);
        }
        view.setElementToggles(toggles);
    };

    const evmClass = (name: string): string => {
        const hyphenatedName = name.replace(" ", "-").toLowerCase();

        let obj: any = {}
        obj[`elements-dialog-model-${hyphenatedName}`] = true;
        obj["disabled"] = view.elementToggles.includes(name);
        return classNames(obj);
    }

    return (
        <Window title="Elements">
            <div className="elements-dialog-model">
                <div
                    className={evmClass("Head")}
                    onClick={() => togglePart("Head")}
                ></div>
                <div
                    className={evmClass("Left Arm")}
                    onClick={() => togglePart("Left Arm")}
                ></div>
                <div
                    className={evmClass("Body")}
                    onClick={() => togglePart("Body")}
                ></div>
                <div
                    className={evmClass("Right Arm")}
                    onClick={() => togglePart("Right Arm")}
                ></div>
                <div
                    className={evmClass("Left Leg")}
                    onClick={() => togglePart("Left Leg")}
                ></div>
                <div
                    className={evmClass("Right Leg")}
                    onClick={() => togglePart("Right Leg")}
                ></div>
            </div>
        </Window>
    );
}