const express = require("express");
const jwt = require("jsonwebtoken");
const { auth, JWT_SECRET } = require("./auth");
const mongoose = require("mongoose");
const { UserModel, TodoModel } = require("./DB");
const bcrypt = require("bcrypt")

mongoose.connect("mongodb+srv://18oo18oo12:KnNLJWqryJnpOheW@cluster0.qk8pt.mongodb.net/todo-database")

const app = express()
app.use(express.json());

app.post("/signup", async (req, res) => {

    const hashPassword = await bcrypt.hash(req.body.password, 5)

    const userData = {
        email: req.body.email,
        name: req.body.name,
        password: hashPassword,
    }; 
    await UserModel.create(userData)
    res.send("YOU ARE SIGN UP")
})

app.post("/signin", async (req, res) => {
    const { email, password } = req.body;
    const response = await UserModel.findOne({
        email: email,
    });

    if (!response) {
        res.send("User donesn't exist, Sign up?");
        return;
    }

    
    const userMached = await bcrypt.compare(password, response.password);

    if (!userMached) {
        res.status(403).json({
            message : "Incorrect creds"
        });
    }

    const token = jwt.sign({
        id: response._id.toString()
    }, JWT_SECRET);
    res.json({ token });
})

app.post("/todo", auth, async (req, res) => {
    const todo = {
        title: req.body.title,
        done: false,
        userID: req.userId
    };
    await TodoModel.create(todo)
    res.send("TO-DO Created Successfully!")
    // Always Convert the Set to an array before sending the response
    // res.json([... Set<todos>]);  
})

app.get("/todos", auth, async (req, res) => {
    const userID = req.userId
    console.log(userID)
    
    const todos = await TodoModel.find({ userID : userID })

    res.json({ todos })
})

app.listen(3000);


// app.delete("/:id", (req, res) => {
//     todos.forEach( (todo) => {
//         if (todo.id == Number(req.params.id)) {
//             todos.delete(todo)
//         };
//     })
//     res.json({todos});
// })
