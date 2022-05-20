import './App.css';
import Login from './components/Login';
import Header from './components/Header';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Todo from './components/Todo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPenToSquare, faCircleCheck } from '@fortawesome/free-solid-svg-icons'


function App() {
  const [loggedUser, setLoggedUser] = useState(null);
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [desc, setDesc] = useState('');
  const emailName = loggedUser && loggedUser.email.split('@')[0];
  // const history = useNavigate();

  useEffect(() => {
    console.clear()
    fetch('http://localhost:8000/' + emailName + '@gmail.com').then(res => res.json())
    console.log(todos)

  }, [todos])
  const addTodo = (e) => {
    e.preventDefault();
    fetch('http://localhost:8000/addtodo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: input,
        description: desc,
        completed: false,
        id: uuidv4(),
        email: loggedUser.email
      })
    }).then(res => res.json()).then(data => setTodos(data.todos.reverse()))
    setInput('')
    setDesc('')

  }

  const deleteTodo = (id) => {
    fetch('http://localhost:8000/deletetodo', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Methods': 'PATCH'
      },
      body: JSON.stringify({
        email: loggedUser.email,
        id: id
      })
    }).then(res => res.json()).then(data => setTodos(data.todos.reverse()))
  }

  return (
    <div className="App">
      <Router>
        <Header setLoggedUser={setLoggedUser} loggedUser={loggedUser} setTodos={setTodos} />
        <Routes >
          <Route path="/login" element={<Login setLoggedUser={setLoggedUser} />} />

          <Route path={`/${emailName}`} element={(
            <div className="main">
              {loggedUser ? <form className="form">
                <div className="inputs">
                  <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Todo Title" />
                  <input type="text" value={desc} onChange={e => setDesc(e.target.value)} placeholder='Todo Description' />
                </div>
                <button type="submit" onClick={addTodo}>Add</button>
                {/* set disabled version of submit button */}
              </form> : "Loading"}
              <div className="todos">
                {todos.map((todo, index) => {
                  let status = todo.completed ? 'completed' : 'not completed';
                  const changeStatus = (index) => {
                    fetch('http://localhost:8000/updatetodo/' + todo.id, {
                      method: 'PATCH',
                      headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Methods': 'PATCH'
                      },
                      body: JSON.stringify({
                        email: emailName + '@gmail.com',
                        title: todo.title,
                        description: todo.description,
                        completed: status,
                        id: todo.id
                      })
                    })
                    document.getElementsByClassName('check')[index].classList.toggle('checked')
                  }


                  return (
                    <div className="todobox" >
                      <FontAwesomeIcon className="check" icon={faCircleCheck} onClick={() => { changeStatus(index) }} />

                      <Link to={loggedUser && `/${emailName}/todo?id=${todo.id}&edit=false`}>
                        <p className={status === "completed" && "todoTitle"}>{todo.title}</p>
                      </Link>
                      <div className="icons">
                        {/* <span onClick={ }>EDIT</span> */}
                        <Link to={loggedUser && `/${emailName}/todo?id=${todo.id}&edit=true`}> <FontAwesomeIcon icon={faPenToSquare} /></Link>

                        {/* <span onClick={() => deleteTodo(todo.id)}>DEL</span> */}
                        <FontAwesomeIcon className="deleteIcon" icon={faTrash} onClick={deleteTodo(todo.id)} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )} />
          <Route exact path={`/${emailName}/todo`} element={<Todo emailName={emailName} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
