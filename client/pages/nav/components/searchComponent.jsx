import { Search } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function SearchComponent() {
    const [openSearch, setOpenSearch] = useState(false);
    const [seachingName, setSearchingName] = useState(false);
    const [userNameArray, setUserNameArray] = useState([]);
    const searchBarRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
                setOpenSearch(false);
            }
        }

        if (openSearch) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openSearch]);

    async function nameSearchQuery(searchTerm) {
        console.log("name searchTerm:", searchTerm);
        if (!searchTerm || searchTerm.trim() === '') {
            setUserNameArray([]);
            return;
        }
        try {
            const users = await axios.get(
                `https://todo-app-be-0kqo.onrender.com/userNameSearch/${searchTerm}`
                // `http://localhost:3000/userNameSearch/${searchTerm}`
            );
            console.log('users', users.data.matchingUsers);
            setUserNameArray(() => users.data.matchingUsers);
        } catch (e) {
            console.log("error while fetching user name term pattern:", e);
        }
    }

    return (
        <div className="search-bar" ref={searchBarRef}>
            <div style={openSearch ? { 'backgroundColor': 'var(--bg-light)' } : { 'backgroundColor': "transparent" }}
                className='search-icon-container' onClick={() => setOpenSearch(x => !x)} >
                <Search className="nav-icon" />
            </div>
            {openSearch &&
                <>
                    <div className="search-box-container" onChange={(e) => nameSearchQuery(e.target.value)} >
                        <input type="text" className='search-name-input' autoFocus placeholder="Search users..." />
                        <span className='search-name-input-line' ></span>
                        {userNameArray.length != 0 &&
                            <>
                                <span className='curve-border-style-container'>
                                    <span className='curve-border-style'> </span>
                                </span>
                                <ul className='search-results-box'> {
                                    userNameArray.map(user => {
                                        return <li className='matched-username' key={user.id} onClick={() => setOpenSearch(false)}>
                                            <Link to={`/profile/${user.name}`} >{user.name}</Link>
                                        </li>;
                                    })}
                                </ul>
                            </>}
                    </div>
                </>
            }
        </div>
    );
}