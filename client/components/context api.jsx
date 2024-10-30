import { createContext, useState } from "react";


export const TodoContext = createContext();

export function TodoProvider({ children }) {
    const [todos, setTodos] = useState([]);
    const [authMethod, setAuthMethod] = useState(null);

    return (
        <TodoContext.Provider value={{ todos, setTodos, authMethod, setAuthMethod }}>
            {children}
        </TodoContext.Provider>
    );
}