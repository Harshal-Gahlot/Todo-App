import { Moon, Sun, Search, Settings, User } from 'lucide-react';
import { useContext } from 'react';
import { TodoContext } from './context api';

export default function HorizontalNav() {
    const { theme, setTheme } = useContext(TodoContext);

    function changeTheme() {
        const toTheme = theme === "light" ? "dark" : "light";
        localStorage.setItem("theme", toTheme)
        setTheme(toTheme)
    }

    return (
        <nav className='horizontal-nav'>
            <div className="nav-right">
                <button className="search-btn btn">
                    <Search />
                </button>
                <button className="btn theme-btn" onClick={changeTheme} >
                    {localStorage.getItem("theme") === "dark" ? <Moon /> : <Sun />}
                </button>
                <button className='profile-btn btn'>
                    <User />
                </button>
            </div>
        </nav >
    );
}
