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

        email: z.string().email().toLowerCase()
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

    const user = await UserModel.findOne({ "name": data.name });
    console.log(user);
    if (user) {
        res.status(200).json({
            ErrorMessage: "Name taken"
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
    const bodySchema = z.object({
        email: z.string().email().toLowerCase()
            .max(100, { message: "Email must contain at most 100 characters" }),

        password: z.string()
            .min(6, { message: "Password must contain at least 6 characters" })
            .max(100, { message: "Password can contain at most 100 characters" })
    });

    const { success, data, error } = bodySchema.safeParse(req.body);
    console.log('success, data, error', success, data, error);

    if (!success) {
        console.log("In !success");
        res.status(200).json({ ErrorMessage: error.issues[0].message });
        return;
    }

    const { email, password } = data;

    const response = await UserModel.findOne({
        email: email,
    });

    if (!response) {
        console.log("User donesn't exist, Sign up?");
        res.status(200).json({ ErrorMessage: "User doesn't exist! Sign up insted?" });
        return;
    }

    const userMached = await bcrypt.compare(password, response.password);

    if (!userMached) {
        console.log("Incorrect email or password");
        res.status(403).json({
            ErrorMessage: "Incorrect email or password."
        });
    }

    console.log("Making token");
    const token = jwt.sign({ id: response._id.toString() }, JWT_SECRET);
    console.log("sign in successful");
    res.status(200).json({ "token": token });
});

app.post("/todo", auth, async (req, res) => {
    console.log("create a todo post req came with data", req.body);

    const bodySchema = z.object({
        title: z.string().min(1),
        category: z.enum(["private", "public"]).optional().default("public")
    });

    const { success, data, error } = bodySchema.safeParse(req.body);
    console.log('success, data, error', success, data, error);

    if (!success) {
        console.log('we got error while validating the todo', error);
        res.status(400).json({ ErrorMessage: error.issues[0].message });
    }

    const todo = {
        title: data.title,
        done: false,
        userId: req.userId,
        category: data.category
    };
    const response = await TodoModel.create(todo);
    console.log(response);
    res.status(201).json(response);
});

app.patch("/todo/:id", auth, async (req, res) => {
    const todoId = req.params.id;
    console.log("\nPATCH req came with todo id:", todoId);
    todoId == 'undefined' && res.status(404).json({ "message": "the patch todo's ID was not provided" });

    const toUpdateTodo = await TodoModel.findById(todoId);
    console.log('before updating toUpdateTodo', toUpdateTodo);
    // Don't exist catch
    Object.assign(toUpdateTodo, req.body);
    console.log('after updating toUpdateTodo', toUpdateTodo);

    const data = await TodoModel.updateOne({ _id: todoId }, toUpdateTodo);
    res.status(200).json({ "Updated successfully with data:": data });
});

app.delete("/todo/:id", auth, async (req, res) => {
    console.log('delete req came');
    const id = req.params.id;
    console.log('delete todo req came with id', id);
    id === 'undefined' && res.status(404).json({ "message": "The ID of todo which is to be deleted isen't provided" });
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

app.get("/profile/:userName", async (req, res) => {
    const userName = req.params.userName;
    console.log('\n\nget user req came with name:', userName);
    const data = await UserModel.find({ name: userName });

    // console.log('data', data);
    if (data.length === 0) {
        res.status(200).json({ ErrorMessage: "User not found" });
        return;
    }

    let editable = false;
    try {
        const token = req.headers.token;
        const decodedData = jwt.verify(token, JWT_SECRET);
        if (decodedData) {
            if (decodedData.id === data._id) editable = true;
        }
    } catch {
        console.log("Profiler viewer can't edit it");
    }

    const userData = {
        "links": data[0].userData.links,
        "bio": data[0].userData.bio,
        "date": data[0].date
    };

    console.log(userData);
    console.log('editable', editable);
    res.status(200).json({ userData, editable });

});

console.timeEnd("Server Started...");

app.listen(PORT, () => console.log("app started on port", PORT));
