import { useContext, useEffect, useRef, useState } from "react";
import axios from 'axios';
import { TodoContext } from "./context api";
import { Trash2, EllipsisVertical, Tag, Pin, PinOff, GripVertical, Grab, Outdent } from 'lucide-react';

export default function TodoList() {
    const { todos, setTodos } = useContext(TodoContext);
    const [todoMore, setTodoMore] = useState(null);
    const menuRef = useRef(null);

    async function updateTodo(todoId, updatedData) {
        let outDatedData;
        function getUpdatedTodo(todo) {
            outDatedData = todo;
            console.log("getUpdatedTodo outdated todo", outDatedData);
            return Object.assign(todo, updatedData);
        }
        setTodos((prev_todos) => prev_todos.map(
            todo => todo._id === todoId ? getUpdatedTodo(todo) : todo
        ));

        console.log('todoId, updatedData, outDatedData', todoId, updatedData, outDatedData);
        try {
            await axios.patch(`https://todo-app-be-0kqo.onrender.com/todo/${todoId}`,
                // await axios.patch(`http://localhost:3000/todo/${todoId}`,
                updatedData,
                {
                    headers: {
                        "token": localStorage.getItem("token")
                    }
                }
            );

        } catch (err) {
            setTodos((prev_todos) => prev_todos.map(
                todo => todo._id == todoId ? Object.assign(todo, outDatedData) : todo
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

    useEffect(() => {
        function handleClickOutside(event) {
            console.log("UseEffect, event.target:", event.target);
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setTodoMore(null);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    function toggleMenu(id) {
        setTodoMore(todoMore === id ? null : id);
    }

    function togglePin(id) {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, isPinned: !todo.isPinned } : todo
        ));
    };

    function tagFunction(e, id) {
        const tag = e.target.value.trim();
        console.log("Word complete, tag:", tag, "id:", id);
        if (tag === "") {
            return;
        }
        e.target.value = "";
        updateTodo(
            id,
            { "tags": [...todos.find(todo => todo._id === id).tags, tag] }
        );
    }

    function removeTag(e, id, index) {
        e.preventDefault();
        console.log('removeTag req', id, index);
        const tags = todos.find(todo => todo._id === id).tags;
        tags.splice(index, 1); // splice starts removeing the item(s) from the (1st arg) idx & removes (2nd arg) n items &
        console.log('removeTag tag', tags);
        updateTodo(
            id,
            { "tags": tags }
        );
    }

    return (
        <div className="all-todos">
            {todos.map((todo) =>
                <div key={todo._id} className=
                    {todo.isPinned ? "pined single-todo-container" : "single-todo-container"}>
                    <button className="btnR" style={{ cursor: "grab" }}>
                        <GripVertical />
                    </button>

                    <input type="checkbox"
                        className="todo-checkbox" id={`todo-checkbox-${todo._id}`}
                        onChange={() => updateTodo(todo._id, { "done": !todo.done })}
                        checked={todo.done} />
                    <div className="todo-title">
                        <label htmlFor={`todo-checkbox-${todo._id}`} className="todo-title-text">
                            {todo.title}
                            <ul className="todo-tag-container">
                                {todo.tags.map((tag, index) =>
                                    <li key={index} onClick={(e) => removeTag(e, todo._id, index)} className="todo-tag">{tag}</li>
                                )}
                            </ul>
                        </label>
                    </div>

                    <button className="btnR todo-more-btn" onClick={() => toggleMenu(todo._id)}>
                        {
                            todoMore === todo._id &&
                            <ul className="todo-more-container" ref={menuRef}>
                                <li className="btnR" onClick={() => togglePin(todo._id)}>
                                    {todo.tag && todo.tag.find(tag => tag === "pin") ? <Pin /> : <PinOff />}
                                    <p>Pin to top</p>
                                </li>
                                <li className="btnR todo-tag-btn" onClick={(e) => e.stopPropagation()} >
                                    <Tag />
                                    <input type="text"
                                        placeholder="Add Tag"
                                        className="todo-tag-input"
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                tagFunction(e, todo._id);
                                                e.preventDefault();
                                            } else if (e.key === " ") {
                                                console.log("SPACE pressed");
                                                e.target.value = e.target.value + " ";
                                                e.preventDefault();
                                            }
                                        }}
                                    />
                                </li>
                            </ul>
                        }
                        <EllipsisVertical />
                    </button>
                    <button className="btnR" onClick={() => deleteTodo(todo._id)}>
                        <Trash2 />
                    </button>
                </div>
            )}
        </div>
    );
}