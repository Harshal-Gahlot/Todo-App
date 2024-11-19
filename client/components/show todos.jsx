import { useContext, useEffect, useState } from "react";
import axios from 'axios';
import { TodoContext } from "./context api";
import { Trash2, EllipsisVertical, Tag, Pin, PinOff, GripVertical, Grab } from 'lucide-react';

export default function TodoList() {
    const { todos, setTodos } = useContext(TodoContext);
    const [todoMore, setTodoMore] = useState(null);

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
        <div className="all-todos" >
            {todos.map((todo) =>
                <div className="single-todo-container" key={todo._id}>
                    <button className="btnR" style={{cursor:"grab"}}>
                        < GripVertical />
                    </button>
                    <input type="checkbox"
                        className="todo-checkbox" id={`todo-checkbox-${todo._id}`}
                        onChange={() => updateTodo(todo._id, { "done": !todo.done })}
                        checked={todo.done} />
                    <div className="todo-title">
                        <label htmlFor={`todo-checkbox-${todo._id}`} className="todo-title-text" >
                            {todo.title}
                        </label>
                    </div>
                    <button className="btnR todo-more-btn" onClick={() => setTodoMore(todo.id)}>
                        {todoMore === todo.id ?
                            <div className="todo-more-container">
                                <button className="btnR" onClick={() => updateTodo(todo._id, { "important": !todo.important })}>
                                    {todo.tag && todo.tag.find(tag => tag === "pin") ? <Pin /> : <PinOff />} 
                                    <p>Pin to top</p> 
                                </button>
                                <button className="btnR todo-tag-btn" onClick={todoMore}>
                                    < Tag />
                                    <input type="text" placeholder="Add tag" className="todo-tag-input" />
                                </button>
                            </div>
                        : < EllipsisVertical />}
                    </button>

                    <button className="btnR" onClick={() => deleteTodo(todo._id)}>
                        < Trash2 />
                    </button>
                </div>)
            }
        </div>
    );
}