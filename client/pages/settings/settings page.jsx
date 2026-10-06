import axios from "axios";
import "./settings.css";
import { useContext, useState } from "react";
import { TodoContext } from "../context api";
import Nav from "../nav/nav";

function getSettings() {
    return JSON.parse(localStorage.getItem("settings") || "{}");
}
function saveSettings(obj) {
    localStorage.setItem("settings", JSON.stringify(obj));
}

export default function SettingsPage() {
    const { userSettingsObj, theme, setTheme } = useContext(TodoContext);
    const category = userSettingsObj.category;

    const [directDelete, setDirectDelete] = useState(() => getSettings().directDelete === true);

    function toggleCategory(e) {
        const toggleTo = e.target.checked ? "public" : "private";
        userSettingsObj.category = toggleTo;
        saveSettings(userSettingsObj);
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
                            <label htmlFor="category">Created todos are by default:</label>
                            <input type="checkbox" role="switch" name="category" id="category"
                                className="toggle-input"
                                onChange={(event) => toggleCategory(event)}
                                defaultChecked={category === "public" ? true : false} />
                        </div>
                        <div className="defaults-list">
                            <label htmlFor="directDelete">Delete todos permanentaly (skip bin):</label>
                            <input type="checkbox" role="switch" name="directDelete" id="directDelete"
                                className="toggle-input "
                                onChange={toggleDirectDelete}
                                checked={directDelete} />
                        </div>
                    </div>

                    {/* Appearance */}
                    <div className="todo-default-container">
                        <p className="list-title">Appearance</p>
                        <div className="defaults-list">
                            <label htmlFor="themeSwitch">Light mode:</label>
                            <input type="checkbox" role="switch" name="themeSwitch" id="themeSwitch"
                                className="toggle-input  "
                                onChange={toggleThemeSwitch}
                                checked={theme === "light"} />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
