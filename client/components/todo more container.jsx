
import { Tag, Pin, PinOff } from 'lucide-react';

export default function TodoMoreContainer({ menuRef, todo, updateTodo, sortedTodos, setTodoMore }) {
    // console.log("menuRef:", menuRef);
    // console.log('todo', todo);
    // console.log('updateTodo', updateTodo);

    function pinHandler() {
        updateTodo(todo._id, { "isPinned": !todo.isPinned });
        setTodoMore(null);
    }

    function tagFunction(e, id) {
        const tag = e.target.value.trim();
        console.log("Word complete, tag:", tag, "id:", id);
        if (tag === "") return;

        e.target.value = "";
        updateTodo(
            id,
            { "tags": [...sortedTodos.find(todo => todo._id === id).tags, tag] }
        );
    }

    return (
        <ul className="todo-more-container" innerref={menuRef}>
            <li className="btnR"
                onClick={pinHandler}>
                {todo.isPinned ? <PinOff /> : <Pin />}
                <p>{todo.isPinned ? "Unpin" : "Pin to top"}</p>
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
    );
}