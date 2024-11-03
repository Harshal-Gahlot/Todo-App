import LandingPage from '../pages/landing page';
import TodoPage from '../pages/todo page';
import './CSS/landing page.css';
import './CSS/todos page.css';
import { TodoProvider } from '../components/context api';

function App() {
    console.log(localStorage.getItem("token"));
    return (
        <div id="app-root-container" className="dark">
            <TodoProvider>
                {localStorage.getItem("token") ? <TodoPage /> : <LandingPage />}
            </TodoProvider>
        </div>
    );
}

export default App;
