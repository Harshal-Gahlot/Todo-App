import { useContext, useEffect } from "react";
import axios from 'axios';
import { TodoContext } from "./context api";

export default function TodoList() {
    const { todos, setTodos } = useContext(TodoContext);

    useEffect(() => {
        async function fetchTodos() {
            try {
                const res = await axios.get("https://todo-app-be-0kqo.onrender.com/todos", {
                    headers: {
                        token: localStorage.getItem("token")
                    }
                });
                setTodos(res.data.todos);
            } catch (err) {
                console.error(`/n There is an err /n ${err}`);
            }
        }

        fetchTodos();
    }, [localStorage.getItem("token"),]);

    async function updateTodo(todoId, updatedData) {
        let outdatedData = {};
        function getUpdatedTodo(todo) {
            outdatedData = todo;
            return Object.assign(todo, updatedData);
        }
        setTodos((prev_todos) => prev_todos.map(
            todo => todo._id == todoId ? getUpdatedTodo(todo) : todo
        ));

        try {
            await axios.patch(`https://todo-app-be-0kqo.onrender.com/todo/${todoId}`, updatedData, {
                headers: {
                    "token": localStorage.getItem("token")
                }
            });

        } catch (err) {
            setTodos((prev_todos) => prev_todos.map(
                todo => todo._id == todoId ? Object.assign(todo, outdatedData) : todo
            ));
            console.error(`\nThere is an error with updating this: ${updatedData} \n ${err}`);
        }
    }

    async function deleteTodo(todoId) {
        console.log("todoId:", todoId);
        const tempDeletedTodo = todos.find(todo => todo._id == todoId);
        setTodos((prev_todos) => prev_todos.filter(todo => todo._id != todoId));

        try {
            const deletedTodo = await axios.delete(`https://todo-app-be-0kqo.onrender.com/todo/${todoId}`, {
                headers: {
                    "token": localStorage.getItem("token")
                }
            });
            console.log('deletedTodo:', deletedTodo);
        } catch (err) {
            console.log("\nHarshal error occured while deleting todo:\n", err);
            setTodos((prev_todos) => [...prev_todos, tempDeletedTodo]);
        }

    }

    return (
        <ul className="all-todos" >
            {todos.map((todo) =>
                <div className="todo-div" key={todo._id}>
                    <input
                        type="checkbox"
                        className="todo-checkbox"
                        checked={todo.done}
                        onChange={() => updateTodo(todo._id, { "done": !todo.done })}
                    />
                    <li className="todo-title">{todo.title}</li>
                    <button className="todo-delete" onClick={() => deleteTodo(todo._id)}>Delete</button>
                </div>)
            }
        </ul>
    );
}