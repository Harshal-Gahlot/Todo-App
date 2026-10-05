import CreateTodo from './components/create todo';
import TodoList from './todos container';
import AvatarSelection from '../avatar/avatar selection';
import TodoCategorySwitcher from './components/todo category switcher';
import Nav from '../nav/nav';
import { useEffect, useState } from 'react';
import './todos page.css'

export default function TodoPage() {
    const [showAvatarSelection, setShowAvatarSelection] = useState(false);
    const userSettings = JSON.parse(localStorage.getItem("settings"))
    if (!userSettings) {
        localStorage.setItem("settings", JSON.stringify({
            createCategory: "public",
            showCategory: "all",
            theme: "dark",
        }))
    }
    if (!userSettings.createCategory) {
        userSettings.createCategory = "public";
        localStorage.setItem("settings", JSON.stringify(userSettings));
    }
    if (!userSettings.showCategory) {
        userSettings.showCategory = "all";
        localStorage.setItem("settings", JSON.stringify(userSettings));
    }
    if (!userSettings.theme) {
        userSettings.theme = "dark";
        localStorage.setItem("settings", JSON.stringify(userSettings));
    }
    const [showCategory, setShowCategory] = useState(userSettings.showCategory);

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
                    <div className="todo-page-header-container">
                        <div className="todo-page-header-left">
                            <p className="todo-page-header-text">Your Todos</p>
                        </div>
                        <div className="todo-page-header-right">
                            <TodoCategorySwitcher showCategory={showCategory} setShowCategory={setShowCategory} />
                        </div>
                    </div>

                    <div id='create-show-all-todo-container'>
                        <CreateTodo createCategory={userSettings.createCategory} />
                        <TodoList showCategory={showCategory} />
                    </div>
                </div>
                {showAvatarSelection && < AvatarSelection setShowAvatarSelection={setShowAvatarSelection} />}
            </div>
        </>
    );
}