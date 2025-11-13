import React from "react";
import { useActiveEditor } from "../../hooks/useActiveEditor";
import { Window } from "../Window";

export const LayersWindow: React.FC = () => {
    const { editor } = useActiveEditor();

    return (
        <Window title="Layers">
            {editor.activeSkin && <div>
                {editor.activeSkin.layers.map(layer => (
                    <div>
                        {layer.name}
                    </div>
                ))}
            </div>}
        </Window>
    );
}