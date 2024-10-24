import { useEffect, useState } from "react";
import axios from 'axios';

export default function TodoList() { // TodoList({ token })
    const [todos, setTodos] = useState([]);

    useEffect(() => {
        async function fetchTodos() {
            try {
                const res = await axios.get("http://localhost:3000/todos", {
                    headers: {
                        token: localStorage.getItem("token")
                    }
                });
                console.log("res.data: ", res.data.todos);
                setTodos(res.data.todos);
            } catch (err) {
                console.error(`/n There is an err /n ${err}`);
            }
        }

        fetchTodos();
    }, [localStorage.getItem("token")]);

    return (
        <ul>
            {todos.map((todo) =>
                <li key={todo._id}>{todo.title} is {todo.done ? 'done' : 'incomplet'}</li>
            )}
        </ul>
    );
}