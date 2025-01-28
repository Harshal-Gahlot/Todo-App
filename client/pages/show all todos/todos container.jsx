import { useContext, useEffect, useRef, useState } from "react";
import axios from 'axios';
import { DndContext, KeyboardSensor, MouseSensor, PointerSensor, TouchSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { TodoContext } from "../context api";
import SingleTodo from "./components/single todo";

export default function TodoList() {
    const { todos, setTodos } = useContext(TodoContext);
    const [todoMore, setTodoMore] = useState(null);
    const [dragging, setDragging] = useState(false);
    // const sensors = useSensors(
    //     useSensor(PointerSensor),
    //     useSensor(TouchSensor),
    //     useSensor(KeyboardSensor, {
    //         coordinateGetter: sortableKeyboardCoordinates
    //     })
    // );
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 200,
                tolerance: 6,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    useEffect(() => { // Fetch all todos
        async function fetchTodos() {
            try {
                const res = await axios.get(
                    "https://todo-app-be-0kqo.onrender.com/todos", {
                // "http://localhost:3000/todos", {
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
        <DndContext collisionDetection={closestCenter} sensors={sensors} onDragEnd={handleDragEnd}>
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
                            dragging={dragging}
                            setDragging={setDragging}
                        />
                    )}
                </div>
            </SortableContext>
        </DndContext>
    );
}