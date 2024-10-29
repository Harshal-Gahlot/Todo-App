import LandingPage from '../pages/landing page';
import TodoPage from '../pages/display todos page';
import './App.css';

function App() {
    console.log(localStorage.getItem("token"))
    return (
        <div id="app-root-container">
            {localStorage.getItem("token") ? <TodoPage /> : <LandingPage />}
        </div>
    );
}

export default App;
