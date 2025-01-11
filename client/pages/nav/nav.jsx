import { Moon, Sun, Search, Settings, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TodoContext } from '../context api';
import { useContext } from 'react';
import { useLocation, matchPath } from 'react-router-dom';
import "./nav.css";

export default function Nav() {

    const { theme, setTheme } = useContext(TodoContext);
    const currentURL = useLocation().pathname;
    console.log(currentURL);
    const isProfilePage = matchPath("/profile/*", currentURL);
    const isTodoPage = matchPath("/", currentURL);

    function changeTheme() {
        const toTheme = theme === "light" ? "dark" : "light";
        localStorage.setItem("theme", toTheme);
        setTheme(toTheme);
    }

    return (
        <div id="nav-component">
            <div className="top nav-items">
                <Search className="nav-icon" />
            </div>
            <div className="bottom nav-items">
                {isTodoPage ?
                    <Link className='btnC' to={`/profile/${localStorage.getItem("username")}`}>
                        <User className='nav-icon' />
                    </Link>
                    : <Link to="/">
                        {/* <User className='nav-icon' /> */}
                        <img src="/todo.svg" alt="" className='nav-icon todo-icon' />
                    </Link>
                }
                <button className="btnC" onClick={changeTheme} >
                    {localStorage.getItem("theme") === "dark" ? <Moon className='nav-icon' /> : <Sun className='nav-icon' />}
                </button>
                {/* <Settings className="nav-icon" /> */}
            </div>
        </div>
    );
}