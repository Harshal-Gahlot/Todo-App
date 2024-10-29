import { TodoProvider } from '../components/context api';
import CreateTodo from '../components/create todo';
import TodoList from '../components/show todos';
import './App.css';

function App() {

    return (
        <div>
            <h1 id="heading">
                Todo List
            </h1>
            <TodoProvider>
                <CreateTodo />
                <TodoList />
            </TodoProvider>

        </div>
    );
}

export default App;
