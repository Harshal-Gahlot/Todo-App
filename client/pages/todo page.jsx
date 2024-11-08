// import { TodoProvider } from '../components/context api';
import CreateTodo from '../components/create todo';
import HorizontalNav from '../components/horizontal nav';
import TodoList from '../components/show todos';

export default function TodoPage() {
    return (
        <div id="todo-page">
            <HorizontalNav/>
            <div id='create-show-all-todo-container'>
                <CreateTodo />
                <TodoList />
            </div>
                
        </div>
    );
}