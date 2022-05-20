import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import './Todo.css'

function Todo({ emailName }) {
    const [search] = useSearchParams();
    const [todo, setTodo] = useState({})
    const [modal, setModal] = useState(false)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [checked, setChecked] = useState(undefined)

    useEffect(() => {
        let id = search.get('id')
        let edit = search.get('edit')
        //`http://localhost:8000/${emailName}/${id}`
        fetch(`http://localhost:8000/${emailName}/todo?id=${id}&edit=${edit}`).then(res => res.json()).then(data => (() => {
            setTodo(data)
            setTitle(data.title)
            setDescription(data.description)
            setChecked(data.completed)
        })())
        if (edit === "false") {
            setModal(false)
        } else {
            setModal(true)
        }
    }, [])

    //TODO: completed status of todo is not being linked with the checkbox 

    const checkBox = (e) => {
        e.currentTarget.checked ? setTodo({ ...todo, completed: true }) : setTodo({ ...todo, completed: false })
        setChecked(!checked)
    }
    useEffect(() => {
        let checkbox = document.getElementById('checkbox')
        if (checkbox) {
            document.getElementById('checkbox').checked = checked
        }
    }, [checked])

    const updateTodo = () => {
        let confirm = window.confirm("Are you sure you want to save?")
        if (confirm) {
            fetch('http://localhost:8000/updatetodo/' + todo.id, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Methods': 'PATCH'
                },
                body: JSON.stringify({
                    email: emailName + '@gmail.com',
                    title: title,
                    description: description,
                    completed: checked,
                    id: todo.id
                })
            }).then(res => res.json()).then(data => (() => {
                setTodo(data)
                setTitle(data.title)
                setDescription(data.description)
                setChecked(data.completed)
            })())
        }
    }
    return (
        <div className="todo-main">

            <button onClick={() => window.location.href = 'http://localhost:3000/' + emailName}>Back</button>
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
                        <span className="todo-status">Completed
                            <input type="checkbox" value={checked} id="checkbox" onChange={(e) => checkBox(e)} />
                        </span>
                    </div>
                    <button onClick={updateTodo}> Save</button>
                </div>
                <button onClick={() => setModal(false)}>Cancel</button>
            </>
            }

        </div>
    )
}

export default Todo