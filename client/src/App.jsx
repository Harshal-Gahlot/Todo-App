import LandingPage from '../pages/landing page';
import TodoPage from '../pages/todo page';
import './CSS/index.css';
import './CSS/landing page.css';
import './CSS/todos page.css';
import { TodoProvider } from '../components/context api';

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
