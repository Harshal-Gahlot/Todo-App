import { Moon, Sun, Search, Settings, User } from 'lucide-react';
import { useContext } from 'react';
import { TodoContext } from '../../context api';

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
                <button className="btnC">
                    <Search />
                </button>
                <button className="btnC" onClick={changeTheme} >
                    {localStorage.getItem("theme") === "dark" ? <Moon /> : <Sun />}
                </button>
                <button className='btnC'>
                    <User />
                </button>
            </div>
        </nav >
    );
}
