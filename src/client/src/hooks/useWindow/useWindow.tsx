import { useContext } from "react";
import { WindowContext } from "../../context/WindowContext";

export function useWindow() {
    return useContext(WindowContext);
}