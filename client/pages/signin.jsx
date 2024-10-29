import axios from "axios";
import { useState } from "react";

export default function Signin() {
    console.log("in Signin last component");
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function sendSigninReq(event) {
        console.log(email, password);
        const responce = await axios.post("https://todo-app-be-0kqo.onrender.com/signin", { email, password });
        console.log(responce)
        const token = responce.data.token;
        localStorage.setItem("token", token)
    }

    return (
        <form id="signin-container" onSubmit={sendSigninReq}>
            <label htmlFor="user-email-signin">Email:</label>
            <input type="email" id="user-email-signin"
                value={email} onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="user-password-signin">Password:</label>
            <input type="password" id="user-password-signin"
                value={password} onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Signin</button>
        </form>
    );
}