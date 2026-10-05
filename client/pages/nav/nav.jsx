import { Moon, Sun, Settings, User, Home, Trash2, ListTodo } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { TodoContext } from "../context api";
import { useContext, useState } from "react";
import SearchComponent from "./components/searchComponent";
import "./nav.css";

export default function Nav() {
    const { theme, toggleTheme } = useContext(TodoContext);
    const location = useLocation();
    const currentPath = location.pathname;

    const username = localStorage.getItem("username");

    const isTodosActive = currentPath === "/";
    const isFeedActive = currentPath === "/feed";
    const isBinActive = currentPath === "/bin";
    const isProfileActive = username && currentPath.startsWith(`/profile/${username}`);
    const isSettingsActive = username && currentPath === `/${username}/settings`;
    const [openSearch, setOpenSearch] = useState(false);

    return (
        <div id="nav-component">
            <div className="nav-top nav-items">
                <Link
                    className={`btnC ${isTodosActive ? "active" : ""}`}
                    to="/"
                    title="Todos"
                >
                    {/*
                    <img
                        src="/todo.svg"
                        alt="Todos"
                        className="nav-icon todo-icon"
                    />
                    */}
                    <ListTodo className="nav-icon" />
                </Link>
                <Link
                    className={`btnC ${isFeedActive ? "active" : ""}`}
                    to="/feed"
                    title="Feed"
                >
                    <Home className="nav-icon" />
                </Link>
                <SearchComponent openSearch={openSearch} setOpenSearch={setOpenSearch} />
                {username ? (
                    <Link
                        className={`btnC ${isProfileActive ? "active" : ""}`}
                        to={`/profile/${username}`}
                        title="Profile"
                    >
                        <User className="nav-icon" />
                    </Link>
                ) : (
                    <Link
                        to="/"
                        className={`btnC ${isTodosActive ? "active" : ""}`}
                        title="Login / Home"
                    >
                        <User className="nav-icon" />
                    </Link>
                )}
                <Link
                    className={`btnC ${isBinActive ? "active" : ""}`}
                    to="/bin"
                    title="Bin"
                >
                    <Trash2 className="nav-icon" />
                </Link>
            </div>
            <div className="nav-bottom nav-items">
                <Link
                    className={`btnC ${isSettingsActive ? "active" : ""}`}
                    to={`/${username}/settings`}
                    title="Settings"
                >
                    <Settings className="nav-icon settings" />
                </Link>
                <button
                    className="btnC theme-toggle-btn"
                    onClick={toggleTheme}
                    title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                    aria-label="Toggle color theme"
                >
                    {theme === "dark" ? (
                        <Sun className="nav-icon" />
                    ) : (
                        <Moon className="nav-icon" />
                    )}
                </button>
            </div>
        </div>
    );
}
