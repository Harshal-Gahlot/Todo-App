import { TodoProvider } from '../components/context api';
import CreateTodo from '../components/create todo';
import TodoList from '../components/show todos';

export default function TodoPage() {
    return (
        <div id="todo-page">
            <h1 id="todo-page-heading">
                Todo List
            </h1>
            <div id='create-show-all-todo-container'>
                <CreateTodo />
                <TodoList />
            </div>
                
        </div>
    );
}