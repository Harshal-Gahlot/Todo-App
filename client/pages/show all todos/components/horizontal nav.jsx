import { Moon, Sun, Search, Settings, User } from 'lucide-react';
import { useContext } from 'react';
import { TodoContext } from '../../context api';
import { Link } from 'react-router-dom';

export default function HorizontalNav() {
    const { theme, setTheme, setCurrentPage } = useContext(TodoContext);

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

                <button className='btnC' onClick={() => setCurrentPage("ProfilePage")}>
                    <Link to="/profile/Harshal">
                        <User />
                    </Link>
                </button>
            </div>
        </nav >
    );
}
