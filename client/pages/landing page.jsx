import { useContext, useState } from "react";
import Signup from "./signup";
import Signin from "./signin";
import { TodoContext } from "../components/context api";

export default function LandingPage() {
    const { authMethod, setAuthMethod } = useContext(TodoContext);

    const taglines = ["Share your plans, stay inspired.",
        "Stay on track, connect, and get things done together.",
        "See what’s next on your list—and theirs."];

    return (
        <div id="landing-page-container">
            <section id="landing-page-left">
                <h1>What'cha doin' ?</h1>
                <p>{taglines[0]}</p>
                <span>developed by - Harshal G.</span>
            </section>

            <section id="landing-page-right">

                <button className="landing-page-auth-btn"
                    onClick={() => setAuthMethod("signup")}>Sign up</button>
                {authMethod === "signup" && <Signup />}

                <button className="landing-page-auth-btn"
                    onClick={() => setAuthMethod("signin")}>Sign in</button>
                {authMethod === "signin" && <Signin />}

            </section>
        </div>
    );
}