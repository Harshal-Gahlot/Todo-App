import axios from "axios";
import { useState } from "react";

export default function Signup() {
    console.log("in Signup last component");
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function sendSignupReq(event) {
        console.log(name, email, password);
        await axios.post("https://todo-app-be-0kqo.onrender.com/signup", { name, email, password });
    }

    return (
        <form id="signup-container" onSubmit={sendSignupReq}>
            <label htmlFor="user-name-signup">Name: </label>
            <input type="text" id="user-name-signup"
                value={name} onChange={(e) => setName(e.target.value)}
            />
            <label htmlFor="user-email-signup">Email: </label>
            <input type="email" id="user-email-signup"
                value={email} onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="user-password-signup">Password: </label>
            <input type="password" id="user-password-signup"
                value={password} onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Signup</button>
        </form>
    );
}