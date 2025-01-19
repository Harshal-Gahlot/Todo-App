import { Search } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function SearchComponent() {
    const [openSearch, setOpenSearch] = useState(false);
    const [seachingName, setSearchingName] = useState(false);
    const [userNameArray, setUserNameArray] = useState([]);
    console.log('userNameArray', userNameArray);

    async function nameSearchQuery(searchTerm) {
        console.log("name searchTerm:", searchTerm);
        try {
            const users = await axios.get(`http://localhost:3000/userNameSearch/${searchTerm}`);
            console.log('users', users.data.matchingUsers);
            setUserNameArray(() => users.data.matchingUsers);
        } catch (e) {
            console.log("error while fetching user name term pattern:", e);
        }
    }

    return (
        <div className="search-bar" >
            <div style={openSearch ? { 'backgroundColor': 'var(--base-varient)' } : { 'backgroundColor': "transparent" }}
                className='search-icon-container' onClick={() => setOpenSearch(x => !x)} >
                <Search className="nav-icon" />
            </div>
            {openSearch &&
                <>
                    <span className='curve-border-style-container'>
                        <span className='curve-border-style'> </span>
                    </span>
                    <div className="search-box-container" onChange={(e) => nameSearchQuery(e.target.value)} >
                        <input type="text" className='search-name-input' />
                        {userNameArray &&
                            <ul className='search-results-box'> {
                                userNameArray.map(user => {
                                    return <li className='matched-username' key={user.id}>
                                        <Link to={`/profile/${user.name}`} >{user.name}</Link>
                                    </li>;
                                })}
                            </ul>
                        }
                    </div>
                </>
            }
        </div>
    );
}