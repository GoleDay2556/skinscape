import React from "react";
import "./style.scss";

type ComboBoxProps = {
    value: string | undefined,
    setValue: (value: string) => void,
    options: string[]
};

export const ComboBox: React.FC = () => {

    return (
        <div className="combo-box">
            
        </div>
    );
};