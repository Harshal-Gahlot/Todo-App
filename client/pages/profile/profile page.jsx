import axios from "axios";
import { Twitter, Linkedin, Link, Github, Gitlab, Youtube } from 'lucide-react';
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ProfilePage() {
    const params = useParams();
    const [userData, setUserData] = useState({});
    const [editable, setEditable] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log('profilePage mounted with name::::::::::::::', params.username);
        async function getProfileData() {
            try {
                const res = await axios.get(`http://localhost:3000/profile/${params.username}`);
                const { userData, editable } = res.data;
                console.log('Fetch userData:', userData);
                setUserData(userData);
                setEditable(editable);

            } catch (error) {
                console.log('errorrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr', error);
                setError("Failed to fetch user data, perhaps incorrect username");
            }
        }

        if (params.username) {
            getProfileData();
        } else {
            console.log("username not provided");
            setError("No username provided");
        }


    }, [params.username]);

    if (!userData && !error) {
        return <h1>Loading...</h1>;
    }

    if (error) {
        return <h1>{error}</h1>;
    }


    return (
        <div id="profile-container" onstart>
            <div className="left">
                <div className="pfp-container">
                    <img src="" alt="" />
                </div>
                <h1 className="name">{String(params.username)}</h1>
                <button className="view-following">following</button>
                <button className="view-followers">followers</button>
                <ul className="social-media-links">
                    {userData?.links?.site && (
                        <li>
                            <a href={userData.links.site}>
                                <Link color="var(--text-varient)" />
                            </a>
                        </li>
                    )}
                    {userData?.links?.X && (
                        <li>
                            <a href={userData.links.X}>
                                <Twitter color="var(--text-varient)"/>
                            </a>
                        </li>
                    )}
                    {userData?.links?.Lnkedin && (
                        <li>
                            <a href={userData.links.Lnkedin}>
                                <Linkedin color="var(--text-varient)" />
                            </a>
                        </li>
                    )}
                    {userData?.links?.github && (
                        <li>
                            <a href={userData.links.github}>
                                <Github color="var(--text-varient)" />
                            </a>
                        </li>
                    )}
                    {userData?.links?.gitlab && (
                        <li>
                            <a href={userData.links.gitlab}>
                                <Gitlab color="var(--text-varient)" />
                            </a>
                        </li>
                    )}
                    {userData?.links?.YT && (
                        <li>
                            <a href={userData.links.YT}>
                                <Youtube color="var(--text-varient)" />
                            </a>
                        </li>
                    )}
                </ul>
            </div>
            <div className="user-bio">

            </div>

        </div>
    );
}