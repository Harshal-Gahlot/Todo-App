import LandingPage from '../pages/landing page';
import TodoPage from '../pages/todo page';
import './CSS/landing page.css';
import './CSS/todos page.css';
// import './CSS/v0-todo-page.css';
import { TodoProvider } from '../components/context api';
// import TodoApp from '../pages/v0-todo-page';

function App() {

    return (
        <TodoProvider>
            <div id="app-root-container">
                {/* {localStorage.getItem("token") ? <TodoApp /> : <LandingPage />} */}
                {localStorage.getItem("token") ? <TodoPage /> : <LandingPage />}
            </div>
        </TodoProvider>
    );
}

export default App;
