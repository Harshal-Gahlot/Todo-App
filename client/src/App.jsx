import LandingPage from '../pages/landing page';
import TodoPage from '../pages/display todos page';
import './App.css';

function App() {
    console.log(localStorage.getItem("token"))
    return (
        <>
            {localStorage.getItem("token") ? <TodoPage /> : <LandingPage />}
        </>
    );
}

export default App;
