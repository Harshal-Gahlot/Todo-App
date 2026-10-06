import React, { useLayoutEffect, useRef, useState } from "react";
import axios from 'axios';
import { EllipsisVertical, GripVertical } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TodoMoreContainer from "./todo more container";
import { API_BASE } from "../../../utils/config";
// TODO: display popped up dragable todo for better UX
export default function SingleTodo({ todo, todoMore, sortedTodos, setTodos, setTodoMore, dragging, setDragging }) {
    const titleRef = useRef(null);
    const [titleExpanded, setTitleExpanded] = useState(false);
    const [titleTruncated, setTitleTruncated] = useState(false);

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: todo._id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    console.log("style:", style);

    const className = "single-todo-container";

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
            const res = await axios.patch(
                `${API_BASE}/todo/${todoId}`,
                updatedData,
                {
                    headers: {
                        "token": localStorage.getItem("token")
                    }
                }
            );
            console.log("updated todo successfully, res:", res);
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

        const settings = JSON.parse(localStorage.getItem("settings") || "{}");
        const directDelete = settings.directDelete === true;

        try {
            if (directDelete) {
                // Hard delete — permanently remove
                await axios.delete(`${API_BASE}/todo/${todoId}`, {
                    headers: { "token": localStorage.getItem("token") }
                });
            } else {
                // Soft delete — move to bin
                const deletedTodo = await axios.patch(`${API_BASE}/todo/${todoId}/delete`, {}, {
                    headers: { "token": localStorage.getItem("token") }
                });
                console.log('deletedTodo:', deletedTodo);
            }
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

    function moreTodoBtn(id) {
        setTodoMore(() => id);
    }

    useLayoutEffect(() => {
        const el = titleRef.current;
        if (!el) return;

        const checkTruncation = () => {
            if (titleExpanded) return;
            setTitleTruncated(el.scrollWidth > el.clientWidth + 1);
        };

        checkTruncation();
        const observer = new ResizeObserver(checkTruncation);
        observer.observe(el);
        window.addEventListener('resize', checkTruncation);
        document.fonts?.ready?.then(checkTruncation);

        return () => {
            observer.disconnect();
            window.removeEventListener('resize', checkTruncation);
        };
    }, [todo.title, todo.tags, titleExpanded]);

    return (
        <div className={`${className}${titleExpanded ? ' todo-expanded' : ''}`} key={todo._id} style={style} ref={setNodeRef} {...attributes} >
            <button {...listeners} key={todo._id} className="btnR" ref={setNodeRef} style={{ cursor: "grab", touchAction: "none" }}>
                <GripVertical />
            </button>

            <input type="checkbox"
                className="todo-checkbox" id={`todo-checkbox-${todo._id}`}
                onChange={() => updateTodo(todo._id, { "done": !todo.done })}
                checked={todo.done} />
            <div className="todo-title">
                <label htmlFor={`todo-checkbox-${todo._id}`} className="todo-title-text">
                    <span className="todo-title-label" ref={titleRef}>{todo.title}</span>

                    <ul className="todo-tag-container">
                        {todo.tags.map(([tag, tagColor], index) =>
                            <li key={index} onClick={(e) => removeTag(e, todo._id, index)} className="todo-tag"
                                style={{
                                    backgroundColor: tagColor + '22',
                                    borderColor: tagColor + '55',
                                    color: tagColor
                                }}>{tag}</li>
                        )}
                    </ul>
                </label>
                {(titleTruncated || titleExpanded) && (
                    <button
                        type="button"
                        className="btnR todo-title-expand-btn"
                        aria-expanded={titleExpanded}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setTitleExpanded((open) => !open);
                        }}
                    >
                        {titleExpanded ? 'less' : 'more'}
                    </button>
                )}
            </div>

            <button className="btnR todo-more-btn" onClick={() => moreTodoBtn(todo._id)}>
                {todoMore === todo._id &&
                    <TodoMoreContainer
                        todo={todo}
                        sortedTodos={sortedTodos}
                        updateTodo={updateTodo}
                        deleteTodo={deleteTodo}
                        setTodoMore={setTodoMore} />
                }
                <EllipsisVertical />
            </button>
        </div>
    );
}
