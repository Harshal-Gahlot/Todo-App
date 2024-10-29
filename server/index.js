console.time("Server Started...");

console.log("importing express...");
const express = require("express"); // 2nd time consuing
console.log("importing dotenc...");
require("dotenv").config();
console.log("importing JWT...");
const jwt = require("jsonwebtoken");
console.log("importing JWT_SECRET...");
const { auth, JWT_SECRET } = require("./auth");
console.time("importing mongoose...");
const mongoose = require("mongoose"); // most time consuming
console.timeEnd("importing mongoose...");
console.log("importing required Model...");
const { UserModel, TodoModel } = require("./DB");
console.log("importing bcrypt...");
const bcrypt = require("bcrypt"); // milding time consuming
console.log("importing zod...");
const { z } = require("zod");
console.log("importing cors...");
const cors = require("cors");

console.log("libs imported");
mongoose.connect(process.env.MONGODB_URL);
const PORT = process.env.PORT;

const app = express();
app.use(express.json());
app.use(cors());

console.log("connedted to DB and const init");

app.post("/signup", async (req, res) => {
    console.log("signup req came");
    const bodySchema = z.object({
        email: z.string().email().max(100),
        name: z.string().min(3).max(100),
        password: z.string().min(8).max(100)
    });

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
            res.send(`You got error harshal: ${e}`);
        }
    }
});

app.post("/signin", async (req, res) => {
    console.log("signin req came");
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
    console.log("create a todo post req came");
    const todo = {
        title: req.body.title,
        done: false,
        userId: req.userId
    };
    console.log(todo);
    const response = await TodoModel.create(todo);
    res.json(response);
});

app.patch("/todo/:id", auth, async (req, res) => {
    const todoId = req.params.id;
    console.log("\nPATCH req came with id:", todoId);

    const toUpdateTodo = await TodoModel.findById(todoId);
    console.log('before updating toUpdateTodo', toUpdateTodo);
    // Don't exist catch
    Object.assign(toUpdateTodo, req.body);
    console.log('after updating toUpdateTodo', toUpdateTodo);

    await TodoModel.updateOne({ _id: todoId }, toUpdateTodo);
    res.send("Updated successfully");
});

app.delete("/todo/:id", auth, async (req, res) => {
    console.log('delete req came');
    const id = req.params.id;
    console.log('delete todo req came with id', id);
    const todoToDelete = await TodoModel.findByIdAndDelete({ _id: id });
    res.status(200).send(`todo deleted successfully! ${todoToDelete}`);
});

app.get("/todos", auth, async (req, res) => {
    console.log('show all todos get req came');
    const userId = req.userId;
    console.log("userId:", userId);

    const todos = await TodoModel.find({ userId: userId });

    res.json({ todos });
});

console.timeEnd("Server Started...");

app.listen(PORT, () => console.log("app started!"));
