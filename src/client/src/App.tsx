import "./style.scss";

import { useEffect } from "react";

import { EditorPage } from "./pages/EditorPage";
import { BrowserRouter, Route, Routes, Navigate } from "react-router";
import { MessagePage } from "./pages/MessagePage";
import { useSettingsContext } from "./stores";
import { WindowProvider } from "./context/WindowContext";

export default function App() {
    const { theme } = useSettingsContext();

    useEffect(() => {
        const themeName = theme == "auto" ? "dark" : theme;

        (document.getElementById("theme-link") as HTMLLinkElement).href = `/themes/${themeName}.css`;
    }, [theme]);

    return (
        <WindowProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navigate to="/editor" replace />} />
                    <Route path="/editor" element={<EditorPage />} />

                    <Route path="*" element={
                        <MessagePage>
                            <p><b>404</b> Page not found.</p>
                            <p>The URL was not found. <a href="/editor">Return to editor</a></p>
                        </MessagePage>
                    } />
                </Routes>
            </BrowserRouter>
        </WindowProvider>
    );
}