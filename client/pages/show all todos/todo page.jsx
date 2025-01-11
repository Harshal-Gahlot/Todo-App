import CreateTodo from './components/create todo';
import TodoList from './todos container';
import AvatarSelection from '../avatar/avatar selection';
import Nav from '../nav/nav';
import { useEffect, useState } from 'react';
import './todos page.css'

export default function TodoPage() {
    const [showAvatarSelection, setShowAvatarSelection] = useState(false);

    useEffect(() => {
        if (localStorage.getItem("firstLogin")) {
            setShowAvatarSelection(true);
            localStorage.removeItem("firstLogin");
        }
    }, []);

    return (
        <>
        <div className="display-flex">
            <Nav />
            <div id="todo-page">

                <div id='create-show-all-todo-container'>
                    < CreateTodo />
                    < TodoList />
                </div>
            </div>
            {showAvatarSelection && < AvatarSelection setShowAvatarSelection={setShowAvatarSelection} />}
        </div>
        </>
    );
}