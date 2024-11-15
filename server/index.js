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
        name: z.string()
            .min(3, { message: "Name must contain at least 3 characters" })
            .max(100, { message: "Name can contain at most 100 characters" }),

        email: z.string().email().toLowerCase
            .max(100, { message: "Email must contain at most 100 characters" }),

        password: z.string()
            .min(6, { message: "Password must contain at least 6 characters" })
            .max(100, { message: "Password can contain at most 100 characters" })
    });

    const { success, data, error } = bodySchema.safeParse(req.body);

    console.log(success, data, error);
    if (!success) {
        res.status(200).json({
            ErrorMessage: error.issues[0].message
        });
        return;
    }

    try {
        const hashPassword = await bcrypt.hash(data.password, 5);

        const userData = {
            name: data.name,
            email: data.email,
            password: hashPassword
        };
        const userCreated = await UserModel.create(userData);
        console.log("sign up successful", userCreated);
        res.status(200).json({
            ErrorMessage: "none"
        });

    } catch (e) {
        if (e.code === 11000) {
            console.error("DUPLICATE ENTRY ERROR\n\n" + e);
            res.status(409).json({
                ErrorMessage: "USER ALREADY EXIST WITH THIS EMAIL"
            });
        } else {
            console.error(e);
            res.status(500).json({
                ErrorMessage: `You got an error bro: ${e}`
            });
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
        console.log("User donesn't exist, Sign up?");
        res.status(404).json({ "message": "User doesn't exist, Sign up?" });
        return;
    }

    const userMached = await bcrypt.compare(password, response.password);

    if (!userMached) {
        console.log("incorrect creds");
        res.status(403).json({
            "message": "Incorrect creds"
        });
    }

    const token = jwt.sign({ id: response._id.toString() }, JWT_SECRET);
    console.log("sign in successful");
    res.status(200).json({ "token": token });
});

app.post("/todo", auth, async (req, res) => {
    console.log("create a todo post req came");

    const bodySchema = z.object({
        title: z.string().min(1).refine((t) => t.trim() !== ""),
        category: z.enum(["private", "public"])
    });

    const { success, data, error } = bodySchema.safeParse(req.data);

    if (!success) {
        console.log('we got error while validating the todo', error);
        res.status(200).json({ErrorMessage: error.issues[0].message})
    }

    const todo = {
        title: req.body.title,
        done: false,
        userId: req.userId,
        category: req.category
    };
    const response = await TodoModel.create(todo);
    console.log(response);
    res.json(response);
});

app.patch("/todo/:id", auth, async (req, res) => {
    const todoId = req.params.id;
    console.log("\nPATCH req came with todo id:", todoId);
    id === 'undefined' && res.status(404).json({ "message": "the patch todo's ID was not provided" });

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
    id === 'undefined' && res.status(404).json({ "message": "the todo to delete ID isen't provided" });
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

app.listen(PORT, () => console.log("app started on port", PORT));
