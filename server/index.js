const express = require("express");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { auth, JWT_SECRET } = require("./auth");
const mongoose = require("mongoose");
const { UserModel, TodoModel } = require("./DB");
const bcrypt = require("bcrypt");
const { z } = require("zod");
const cors = require("cors");

mongoose.connect(process.env.MONGODB_URL);

const app = express();
app.use(express.json());
app.use(cors());

app.post("/signup", async (req, res) => {
    const bodySchema = z.object({
        email: z.string().email().max(100),
        name: z.string().min(3).max(100),
        password: z.string().min(8).max(100)
    });

    console.log("\n\n\n", req.body);

    const { success, data, error } = bodySchema.safeParse(req.body);

    console.log(success, data, error);
    if (!success) {
        res.json({
            ErrorMessage: error.issues[0].message
        });
        return;
    }

    try {
        const hashPassword = await bcrypt.hash(data.password, 5);

        const userData = {
            email: data.email,
            name: data.name,
            password: hashPassword,
        };
        await UserModel.create(userData);

        res.send("YOU ARE SIGN UP");

    } catch (e) {
        if (e.code === 11000) {
            console.error("DUPLICATE ENTRY ERROR\n\n" + e);
            res.send("USER ALREADY EXIST WITH THIS EMAIL");
        } else {
            console.error(e);
            res.send("You got error");
        }
    }
});

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
});

app.post("/todo", auth, async (req, res) => {
    const todo = {
        title: req.body.title,
        done: false,
        userId: req.userId
    };
    console.log(todo); // userID indeed show up in console ex - userID: '6719e251ba8bdda1c7fd3129' 
    await TodoModel.create(todo);
    res.send("TO-DO Created Successfully!");
});

app.get("/todos", auth, async (req, res) => {
    const userId = req.userId;
    console.log("userID in /todos:", userId);

    const todos = await TodoModel.find({ userId: userId });

    res.json({ todos });
});

console.log("Server Started...");
app.listen(3000);
