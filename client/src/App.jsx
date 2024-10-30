import LandingPage from '../pages/landing page';
import TodoPage from '../pages/display todos page';
import './App.css';
import { TodoProvider } from '../components/context api';

function App() {
    console.log(localStorage.getItem("token"));
    return (
        <div id="app-root-container">
            <TodoProvider>
                {localStorage.getItem("token") ? <TodoPage /> : <LandingPage />}
            </TodoProvider>
        </div>
    );
}

export default App;
