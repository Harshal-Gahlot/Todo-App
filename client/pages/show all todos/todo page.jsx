import CreateTodo from './components/create todo';
import HorizontalNav from './components/horizontal nav';
import TodoList from './todos container';
import AvatarSelection from '../avatar/avatar selection';
import { useEffect, useState } from 'react';

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
            <div id="todo-page">
                < HorizontalNav />

                <div id='create-show-all-todo-container'>
                    < CreateTodo />
                    < TodoList />
                </div>
            </div>
            {showAvatarSelection && < AvatarSelection setShowAvatarSelection={setShowAvatarSelection} />}
        </>
    );
}