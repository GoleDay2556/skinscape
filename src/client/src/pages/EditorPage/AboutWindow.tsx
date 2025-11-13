import React from "react";

import logo from "../../assets/icons/logo.png";

import { VERSION } from "../../utils/env";
import { Window } from "../../components/Window";
import { Center } from "../../components/Center";

export const AboutWindow: React.FC = () => {
    return (
        <Window title="About">
            <Center>
                <img src={logo} alt="Logo" width={76} height={18} />
            </Center>
            <p>Created and maintained by Alexander Capitos</p>
            <Center><i>Free to use, forever</i></Center>
            <br />
            <Center>
                <div style={{ padding: "10px 20px", boxShadow: "0 0 0 2px var(--border-light)" }}>
                    <a href="https://github.com/skinscape/skinscape">Repository</a>
                    <div style={{ display: "inline-block", width: "20px" }}></div>
                    <a href="https://acapitos.com/">My Website</a>
                    <div style={{ display: "inline-block", width: "20px" }}></div>
                    <a href="https://github.com/sndyx">My GitHub</a>
                </div>
            </Center>
            <br />
            <hr />
            <p>Copyright (C) 2022-2025 <i>Alexander Capitos</i></p>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <i>https://skinscape.app/</i><i>Version {VERSION}</i>
            </div>
        </Window>
    );
};