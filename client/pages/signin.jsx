import axios from "axios";
import { useContext, useState } from "react";
import { TodoContext } from "../components/context api";

export default function Signin() {
    console.log("in Sign in component");
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [validationErrorMessage, setValidationErrorMessage] = useState("");
    const { setAuthMethod } = useContext(TodoContext);

    async function sendSigninReq(event) {
        event.preventDefault();
        console.log("in sendSiginReq", email, password);
        try {
            const res = await axios.post(
                "https://todo-app-be-0kqo.onrender.com/signin",
                { email, password }
            );
            console.log("res", res);
            if (!res.data.ErrorMessage) {
                localStorage.setItem("token", res.data.token);
            } else {
                setValidationErrorMessage(res.data.ErrorMessage);
            }
            // window.location.reload();
        } catch (e) {
            console.log(`Error occured: ${e}`);
        }
    }

    return (
        <div className="auth-form-bg" onClick={() => setAuthMethod(null)}>
            <form id="signin-container" className="auth-form-container"
                onClick={(event) => event.stopPropagation()}
            >
                {/* <label htmlFor="user-email-signin" className="auth-label" >Email</label> */}
                <input type="email" id="user-email-signin" className="auth-input" placeholder="Email"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                />
                {/* <label htmlFor="user-password-signin" className="auth-label" >Password</label> */}
                <input type="password" id="user-password-signin" className="auth-input" placeholder="Password"
                    value={password} onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit" className="auth-form-submit-btn" onClick={sendSigninReq}>Sign in</button>
                <span className="ErrorInValidatingAuth">{validationErrorMessage}</span>
            </form>
        </div>
    );
}