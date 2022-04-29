import './App.css';
import Login from './components/Login';
import Header from './components/Header';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Todo from './components/Todo';

function App() {
  const [loggedUser, setLoggedUser] = useState(null);
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [desc, setDesc] = useState('');
  const emailName = loggedUser && loggedUser.email.split('@')[0];
  // const history = useNavigate();

  useEffect(() => {
    console.clear()

    console.log(todos)
  }, [todos])
  const addTodo = (e) => {
    e.preventDefault();
    fetch('http://localhost:8000/addtodo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
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
                {todos.map(todo => <div className="todobox" >
                  <Link to={loggedUser && `/${emailName}/todo?id=${todo.id}&edit=false`}>
                    <p>{todo.title}</p>
                  </Link>
                  <div className="icons">
                    {/* <span onClick={ }>EDIT</span> */}
                    <Link to={loggedUser && `/${emailName}/todo?id=${todo.id}&edit=true`}> <span>EDIT</span></Link>

                    <span>DEL</span>
                  </div>
                </div>)}
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
