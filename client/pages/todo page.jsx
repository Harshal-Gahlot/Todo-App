import { useState } from 'react';
import CreateTodo from '../components/create todo';
import HorizontalNav from '../components/horizontal nav';
import TodoList from '../components/todos container';

export default function TodoPage() {
    const [showMenu, setShowMenu] = useState(null);
    return (
        <div id="todo-page">
            <HorizontalNav />
            <div id='create-show-all-todo-container'>
                <CreateTodo />
                <TodoList />
            </div>

        </div>
    );
}