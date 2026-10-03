import { Moon, Sun, Settings, User, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { TodoContext } from "../context api";
import { useContext } from "react";
import SearchComponent from "./components/searchComponent";
import "./nav.css";

export default function Nav() {
    const { theme, toggleTheme } = useContext(TodoContext);

    const username = localStorage.getItem("username");

    return (
        <div id="nav-component">
            <div className="nav-top">
                <SearchComponent />
                {/* #TODO: fix UI and make it look good with background and responsive */}
            </div>
            <div className="nav-bottom nav-items">
                <Link className="btnC" to="/" title="Todos">
                    <img
                        src="/todo.svg"
                        alt="Todos"
                        className="nav-icon todo-icon"
                    />
                </Link>
                <Link className="btnC" to="/feed" title="Feed">
                    <Home className="nav-icon" />
                </Link>
                {username ? (
                    <Link
                        className="btnC"
                        to={`/profile/${username}`}
                        title="Profile"
                    >
                        <User className="nav-icon" />
                    </Link>
                ) : (
                    <Link to="/" className="btnC" title="Login / Home">
                        <User className="nav-icon" />
                    </Link>
                )}
                <Link className="btnC" to={`/${username}/settings`}>
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
