import axios from "axios";
import { useContext, useState } from "react";
import { TodoContext } from "./context api";

export default function CreateTodo() {
    const [title, setTitle] = useState('');
    const { setTodos } = useContext(TodoContext);

    async function addTodo() {
        console.log("In add Todo");
        try {
            setTodos((pre_todos) => [...pre_todos, { title, done: false }]);
            const res = await axios.post("https://todo-app-be-0kqo.onrender.com/todo", {
                title: title,
            }, {
                headers: { token: localStorage.getItem("token") }
            });
            console.log('res:', res);
        } catch (err) {
            console.error("\nThere is an error: \n", err);
        }
    }

    return (
        <div className="todo-container">
            <label htmlFor="box">title:</label>
            <input className="todo-title" value={title} onChange={e => setTitle(e.target.value)} />
            <button onClick={addTodo}>Add</button>
        </div>
    );
}