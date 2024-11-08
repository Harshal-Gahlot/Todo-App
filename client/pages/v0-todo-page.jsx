'use client';

import React, { useState, useEffect, useContext } from 'react';
import { Moon, Sun, Search, Plus, Trash2, Settings, User } from 'lucide-react';
import { TodoContext } from '../components/context api';

export default function TodoApp() {
    const {todos, setTodos} = useContext(TodoContext)
    const [newTodo, setNewTodo] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [isNavExpanded, setIsNavExpanded] = useState(true);

    useEffect(() => {
        document.body.classList.toggle('dark', isDarkMode);
    }, [isDarkMode]);

    const addTodo = () => {
        if (newTodo.trim() !== '') {
            setTodos([...todos, { id: Date.now(), text: newTodo, done: false }]);
            setNewTodo('');
        }
    };

    const toggleTodo = (id) => {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, done: !todo.done } : todo
        ));
    };

    const deleteTodo = (id) => {
        setTodos(todos.filter(todo => todo.id !== id));
    };

    const filteredTodos = todos.filter(todo =>
        todo.text.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="app-container">
            {/* Left Sidebar */}
            <nav className={`left-nav ${isNavExpanded ? 'expanded' : 'collapsed'}`}>
                <button onClick={() => setIsNavExpanded(!isNavExpanded)} className="nav-toggle">
                    {isNavExpanded ? '<' : '>'}
                </button>
                <button className="nav-button">
                    <Settings />
                    {isNavExpanded && <span>Settings</span>}
                </button>
            </nav>

            <div className="main-content">
                {/* Top Navigation */}
                <nav className="top-nav">
                    <div className="search-container">
                        <Search className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search todos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                    <div className="nav-controls">
                        <button onClick={() => setIsPublic(!isPublic)} className="toggle-button">
                            {isPublic ? 'Public' : 'Private'}
                        </button>
                        <button onClick={() => setIsDarkMode(!isDarkMode)} className="theme-toggle">
                            {isDarkMode ? <Sun /> : <Moon />}
                        </button>
                        <button className="profile-button">
                            <User />
                        </button>
                    </div>
                </nav>

                {/* Main Content */}
                <main className="todo-content">
                    <h1>Todo List</h1>

                    {/* Add Todo Form */}
                    <form onSubmit={(e) => { e.preventDefault(); addTodo(); }} className="add-todo-form">
                        <input
                            type="text"
                            value={newTodo}
                            onChange={(e) => setNewTodo(e.target.value)}
                            placeholder="Add a new todo..."
                            className="add-todo-input"
                        />
                        <button type="submit" className="add-todo-button">
                            <Plus />
                        </button>
                    </form>

                    {/* Todo List */}
                    <ul className="todo-list">
                        {filteredTodos.map(todo => (
                            <li key={todo.id} className="todo-item">
                                <input
                                    type="checkbox"
                                    checked={todo.done}
                                    onChange={() => toggleTodo(todo.id)}
                                    className="todo-checkbox"
                                />
                                <span className={`todo-text ${todo.done ? 'done' : ''}`}>
                                    {todo.text}
                                </span>
                                <button onClick={() => deleteTodo(todo.id)} className="delete-todo-button">
                                    <Trash2 />
                                </button>
                            </li>
                        ))}
                    </ul>
                </main>
            </div>
        </div>
    );
}