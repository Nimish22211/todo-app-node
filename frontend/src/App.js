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
    // fetch('http://localhost:8000/' + emailName + '@gmail.com').then(res => res.json())
    console.log(todos)

  }, [])
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
        completed: '',
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
                  let svgClass = 'svg-inline--fa fa-circle-check'; //default svg class
                  let checkedColor = todo.completed === "" ? 'check ' + svgClass : todo.completed === "completed" ? " check checked " + svgClass : "check notdone " + svgClass;
                  const changeStatus = (index) => {
                    console.log(todo.completed, 'previous val');
                    fetch('http://localhost:8000/update/todo?update=status', {
                      method: 'PATCH',
                      headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Methods': 'PATCH'
                      },
                      body: JSON.stringify({
                        email: emailName + '@gmail.com',
                        id: todo.id
                      })
                    }).then(res => res.json()).then(data => {
                      todo.completed = data.completed
                      let status = data.completed === "" ? "" : data.completed === 'completed' ? "completed" : 'not completed';
                      checkedColor = status === '' ? 'check ' + svgClass : status === "completed" ? 'check checked ' + svgClass : 'check notdone ' + svgClass
                      console.log(data)
                      document.getElementById('checkIcon' + index).removeAttribute('class');
                      const attr = document.createAttribute('class');
                      attr.value = checkedColor
                      document.getElementById('checkIcon' + index).setAttributeNode(attr)
                      if (todo.completed === "completed") {
                        document.getElementById('title').classList.add('todoTitle')
                      } else {
                        document.getElementById('title').classList.remove('todoTitle')
                      }
                    })
                  }


                  return (
                    <div className="todobox" key={index}>
                      <FontAwesomeIcon id={'checkIcon' + index} className={checkedColor} icon={faCircleCheck} onClick={() => { changeStatus(index) }} />

                      <Link to={loggedUser && `/${emailName}/todo?id=${todo.id}&edit=false`}>
                        <p id="title" className={todo.completed === "completed" && 'todoTitle'}>{todo.title}</p>
                        {/* <p>{todo.title}</p> */}
                      </Link>
                      <div className="icons">
                        {/* <span onClick={ }>EDIT</span> */}
                        <Link to={loggedUser && `/${emailName}/todo?id=${todo.id}&edit=true`}> <FontAwesomeIcon icon={faPenToSquare} /></Link>

                        {/* <span onClick={() => deleteTodo(todo.id)}>DEL</span> */}
                        <FontAwesomeIcon className="deleteIcon" icon={faTrash} onClick={() => deleteTodo(todo.id)} />
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
