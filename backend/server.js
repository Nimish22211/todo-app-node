// mongodb+srv://nimish:<password>@cluster0.lbta6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const db = mongoose.connection;
const cors = require('cors');

app.use(cors({
    origin: 'http://localhost:3000',
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
    // console.log(req.body);
    const { name, email, photoURL, todos } = req.body;
    createUser(name, email, photoURL, todos).then(user => res.send(user))
})

const addTodo = async (title, description, completed, email, id) => {
    const user = await users.findOne({ email: email })
    user.todos.push({ title, description, completed, id })
    user.save()
    console.log('add')
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

// https://localhost:8000/xyzEmail/todo?id=1234

const getTodo = async (email, todoId) => {
    email = email.concat('@gmail.com')
    const user = await users.findOne({ email })
    const todo = await user.todos.find(todo => todo.id === todoId)
    return todo
}

app.get('/', (req, res) => {
    res.send('Hello World!');
})


app.listen(8000, () => console.log('listening on port 8000'));