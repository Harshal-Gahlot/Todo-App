import { createContext, useEffect, useState } from "react";

export const TodoContext = createContext();

export function TodoProvider({ children }) {
    // Get initial theme from localStorage or system preference
    const getInitialTheme = () => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) return savedTheme;
        if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
            return "light";
        }
        return "dark";
    };

    const [theme, setThemeState] = useState(getInitialTheme);

    const setTheme = (newTheme) => {
        localStorage.setItem("theme", newTheme);
        setThemeState(newTheme);
    };

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    if (!localStorage.getItem("settings")) {
        localStorage.setItem("settings", JSON.stringify({ category: "public" }));
    }
    const userSettingsObj = JSON.parse(localStorage.getItem("settings"));

    const [todos, setTodos] = useState([]);
    const [authMethod, setAuthMethod] = useState(null);

    useEffect(() => {
        document.body.className = theme;
        document.documentElement.className = theme;
    }, [theme]);


    return (
        <TodoContext.Provider value={{
            theme, setTheme, toggleTheme,
            userSettingsObj,
            todos, setTodos,
            authMethod, setAuthMethod,
        }}>
            {children}
        </TodoContext.Provider>
    );
}





