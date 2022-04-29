import React, { useEffect } from 'react';
import './Login.css'
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signInWithPopup } from 'firebase/auth'
import { auth, provider } from '../firebase'

function Login({ setLoggedUser }) {
    // const [user, setUser] = useState(null)
    let history = useNavigate();
    useEffect(() => {
        onAuthStateChanged(auth, user => {
            if (user !== null) {
                let emailName = user.email.split('@')[0]
                history(`/${emailName}`);
            }
        })
    }, [])
    useEffect(() => {
        onAuthStateChanged(auth, user => {
            if (user) {
                setLoggedUser(user)
            }
        })
    }, [setLoggedUser])


    const login = () => {
        signInWithPopup(auth, provider)
    }
    return (
        <div className="login">
            <div className="login-form">
                <h1>Login in to continue</h1>
                <button onClick={login}>Continue with Google</button>
            </div>
        </div>
    );
}

export default Login;
