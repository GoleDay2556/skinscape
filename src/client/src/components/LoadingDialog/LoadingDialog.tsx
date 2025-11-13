import loadingImage from "../../assets/icons/loading_bar@2x.gif";

import React from "react";

import { Window } from "../Window";
import { Icon } from "../Icon";

export const LoadingDialog: React.FC = () => {
    return (
        <Window title="Loading">
            <Icon image={loadingImage} />
        </Window>
    );
}