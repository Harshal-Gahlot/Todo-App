import axios from "axios";
import { useContext, useState } from "react";
import { TodoContext } from "../../context api";
import { Loader } from "lucide-react";

export default function Signup() {
    console.log("in Sign up component");
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [reqSendBtnState, setReqSendBtnState] = useState('Sign up')
    const { setAuthMethod } = useContext(TodoContext);
    const loadingAnime = <Loader className="auth-req-loading"/>

    async function sendSignupReq(event) {
        event.preventDefault();
        console.log(name, email, password);
        try {
            setReqSendBtnState(loadingAnime)
            const res = await axios.post(
                "https://todo-app-be-0kqo.onrender.com/signup",
                { name, email, password }
            );
            console.log("res", res);
            if (res.data.ErrorMessage === "none") {
                console.log("Sign up success");
                window.location.reload()
            } else {
                setErrorMessage(res.data.ErrorMessage);
                setReqSendBtnState("Sign up")
            }
        } catch (err) {
            console.log("error while signing up", err);
        }
    }

    return (
        <div className="auth-form-bg" onClick={() => setAuthMethod(null)}>
            <form id="signup-container" className="auth-form-container"
                onClick={(event) => event.stopPropagation()} >
                {/* <label htmlFor="user-name-signup" className="auth-label">Name</label> */}
                <input type="text" className="auth-input" id="user-name-signup" placeholder="Name"
                    value={name} onChange={(e) => setName(e.target.value)}
                />
                {/* <label htmlFor="user-email-signup" className="auth-label">Email</label> */}
                <input type="email" className="auth-input" id="user-email-signup" placeholder="Email"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                />
                {/* <label htmlFor="user-password-signup" className="auth-label">Password</label> */}
                <input type="password" className="auth-input"
                    id="user-password-signup" placeholder="Password"
                    value={password} onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit" className="auth-form-submit-btn" onClick={sendSignupReq}>{reqSendBtnState}</button>
                <div className="ErrorInValidatingAuth">{errorMessage}</div>
            </form>
        </div>
    );
}