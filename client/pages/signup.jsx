import axios from "axios";
import { useContext, useState } from "react";
import { TodoContext } from "../components/context api";

export default function Signup() {
    console.log("in Signup last component");
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { authMethod, setAuthMethod } = useContext(TodoContext);

    async function sendSignupReq(event) {
        console.log(name, email, password);
        await axios.post("https://todo-app-be-0kqo.onrender.com/signup", { name, email, password });
    }

    return (
        <div className="auth-form-bg" onClick={() => setAuthMethod(null)}>
            <form id="signup-container" className="auth-form-container" onClick={(event) => event.stopPropagation()} onSubmit={sendSignupReq}>
                <label htmlFor="user-name-signup" className="auth-label">Name</label>
                <input type="text" className="auth-input" id="user-name-signup"
                    value={name} onChange={(e) => setName(e.target.value)}
                />
                <label htmlFor="user-email-signup" className="auth-label">Email</label>
                <input type="email" className="auth-input" id="user-email-signup"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor="user-password-signup" className="auth-label">Password</label>
                <input type="password" className="auth-input" id="user-password-signup"
                    value={password} onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit" className="auth-form-submit-btn" >Sign up</button>
            </form>
        </div>
    );
}