import { createContext, useEffect, useState } from "react";

export const TodoContext = createContext();

export function TodoProvider({ children }) {
    !localStorage.getItem("theme") && localStorage.setItem("theme", "light");
    const currentPageInit = localStorage.getItem("token") ? "TodoPage" : "LandingPage"

    const [currentPage, setCurrentPage] = useState(currentPageInit);
    const [theme, setTheme] = useState(localStorage.getItem("theme"))
    const [todos, setTodos] = useState([]);
    const [authMethod, setAuthMethod] = useState(null);

    useEffect(() => {
        document.body.className = theme;
    }, [theme])


    return (
        <TodoContext.Provider value={{
            currentPage, setCurrentPage,
            theme, setTheme,
            todos, setTodos,
            authMethod, setAuthMethod,
        }}>
            {children}
        </TodoContext.Provider>
    );
}





