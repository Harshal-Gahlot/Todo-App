import LandingPage from '../pages/landing page/landing page';
import TodoPage from '../pages/show all todos/todo page';
import './CSS/index.css';
import '../pages/landing page/landing page.css';
import '../pages/show all todos/todos page.css';
import { TodoProvider } from '../pages/context api';

function App() {

    return (
        <TodoProvider>
            <div id="app-root-container">
                {localStorage.getItem("token") ? <TodoPage /> : <LandingPage />}
            </div>
        </TodoProvider>
    );
}

export default App;
