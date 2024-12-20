import { createContext, useEffect, useState } from "react";

export const TodoContext = createContext();

export function TodoProvider({ children }) {
    !localStorage.getItem("theme") && localStorage.setItem("theme", "light");

    const [theme, setTheme] = useState(localStorage.getItem("theme"))
    const [todos, setTodos] = useState([]);
    const [authMethod, setAuthMethod] = useState(null);

    useEffect(() => {
        document.body.className = theme;
    }, [theme])


    return (
        <TodoContext.Provider value={{
            theme, setTheme,
            todos, setTodos,
            authMethod, setAuthMethod,
        }}>
            {children}
        </TodoContext.Provider>
    );
}





