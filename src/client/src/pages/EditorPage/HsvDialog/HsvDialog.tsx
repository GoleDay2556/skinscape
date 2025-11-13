import "./style.scss";

import React, { useState } from "react";

import { Window } from "../../../components/Window/index.ts";
import { colord, HsvaColor } from "colord";
import { ColorHueSlider } from "../../../components/ColorHueSlider";
import { ColorValueSlider } from "../../../components/ColorValueSlider";
import { Button } from "../../../components/Button";
import { useActiveEditor } from "../../../hooks/useActiveEditor";
import { ColorSaturationSlider } from "../../../components/ColorSaturationSlider";
import { Layer } from "../../../models/skin.ts";
import { rgbaBlendNormal } from "../../../utils/blending.ts";
import { useWindow } from "../../../hooks/useWindow/index.ts";
import { EditChangeAllPixels } from "../../../models/history.ts";
import { useWindowId } from "../../../hooks/useWindowId/useWindowId.tsx";

export const HsvDialog: React.FC = () => {
    const { hideWindow } = useWindow();
    const { wid } = useWindowId();
    const { editor } = useActiveEditor();
    const [hsva, setHsva] = useState<HsvaColor>({ h: 0, s: 50, v: 50, a: 1 });

    function setHsvaAndUpdate(hsva: HsvaColor) {
        if (!editor.activeSkin) return;
        setHsva(hsva);

        const skin = editor.activeSkin;
        const layer = skin.getTempLayerByName("effect");
        layer.clear();

        for (let pos = 0; pos < skin.dataLength(); pos += 4) {
            let color = { r: 0, g: 0, b: 0, a: 0 };
            for (let i = 0; i < skin.layers.length + skin.tempLayers.length; i++) {
                let layer: Layer;
                if (i >= skin.layers.length) {
                    layer = skin.tempLayers[i - skin.layers.length];
                } else {
                    layer = skin.layers[i];
                }
                if (!layer.isActive) continue; // Skip hidden layers
                let layerColor = layer.getPixelByPos(pos);
                if (layer.uuid === skin.activeLayerId) {
                    const c = colord(layerColor).toHsv();
                    c.h += hsva.h
                    c.s += (hsva.s - 50) * 2;
                    c.v += (hsva.v - 50) * 2;
                    layerColor = colord(c).toRgb();
                }
                if (layerColor.a === 1) {
                    color = layerColor;
                } else {
                    color = rgbaBlendNormal(color, layerColor);
                }
            }
            layer.setPixelByPos(pos, color, false);
        }
    }

    function onConfirm() {
        if (!editor.activeSkin) return;
        const skin = editor.activeSkin;
        const layer = skin.activeLayer;

        const data = new Uint8ClampedArray(layer.data.length);
        for (let pos = 0; pos < layer.data.length; pos += 4) {
            let c = colord(layer.getPixelByPos(pos)).toHsv();
            c.h += hsva.h
            c.s += (hsva.s - 50) * 2;
            c.v += (hsva.v - 50) * 2;
            const rgba = colord(c).toRgb();
            data.set([rgba.r, rgba.g, rgba.b, rgba.a], pos);
        }

        const edit = new EditChangeAllPixels(layer.data, data);
        edit.do(skin);
        skin.history.push(edit);

        skin.getTempLayerByName("effect").clear();
        hideWindow(wid);
    }

    function onCancel() {
        if (!editor.activeSkin) return;
        const skin = editor.activeSkin;

        skin.getTempLayerByName("effect").clear();
        hideWindow(wid);
    }

    return (
        <Window title="Adjust Hue/Saturation" onClose={onCancel}>
            <p className="dialog-hsv-label">Hue:</p>
            <div className="dialog-hsv-slider">
                <ColorHueSlider hsva={hsva} setHsva={setHsvaAndUpdate} />
            </div>
            <p className="dialog-hsv-label">Saturation:</p>
            <div className="dialog-hsv-slider">
                <ColorSaturationSlider hsva={hsva} setHsva={setHsvaAndUpdate} />
            </div>
            <p className="dialog-hsv-label">Value:</p>
            <div className="dialog-hsv-slider">
                <ColorValueSlider hsva={hsva} setHsva={setHsvaAndUpdate} />
            </div>
            <div className="dialog-hsv-buttons">
                <Button variant="primary" onClick={onConfirm}>Confirm</Button>
                <Button variant="secondary" onClick={onCancel}>Cancel</Button>
            </div>
        </Window>
    );
}