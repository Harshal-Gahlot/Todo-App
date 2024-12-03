import { useContext, useEffect, useRef, useState } from "react";
import axios from 'axios';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { TodoContext } from "./context api";
import SingleTodo from "./single todo";

export default function TodoList() {
    const { todos, setTodos } = useContext(TodoContext);
    const [todoMore, setTodoMore] = useState(null);
    const [dragging, setDragging] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => { // Fetch all todos
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

    useEffect(() => { // Close todo menu when clicked outside
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setTodoMore(null);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    function handleDragEnd(event) {
        console.log(event);
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        setDragging(null);

        const oldIndex = sortedTodos.findIndex((todo) => todo._id === active.id);
        const newIndex = sortedTodos.findIndex((todo) => todo._id === over.id);

        setTodos(arrayMove(sortedTodos, oldIndex, newIndex));
    }

    const sortedTodos = [...todos].sort((a, b) => b.isPinned - a.isPinned);
    console.log("ReRendered");

    return (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={sortedTodos} strategy={verticalListSortingStrategy}>
                <div className="all-todos" key="all-todos">
                    {sortedTodos.length > 0 && sortedTodos.map((todo) =>
                        <SingleTodo
                            key={todo._id}
                            todo={todo}
                            sortedTodos={sortedTodos}
                            todoMore={todoMore}
                            setTodos={setTodos}
                            setTodoMore={setTodoMore}
                            menuRef={menuRef}
                            dragging={dragging}
                            setDragging={setDragging}
                        />
                    )}
                </div>
            </SortableContext>
        </DndContext>
    );
}