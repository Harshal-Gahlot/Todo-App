import { Tag, Pin, PinOff } from 'lucide-react';
import { useState } from 'react';

export default function TodoMoreContainer({ menuRef, todo, updateTodo, sortedTodos, setTodoMore }) {
    const [tagColor, setTagColor] = useState(localStorage.getItem("lastTagColor") ? localStorage.getItem("lastTagColor") : `var(--unique-color)`);

    function pinHandler(event) {
        updateTodo(todo._id, { "isPinned": !todo.isPinned });
        setTodoMore(null);
        // event.preventDefault();
        event.stopPropagation();
        console.log('aaaaaaaaaaaaaaaaaaaaa');
    }

    function tagFunction(e, id) {
        const tag = e.target.value.trim();
        console.log("Word complete, tag:", tag, "id:", id);
        if (tag === "") return;
        localStorage.setItem("lastTagColor", tagColor);

        e.target.value = "";
        updateTodo(
            id,
            { "tags": [...sortedTodos.find(todo => todo._id === id).tags, [tag, tagColor]] }
        );
    }

    return (
        <ul className="todo-more-container" ref={menuRef}>
            <li className="btnR"
                onClick={pinHandler}>
                {todo.isPinned ? <PinOff /> : <Pin />}
                <p>{todo.isPinned ? "Unpin" : "Pin to top"}</p>
            </li>
            <li className="btnR todo-tag-btn" onClick={(e) => e.stopPropagation()} >


                <div className='tag-color-input-div'>

                    <input type="color" className='tag-color-input' value={tagColor}
                        onChange={(e) => setTagColor(e.target.value)} />

                    <Tag fill={tagColor} color='#ddd' style={{
                        display: "flex",
                        position: "absolute",
                        alignItems: "center"
                    }} />

                </div>


                <input type="text" placeholder="Add Tag" className="todo-tag-input" onKeyDown={(e) => {
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
    );
}