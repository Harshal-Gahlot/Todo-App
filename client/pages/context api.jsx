import { createContext, useEffect, useState } from "react";

export const TodoContext = createContext();

export function TodoProvider({ children }) {
    !localStorage.getItem("theme") && localStorage.setItem("theme", "dark");
    const [theme, setTheme] = useState(localStorage.getItem("theme"));

    if (!localStorage.getItem("settings")) {
        localStorage.setItem("settings", JSON.stringify({ category: "public" }));
    }
    const userSettingsObj = JSON.parse(localStorage.getItem("settings"))

    const [todos, setTodos] = useState([]);
    const [authMethod, setAuthMethod] = useState(null);

    useEffect(() => {
        document.body.className = theme;
    }, [theme]);


    return (
        <TodoContext.Provider value={{
            theme, setTheme,
            userSettingsObj,
            todos, setTodos,
            authMethod, setAuthMethod,
        }}>
            {children}
        </TodoContext.Provider>
    );
}





