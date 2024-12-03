import React from "react";
import axios from 'axios';
import { Trash2, EllipsisVertical, GripVertical } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TodoMoreContainer from "./todo more container";

export default function SingleTodo({ todo, todoMore, sortedTodos, setTodos, setTodoMore, menuRef, dragging, setDragging }) {

    console.log('todo', todo);
    const { attributes, listeners, setNodeRef, isDragging } = useSortable({ id: todo._id });

    if (isDragging) setDragging(todo._id);

    const className = `single-todo-container ${dragging === todo._id ? "dragging" : ''}`;
    console.log('dragging:', dragging);

    async function updateTodo(todoId, updatedData) {
        let outDatedData;
        function getUpdatedTodo(todo) {
            outDatedData = todo;
            console.log("getUpdatedTodo outdated todo:", outDatedData, '\n\n');
            return Object.assign(todo, updatedData);
        }
        setTodos((prev_todos) => prev_todos.map(
            todo => todo._id === todoId ? getUpdatedTodo(todo) : todo
        ));

        console.log('\ntodoId:', todoId, '\nupdatedData:', updatedData, '\noutDatedData:', outDatedData);
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
        const tempDeletedTodo = sortedTodos.find(todo => todo._id == todoId);
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

    function removeTag(e, id, index) {
        e.preventDefault();
        console.log('removeTag req', id, index);
        const tags = sortedTodos.find(todo => todo._id === id).tags;
        tags.splice(index, 1);
        console.log('removeTag tag', tags);
        updateTodo(
            id,
            { "tags": tags }
        );
    }


    return (
        <div className={className} key={todo._id} ref={setNodeRef} {...attributes} >
            <button {...listeners} className="btnR" style={{ cursor: "grab" }}>
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

            <button className="btnR todo-more-btn" onClick={() => setTodoMore(todo._id)}>
                {todoMore === todo._id &&
                    < TodoMoreContainer
                        menuRef={menuRef}
                        todo={todo}
                        sortedTodos={sortedTodos}
                        updateTodo={updateTodo}
                        setTodos />
                }
                < EllipsisVertical />
            </button>

            <button className="btnR" onClick={() => deleteTodo(todo._id)}>
                <Trash2 />
            </button>
        </div>
    );
} 