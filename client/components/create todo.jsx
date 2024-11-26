import axios from "axios";
import { useContext, useState } from "react";
import { TodoContext } from "./context api";
import { Plus } from 'lucide-react';

export default function CreateTodo() {
    const [title, setTitle] = useState('');
    const { setTodos } = useContext(TodoContext);

    function handleKeyDown(event) {
        if (event.key === "Enter") {
            addTodo();
        }
    }

    async function addTodo() {
        if (title.trim() === '') {
            return;
        }
        console.log(`In add Todo`);
        const todo_title = title;
        const key = `${Date.now()}`;
        try {
            setTitle("");
            setTodos((pre_todos) => [...pre_todos, { todo_title, "done": false, _id: key }]);
            console.log("title:", todo_title);
            const res = await axios.post("https://todo-app-be-0kqo.onrender.com/todo", {
            // const res = awaita axios.post("http://localhost:3000/todo", {
                title: todo_title, category: "public"
            }, {
                headers: { token: localStorage.getItem("token") }
            });
            console.log(res)
            setTodos((pre_todos) => pre_todos.map(todo => todo._id === key ? res.data : todo));

        } catch (err) {
            console.error("\nThere is an error: \n", err);
            setTodos((pre_todos) => pre_todos.map(todo => todo._id === key ? null : todo));
            setTitle(todo_title);
        }
    }

    return (
        <div className="create-todo-container">
            <input id="create-todo-title" value={title} onChange={e => setTitle(e.target.value)}
                placeholder="What's upcoming?" onKeyDown={handleKeyDown}
            />
            <button onClick={addTodo} className="add-todo">
                <Plus color="var(--text-color)" className="plus-btn" />
            </button>
        </div>
    );
}