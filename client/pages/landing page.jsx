import { useState } from "react";
import Signup from "./signup";
import Signin from "./signin";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../src/components/ui/dialog"


export default function LandingPage() {
    const [authMethod, setAuthMethod] = useState(null);

    const taglines = ["Share your plans, stay inspired.",
        "Stay on track, connect, and get things done together.",
        "See what’s next on your list—and theirs."];

    return (
        <div id="landing-page-container">
            <section id="landing-page-left">
                <h1>What'cha doin' ?</h1>
                <p>{taglines[1]}</p>
                <span>developed by - Harshal G.</span>
            </section>

            <section id="landing-page-right">

                {authMethod === null && <button className="landing-page-signup-btn"
                    onClick={() => setAuthMethod("signup")}>Sign up</button>}
                {authMethod === "signup" && <Signup />}

                {authMethod === null && <button className="landing-page-signin-btn"
                    onClick={() => setAuthMethod("signin")}>Sign in</button>}
                {authMethod === "signin" && <Signin />}
                <Dialog>
                    <DialogTrigger>Open</DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Are you absolutely sure?</DialogTitle>
                            <DialogDescription>
                                This action cannot be undone. This will permanently delete your account
                                and remove your data from our servers.
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>

           

            </section>
        </div>
    );
}