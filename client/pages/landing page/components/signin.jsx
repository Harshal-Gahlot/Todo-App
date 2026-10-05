import axios from "axios";
import { useContext, useState } from "react";
import { TodoContext } from "../../context api";
import { Loader } from "lucide-react";

export default function Signin() {
    console.log("in Sign in component");
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [validationErrorMessage, setValidationErrorMessage] = useState("");
    const [reqSendBtnState, setReqSendBtnState] = useState('Sign in');
    const { setAuthMethod } = useContext(TodoContext);
    const loadingAnime = <Loader className="auth-req-loading" />;

    async function sendSigninReq(event) {
        event.preventDefault();
        console.log("in sendSiginReq", email, password);
        try {
            setReqSendBtnState(loadingAnime);
            const res = await axios.post(
                "https://todo-app-be-0kqo.onrender.com/signin",
                // "http://localhost:3000/signin",
                { email, password }
            );
            console.log("res", res);
            if (!res.data.ErrorMessage) {
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("firstLogin", true);
                localStorage.setItem("username", res.data.username);
                window.location.reload();
            } else {
                setReqSendBtnState("Sign in");
                setValidationErrorMessage(res.data.ErrorMessage);
            }
        } catch (e) {
            setValidationErrorMessage("Error occured while signing in");
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
                <button type="submit" className="auth-form-submit-btn" onClick={sendSigninReq}>{reqSendBtnState}</button>
                <span className="ErrorInValidatingAuth">{validationErrorMessage}</span>
            </form>
        </div>
    );
}