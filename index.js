const express = require("express");
const jwt = require("jsonwebtoken");
const { auth, JWT_SECRET } = require("./auth");
const mongoose = require("mongoose");
const { UserModel, TodoModel } = require("./DB");

mongoose.connect("mongodb+srv://18oo18oo12:KnNLJWqryJnpOheW@cluster0.qk8pt.mongodb.net/todo-database")

const app = express()
app.use(express.json());

app.post("/signup", async (req, res) => {
    const userData = {
        email: req.body.email,
        name: req.body.name,
        password: req.body.password,
    }; 
    await UserModel.create(userData)
    res.send("YOU ARE SIGN UP")
})

app.post("/signin", async (req, res) => {
    const { email, password } = req.body;
    const responce = await UserModel.findOne({
        email: email,
        password: password
    });

    if (responce) {
        const token = jwt.sign({
            id : responce._id.toString()
        }, JWT_SECRET);
        res.json({ token });
    } else {
        res.status(403).json({
            message : "Incorrect creds"
        });
    }
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
