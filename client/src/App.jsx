import LandingPage from '../pages/landing page/landing page';
import TodoPage from '../pages/show all todos/todo page';
import ProfilePage from '../pages/profile/profile page.jsx';
import SettingsPage from '../pages/settings/settings page.jsx';
import Nav from '../pages/nav/nav.jsx';
import './CSS/index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

function App() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: localStorage.getItem("token") ? <TodoPage /> : <LandingPage />
        }, {
            path: "/profile/:username",
            element: <ProfilePage /> 
        }, {
            path: "/:username/settings",
            element: <SettingsPage /> 
        }
    ]);

    return (
        <div id="app-root-container">
            <RouterProvider router={router} />
        </div>
    );
}

export default App;
