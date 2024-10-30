import axios from "axios";
import { useContext, useState } from "react";
import { TodoContext } from "../components/context api";

export default function Signin() {
    console.log("in Signin last component");
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setAuthMethod } = useContext(TodoContext);

    async function sendSigninReq(event) {
        console.log(email, password);
        const responce = await axios.post("https://todo-app-be-0kqo.onrender.com/signin", { email, password });
        console.log(responce);
        const token = responce.data.token;
        localStorage.setItem("token", token);
    }

    return (
        <div className="auth-form-bg" onClick={() => setAuthMethod(null)}>
            <form id="signin-container" className="auth-form-container" onClick={(event) => event.stopPropagation()} onSubmit={sendSigninReq}>
                <label htmlFor="user-email-signin" className="auth-label" >Email</label>
                <input type="email" id="user-email-signin" className="auth-input"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor="user-password-signin" className="auth-label" >Password</label>
                <input type="password" id="user-password-signin" className="auth-input"
                    value={password} onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit" className="auth-form-submit-btn">Sign in</button>
            </form>
        </div>
    );
}