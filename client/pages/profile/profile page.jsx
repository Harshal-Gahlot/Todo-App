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
                const res = await axios.get(
                    `https://todo-app-be-0kqo.onrender.com/profile/${params.username}`,
                    // `http://localhost:3000/profile/${params.username}`,
                    { headers: { token: localStorage.getItem("token") } }
                );
                console.log(res);
                const { userData, editable } = res.data;

                console.log('Fetched data:', res.data);
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
    }, []);

    function handleEditProfile() {
        console.log("edit profile clicked");
    }

    function addFollower() {
        console.log(userData);
        try {
            axios.patch(
                `https://todo-app-be-0kqo.onrender.com/api/follow/${userData.name}`,
                // `http://localhost:3000/api/follow/${userData.name}`,
                {}, {
                headers: {
                    token: localStorage.getItem("token"),
                },
            });
        } catch (error) {
            console.log("error while adding follower:", error);
        }
        console.log("add follower clicked");
    }

    if (userData == {}) {
        console.log("user data is nulll");
        return <h1>Loading...</h1>;
    } else if (error) {
        console.log("error:", error);
        return <div className="svg-404-container">
            <img src="https://oa0lm57er1.ufs.sh/f/r21DzdYiBXrs8Sb3SaRqKH5fXG0x9U8Q62S3Y1kvWLpcJ7NC" className="svg-404" alt="404" />
        </div>;
    } else {
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
                                {userData?.following?.length}
                                <p>following</p>
                            </button>
                            <span className="view-follow">•</span>
                            <button className="view-follow view-followers">
                                <Users className="follow-icons" />
                                {userData?.followers?.length}
                                <p>followers</p>
                            </button>
                        </div>
                        <button className={`edit-or-follow-btn ${!editable && "follow-btn"}`}
                            onClick={editable ? handleEditProfile : addFollower}>
                            {editable ? "Edit Profile" : "Follow"}
                            {/* #TODO: follow/unfloow UI */}
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
    }
};