import axios from "axios";
import { Twitter, Linkedin, Link, Github, Gitlab, Youtube, Users, UserRoundPlus } from 'lucide-react';
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import Nav from "../nav/nav";
import "./profile.css";

export default function ProfilePage() {
    const params = useParams();
    const [userData, setUserData] = useState({});
    const [editable, setEditable] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log('profilePage mounted with name::::::::::::::', params.username);
        async function getProfileData() {
            try {
                const res = await axios.get(`http://localhost:3000/profile/${params.username}`,
                    { headers: { token: localStorage.getItem("token") } }
                );
                const { userData, editable } = res.data;
                console.log('Fetch userData:', res.data);
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


    }, []);

    if (userData.followers == null) {
        console.log("user data is nulll");
        return <h1>Loading...</h1>;
    }

    if (error) {
        return <h1>editable: {error}</h1>;
    }

    function handleEditProfile() {
        console.log("edit profile clicked");
    }

    function addFollower() {
        console.log("add follower clicked");
    }

    return (
        <div className="display-flex">
            <Nav />
            <div id="profile-container" >
                <div className="left">
                    <div className="pfp-container">
                        <img src={`https://utfs.io/f/${userData.pfp}`} alt="pfp" className="pfp" />
                    </div>
                    <h1 className="name">{params.username}</h1>
                    <div className="view-follow-container">
                        <button className="view-follow view-following">
                            <UserRoundPlus className="follow-icons" />
                            {console.log('userData:', userData)}
                            {userData.following.length}
                            <p>following</p>
                        </button>
                        <span className="view-follow">•</span>
                        <button className="view-follow view-followers">
                            <Users className="follow-icons" />
                            {userData.followers.length}
                            <p>followers</p>
                        </button>
                    </div>
                    <button className={`edit-or-follow-btn ${!editable && "follow-btn"}`}
                        onClick={editable ? handleEditProfile : addFollower}>
                        {editable ? "Edit Profile" : "Follow"}
                    </button>
                    <ul className="social-media-links">
                        {userData?.links?.site && (
                            <li>
                                <a href={userData.links.site}>
                                    <Link className="social-media-svg" />
                                </a>
                            </li>
                        )}
                        {userData?.links?.X && (
                            <li>
                                <a href={userData.links.X}>
                                    <Twitter className="social-media-svg" />
                                </a>
                            </li>
                        )}
                        {userData?.links?.Lnkedin && (
                            <li>
                                <a href={userData.links.Lnkedin}>
                                    <Linkedin className="social-media-svg" />
                                </a>
                            </li>
                        )}
                        {userData?.links?.github && (
                            <li>
                                <a href={userData.links.github}>
                                    <Github className="social-media-svg" />
                                </a>
                            </li>
                        )}
                        {userData?.links?.gitlab && (
                            <li>
                                <a href={userData.links.gitlab}>
                                    <Gitlab className="social-media-svg" />
                                </a>
                            </li>
                        )}
                        {userData?.links?.YT && (
                            <li>
                                <a href={userData.links.YT}>
                                    <Youtube className="social-media-svg" />
                                </a>
                            </li>
                        )}
                    </ul>
                </div>
                <div className="right">
                    <div className="user-bio">
                        <ReactMarkdown>{userData.bio}</ReactMarkdown>
                    </div>
                </div>
            </div>
        </div>
    );
};