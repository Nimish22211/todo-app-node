import React, { useState } from 'react';
import './Header.css';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { useEffect } from 'react';

function Header({ loggedUser, setLoggedUser, setTodos }) {
    const user = loggedUser;
    const [drop, setDrop] = useState(false)
    let history = useNavigate();
    // console.log(user)
    useEffect(() => {
        onAuthStateChanged(auth, user => {
            if (user !== null) {
                setLoggedUser(user)
                addUser(user)
                let emailName = user.email.split('@')[0]
                history(`/${emailName}`);
            } else {
                history('/login')
            }
        })
    }, [])
    const addUser = (user) => {
        fetch('http://localhost:8000/adduser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: user.displayName,
                email: user.email,
                photo: user.photoURL,
                todos: []
            })
        }).then(res => res.json()).then(data => setTodos(data.todos.reverse()))
    }

    const handleSignOut = () => {
        setDrop(false)
        setLoggedUser(null)
        signOut(auth);
        history('/login');
    }
    const dropdown = () => {
        setDrop(prev => !prev)
    }

    // console.log(drop)
    return (
        <header>
            <h1>TodoList</h1>
            {user !== null && <div>
                <img src={user !== null && user.providerData[0].photoURL} className="user-photo" alt="user pic"
                    onClick={dropdown} />
                <div className={drop === true ? 'dropdown' : 'dropdown hidden'}>
                    {user && <button className="Signout" onClick={handleSignOut}>Sign Out</button>}
                </div>
            </div>}

        </header>
    );
}

export default Header;
