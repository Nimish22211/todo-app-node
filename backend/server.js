// mongodb+srv://nimish:<password>@cluster0.lbta6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const db = mongoose.connection;
const cors = require('cors');

app.use(cors({
    origin: 'http://localhost:3000',
    'Access-Control-Allow-Methods': '*'

}));

app.use(express.json());

mongoose.connect('mongodb+srv://nimish:nimish@cluster0.lbta6.mongodb.net/data?retryWrites=true&w=majority')
db.once('open', () => console.log('connected to database'))

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    photo: String,
    todos: Array
})

const users = mongoose.model('users', userSchema)


async function createUser(name, email, photoURL, todos) {
    const userExits = await users.exists({ email })
    console.log(userExits, 'user')

    if (userExits) {
        console.log(userExits)
        const user = await users.findOne({ email })
        return user
    } else {
        console.log('user created')

        const addUser = await users.create({
            name,
            email,
            photo: photoURL,
            todos,
        })
        return addUser
    }
}

app.post('/adduser', (req, res) => {
    const { name, email, photoURL, todos } = req.body;
    createUser(name, email, photoURL, todos).then(user => res.send(user))
})

const addTodo = async (title, description, completed, email, id) => {
    const user = await users.findOne({ email: email })
    user.todos.push({ title, description, completed, id })
    user.save()
    return user
}

app.post('/addtodo', (req, res) => {
    const { title, description, completed, email, id } = req.body;
    addTodo(title, description, completed, email, id).then(todo => res.send(todo))
})

app.get('/:email/todo', (req, res) => {
    const { id } = req.query
    const { email } = req.params
    getTodo(email, id).then(todo => res.send(todo))
})

const getTodo = async (email, todoId) => {
    email = email.concat('@gmail.com')
    const user = await users.findOne({ email })
    const todo = await user.todos.find(todo => todo.id === todoId)
    return todo
}

app.patch('/deletetodo', (req, res) => {
    const { email, id } = req.body
    deleteTodo(email, id).then(user => res.send(user))
})

const deleteTodo = async (email, todoId) => {
    const user = await users.findOne({ email })
    // user.todos.filter(todo => todo.id !== todoId)
    user.todos = user.todos.filter(todo => todo.id !== todoId)
    user.save()
    return user
    // delete todo

}



app.patch('/update/todo', (req, res) => {
    const { update } = req.query
    const { email, id, title, description, completed } = req.body
    if (update === "status") {
        updateTodoStatus(email, id).then(todo => res.send(todo))
    } else {
        updateTodo(email, id, title, description, completed).then(todo => res.send(todo))
    }
})

const updateTodoStatus = async (email, todoId) => {
    let user = await users.findOne({ email })
    let todos = await user.todos
    let todo = await user.todos.find(todo => todo.id === todoId)
    let index = todos.indexOf(todo);
    let status = user.todos[index].completed;
    let todoUpdate = "";
    if (status === "" || status === "not completed") {
        todoUpdate = "completed"
    } else {
        todoUpdate = "not completed"
    }

    await users.updateOne(
        {
            "todos.id": todoId
        },
        {
            "$set": {
                "todos.$.completed": todoUpdate
            }
        }
    )
    return user.todos[index] = {
        ...todo,
        completed: todoUpdate
    }
}

const updateTodo = async (email, id, title, description, completed) => {
    let user = await users.findOne({ email })
    let todos = user.todos
    let todo = user.todos.find(todo => todo.id === id)
    let index = todos.indexOf(todo);
    let todoUpdate = {
        title,
        description,
        id,
        completed
    }
    await users.updateOne(
        {
            "todos.id": id
        },
        {
            "$set": {
                "todos.$.title": title,
                "todos.$.description": description,
                "todos.$.completed": completed,
                "todos.$.id": id
            }
        }
    )
    return user.todos[index] = {
        ...todoUpdate
    }
}

app.patch('/deleteall', (req, res) => {
    const { email } = req.body
    deleteAllTodos(email).then(user => res.send(user))
})

const deleteAllTodos = async (email) => {
    const user = await users.findOne({ email })
    user.todos = []
    user.save()
    return user
}

app.get('/:emailName/gettodos', (req, res) => {
    const { email } = req.params
    getTodos(email).then(todos => res.send(todos))
})

const getTodos = async () => {
    const user = await users.findOne()
    return user.todos
}

app.get('/', (req, res) => {
    res.send('Hello World!');
})


app.listen(8000, () => console.log('listening on port 8000'));