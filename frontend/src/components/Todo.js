import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import './Todo.css'

function Todo({ emailName }) {
    const [search] = useSearchParams();
    const [todo, setTodo] = useState({})
    const history = useNavigate();
    const [modal, setModal] = useState(false)
    const [title, setTitle] = useState()
    const [description, setDescription] = useState()
    useEffect(() => {
        let id = search.get('id')
        let edit = search.get('edit')
        //`http://localhost:8000/${emailName}/${id}`
        fetch(`http://localhost:8000/${emailName}/todo?id=${id}&edit=${edit}`).then(res => res.json()).then(data => (() => {
            setTodo(data)
            setTitle(data.title)
            setDescription(data.description)
        })())
        if (edit === "false") {
            console.log('false')
            setModal(false)
        } else {
            console.log('true')
            setModal(true)
        }

    }, [])
    return (
        <div className="todo-main">

            <button onClick={() => history(-1)}>Back</button>
            {modal === false ? <>
                <div className="center-info">
                    <main className="todo-info">
                        <h1>{todo.title}</h1>
                        <p className="todo-desc">{todo.description === "" ? "no description" : todo.description}</p>
                    </main>
                </div>
                <button onClick={() => setModal(true)}>Edit</button>
            </> : <>
                <div className="modal">
                    <div className="modal-content inputs">
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="change title" />
                        <input type="text" value={description} placeholder="change description" onChange={e => setDescription(e.target.value)} />

                    </div>
                    <button> Save</button>
                </div>
                <button onClick={() => setModal(false)}>Cancel</button>
            </>
            }

        </div>
    )
}

export default Todo