import axios from "axios";
import "./settings.css";
import { useContext, useState } from "react";
import { TodoContext } from "../context api";

export default function SettingsPage() {
    const { userSettingsObj } = useContext(TodoContext);
    const category = userSettingsObj.category

    function toggleCategory(e) {
        const toggleTo = e.target.checked ? "public" : "private";
        userSettingsObj.category = toggleTo
        localStorage.setItem("settings", JSON.stringify(userSettingsObj));
    }

    return (
        <div className="setting-container">
            <div className="todo-default-container">
                <p className="list-title">
                    Todo default
                </p>
                <div className="defaults-list">
                    <label htmlFor="category">Created todos are by default:</label>
                    <input type="checkbox" role="switch" name="category" id="category"
                        className="toggle-input"
                        onChange={(event) => toggleCategory(event)}
                        defaultChecked={category === "public" ? true : false} />
                </div>
            </div>
            <div>
            </div>
        </div>
    );
}