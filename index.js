const express = require("express");
const jwt = require("jsonwebtoken");
const { auth, JWT_SECRET } = require("./auth");
const mongoose = require("mongoose");
const { UserModel, TodoModel } = require("./DB");
const bcrypt = require("bcrypt")
const { z } = require("zod")

mongoose.connect("mongodb+srv://18oo18oo12:KnNLJWqryJnpOheW@cluster0.qk8pt.mongodb.net/todo-db")

const app = express()
app.use(express.json());

app.post("/signup", async (req, res) => {
    const bodySchema = z.object({
        email: z.string().email().max(100),
        name: z.string().min(3).max(100),
        password: z.string().min(8).max(100)
    }) 
    
    console.log("\n\n\n", req.body)

    const { success, data, error } = bodySchema.safeParse(req.body) 

    console.log(success,data,error)
    if (!success) {
        res.json({
            ErrorMessage: error.issues[0].message
        })
        return
    }

    try {
        const hashPassword = await bcrypt.hash(data.password, 5)

        const userData = {
            email: data.email,
            name: data.name,
            password: hashPassword,
        };
        await UserModel.create(userData)

        res.send("YOU ARE SIGN UP")

    } catch (e) {
        if (e.code === 11000) {
            console.error("DUPLICATE ENTRY ERROR\n\n" + e)
            res.send("USER ALREADY EXIST WITH THIS EMAIL")
        } else {
            console.error(e)
            res.send("You got error")
        }
    }
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
            message: "Incorrect creds"
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
})

app.get("/todos", auth, async (req, res) => {
    const userID = req.userId
    console.log(userID)

    const todos = await TodoModel.find({ userID: userID })

    res.json({ todos })
})

app.listen(3000);
