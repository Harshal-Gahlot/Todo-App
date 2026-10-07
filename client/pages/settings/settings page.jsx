import "./settings.css";
import { useContext, useState } from "react";
import { TodoContext } from "../context api";
import Nav from "../nav/nav";
import ToggleSwitch from "./components/ToggleSwitch";

function getSettings() {
    return JSON.parse(localStorage.getItem("settings") || "{}");
}
function saveSettings(obj) {
    localStorage.setItem("settings", JSON.stringify(obj));
}

export default function SettingsPage() {
    const { theme, setTheme } = useContext(TodoContext);
    const userSettingsObj = getSettings();

    const [category, setCategory] = useState(userSettingsObj.createCategory);
    const [directDelete, setDirectDelete] = useState(
        userSettingsObj.directDelete,
    );

    function toggleCategory(e) {
        const toggleTo = e.target.checked ? "public" : "private";
        setCategory(toggleTo);
        const s = getSettings();
        s.createCategory = toggleTo;
        saveSettings(s);
    }

    function toggleDirectDelete(e) {
        const val = e.target.checked;
        setDirectDelete(val);
        const s = getSettings();
        s.directDelete = val;
        saveSettings(s);
    }

    function toggleThemeSwitch(e) {
        setTheme(e.target.checked ? "light" : "dark");
    }

    return (
        <div className="display-flex">
            <Nav />
            <div className="setting-container">
                <div className="settings-inner">
                    {/* Todo Defaults */}
                    <div className="todo-default-container">
                        <p className="list-title">Todo defaults</p>
                        <div className="defaults-list">
                            <ToggleSwitch
                                label="Created todos are by default:"
                                options={["Private", "Public"]}
                                checked={category === "public"}
                                onChange={toggleCategory}
                                id="category"
                                name="category"
                                variant="pill"
                            />
                        </div>
                        <div className="horizontal-divider"></div>
                        <div className="defaults-list">
                            <ToggleSwitch
                                label="Delete todos permanently (skip bin):"
                                options={["Off", "On"]}
                                checked={directDelete}
                                onChange={toggleDirectDelete}
                                id="directDelete"
                                name="directDelete"
                                variant="simple"
                            />
                        </div>
                    </div>

                    {/* Appearance */}
                    <div className="todo-default-container">
                        <p className="list-title">Appearance</p>
                        <div className="defaults-list">
                            <ToggleSwitch
                                label="Light mode:"
                                options={["Dark", "Light"]}
                                checked={theme === "light"}
                                onChange={toggleThemeSwitch}
                                id="themeSwitch"
                                name="themeSwitch"
                                variant="pill"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
