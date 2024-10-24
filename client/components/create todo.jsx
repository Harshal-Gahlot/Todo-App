import axios from "axios";
import { useState } from "react";

export default function CreateTodo() {
    const [title, setTitle] = useState('');

    async function addTodo() {
        console.log("In add Todo");
        try {
            const res = await axios.post("http://localhost:3000/todo", {
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
            <h2>Create a todo:</h2>
            <label htmlFor="box">title:</label>
            <input className="todo-title" value={title} onChange={e => setTitle(e.target.value)} />
            <button onClick={addTodo}>Add</button>
        </div>
    );
}