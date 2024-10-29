import { useState } from "react";
import Signup from "./signup";
import Signin from "./signin";

export default function LandingPage() {
    const [authMethod, setAuthMethod] = useState(null);

    return (
        <div>
            {authMethod === null && <button onClick={() => setAuthMethod("signup")}>Signup</button>}
            {authMethod === "signup" && <Signup />}
            {authMethod === null && <button onClick={() => setAuthMethod("signin")}>Signin</button>}
            {authMethod === "signin" && <Signin />}
        </div>
    );
}