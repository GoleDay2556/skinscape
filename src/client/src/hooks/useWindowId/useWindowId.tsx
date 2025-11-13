import { useContext } from "react";
import { WindowIdContext } from "../../context/WindowContext";

export function useWindowId() {
    return useContext(WindowIdContext);
}