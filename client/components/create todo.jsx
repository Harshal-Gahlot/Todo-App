import axios from "axios";
import { useContext, useState } from "react";
import { TodoContext } from "./context api";

export default function CreateTodo() {
    const [title, setTitle] = useState('');
    const { setTodos } = useContext(TodoContext);

    function handleKeyDown(event) {
        if (event.key === "Enter") {
            addTodo()
        }
    }

    async function addTodo() {
        if (title === '') {
            return;
        }
        console.log(`In add Todo`);
        const todo_title = title;
        try {
            setTitle("")
            const key = `${Date.now()}`;
            setTodos((pre_todos) => [...pre_todos, { todo_title, "done": false, _id: key }]);
            const res = await axios.post("https://todo-app-be-0kqo.onrender.com/todo", {
                title: todo_title,
            }, {
                headers: { token: localStorage.getItem("token") }
            });
            setTodos((pre_todos) => pre_todos.map(todo => todo._id == key ? res.data : todo));
            setTitle("")            

        } catch (err) {
            console.error("\nThere is an error: \n", err);
            setTodos((pre_todos) => pre_todos.map(todo => todo._id == key ? null : todo));
            setTitle(todo_title)
        }
    }

    return (
        <div className="create-todo-container">
            <input className="create-todo-title" value={title} onChange={e => setTitle(e.target.value)}
                placeholder="What's upcoming?" onKeyDown={handleKeyDown}
            />
            <button onClick={addTodo} className="add-todo">
                <svg fill="var(--text-color)" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                    width="32px" height="32px" viewBox="0 0 45.402 45.402"
                    xml:space="preserve">
                    <g>
                        <path d="M41.267,18.557H26.832V4.134C26.832,1.851,24.99,0,22.707,0c-2.283,0-4.124,1.851-4.124,4.135v14.432H4.141
		c-2.283,0-4.139,1.851-4.138,4.135c-0.001,1.141,0.46,2.187,1.207,2.934c0.748,0.749,1.78,1.222,2.92,1.222h14.453V41.27
		c0,1.142,0.453,2.176,1.201,2.922c0.748,0.748,1.777,1.211,2.919,1.211c2.282,0,4.129-1.851,4.129-4.133V26.857h14.435
		c2.283,0,4.134-1.867,4.133-4.15C45.399,20.425,43.548,18.557,41.267,18.557z"/>
                    </g>
                </svg>
            </button>
        </div>
    );
}