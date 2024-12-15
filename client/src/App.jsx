import LandingPage from '../pages/landing page/landing page';
import TodoPage from '../pages/show all todos/todo page';
import ProfilePage from '../pages/profile/profile page';
import './CSS/index.css';
import '../pages/landing page/landing page.css';
import '../pages/show all todos/todos page.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

function App() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: localStorage.getItem("token") ? <TodoPage/> : <LandingPage/>
        }, {
            path: "/profile/:username",
            element: <ProfilePage/>
        }
    ])

    return (
        <div id="app-root-container">
            <RouterProvider router={router}/>
        </div>
    );
}

export default App;
