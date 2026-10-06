import { Tag, Pin, PinOff, Globe, Lock, Trash2 } from 'lucide-react';
import { useRef, useState } from 'react';
import useClosePopupOutside from '../../../utils/close outside click';
// TODO:  Missing ARIA Labels & Focus Management
export default function TodoMoreContainer({ todo, updateTodo, deleteTodo, sortedTodos, setTodoMore }) {
    const [tagColor, setTagColor] = useState(localStorage.getItem("lastTagColor") ? localStorage.getItem("lastTagColor") : `var(--text-accent)`);
    const menuRef = useRef(null);
    useClosePopupOutside(menuRef, setTodoMore, null);

    const isPublic = todo.category === "public";

    function pinHandler(event) {
        updateTodo(todo._id, { "isPinned": !todo.isPinned });
        setTodoMore(null);
    }

    function toggleCategoryHandler(event) {
        const newCategory = isPublic ? "private" : "public";
        updateTodo(todo._id, { "category": newCategory });
        setTodoMore(null);
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

    function handleDelete(e) {
        e.stopPropagation();
        setTodoMore(null);
        deleteTodo(todo._id);
    }

    return (
        <ul className="todo-more-container" ref={menuRef}>

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
                <input type="text" placeholder="Add Tag" className="todo-tag-input" style={{ "color": tagColor }} onKeyDown={(e) => {
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

            <li className="btnR"
                onClick={pinHandler}>
                {todo.isPinned ? <PinOff /> : <Pin />}
                <p>{todo.isPinned ? "Unpin" : "Pin to top"}</p>
            </li>

            <li className="btnR"
                onClick={toggleCategoryHandler}>
                {isPublic ? <Lock /> : <Globe />}
                <p>{isPublic ? "Make Private" : "Make Public"}</p>
            </li>

            <li className="btnR todo-delete-btn" onClick={handleDelete}>
                <Trash2 />
                <p>Delete</p>
            </li>
        </ul>
    );
}