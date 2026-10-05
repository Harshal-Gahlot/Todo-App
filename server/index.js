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
console.log("importing UTApi...");
const { UTApi } = require("uploadthing/server");

console.log("all libs imported");

mongoose.connect(process.env.MONGODB_URL);
const PORT = process.env.PORT;
const UPLOADTHING_TOKEN = process.env.UPLOADTHING_TOKEN;

const app = express();
app.use(express.json());
app.use(cors());

console.log("connedted to DB and const init");

app.post("/signup", async (req, res) => {
    console.log("signup req came");
    const bodySchema = z.object({
        name: z
            .string()
            .min(3, { message: "Name must contain at least 3 characters" })
            .max(100, { message: "Name can contain at most 100 characters" }),

        email: z
            .string()
            .email()
            .toLowerCase()
            .max(100, { message: "Email must contain at most 100 characters" }),

        password: z
            .string()
            .min(6, { message: "Password must contain at least 6 characters" })
            .max(100, {
                message: "Password can contain at most 100 characters",
            }),
    });

    const { success, data, error } = bodySchema.safeParse(req.body);

    console.log(success, data, error);
    if (!success) {
        res.status(200).json({
            ErrorMessage: error.issues[0].message,
        });
        return;
    }

    const user = await UserModel.findOne({ name: data.name });
    console.log(user);
    if (user) {
        res.status(200).json({
            ErrorMessage: "Name taken",
        });
        return;
    }

    try {
        const hashPassword = await bcrypt.hash(data.password, 5);

        const userData = {
            name: data.name,
            email: data.email,
            password: hashPassword,
        };
        const userCreated = await UserModel.create(userData);
        console.log("sign up successful", userCreated);
        res.status(200).json({
            ErrorMessage: "none",
        });
    } catch (e) {
        if (e.code === 11000) {
            console.error("DUPLICATE ENTRY ERROR\n\n" + e);
            res.status(409).json({
                ErrorMessage: "USER ALREADY EXIST WITH THIS EMAIL",
            });
        } else {
            console.error(e);
            res.status(500).json({
                ErrorMessage: `You got an error bro: ${e}`,
            });
        }
    }
});

app.post("/signin", async (req, res) => {
    console.log("signin req came");
    const bodySchema = z.object({
        email: z
            .string()
            .email()
            .toLowerCase()
            .max(100, { message: "Email must contain at most 100 characters" }),

        password: z
            .string()
            .min(6, { message: "Password must contain at least 6 characters" })
            .max(100, {
                message: "Password can contain at most 100 characters",
            }),
    });

    const { success, data, error } = bodySchema.safeParse(req.body);
    console.log("success, data, error", success, data, error);

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
        res.status(200).json({
            ErrorMessage: "User doesn't exist! Sign up insted?",
        });
        return;
    }

    const userMached = await bcrypt.compare(password, response.password);

    if (!userMached) {
        console.log("Incorrect email or password");
        res.status(200).json({
            ErrorMessage: "Incorrect email or password.",
        });
        return;
    }

    console.log("Making token");
    const token = jwt.sign({ id: response._id.toString() }, JWT_SECRET);
    console.log("sign in successful");
    res.status(200).json({ token, username: response.name });
});

app.patch("/profile", auth, async (req, res) => {
    console.log("profile post req came with data", req.body);

    const userProfile = await UserModel.findById(req.userId);
    console.log("before updating userProfile", userProfile);

    Object.assign(userProfile.userData, req.body);
    console.log("after updating userProfile", userProfile);

    const data = await UserModel.updateOne({ _id: req.userId }, userProfile);
    res.status(200).json({ "Updated successfully with data:": data });
});

app.get("/userNameSearch/:searchTerm", async (req, res) => {
    try {
        const searchTerm = req.params.searchTerm;
        console.log("searchTerm", searchTerm);
        const matchingUsers = await UserModel.find({
            name: { $regex: searchTerm, $options: "i" },
        }).select("name following followers userData");
        res.status(200).json({ matchingUsers });
    } catch (e) {
        console.log("Error while searching users with name pattern:", e);
        res.status(400).json({
            "Error while searching users with name pattern": e,
        });
    }
});

app.post("/todo", auth, async (req, res) => {
    console.log("create a todo post req came with data", req.body);

    const bodySchema = z.object({
        title: z.string().min(1),
        category: z.enum(["private", "public"]).optional().default("public"),
    });

    const { success, data, error } = bodySchema.safeParse(req.body);
    console.log("success, data, error", success, data, error);

    if (!success) {
        console.log("we got error while validating the todo", error);
        res.status(400).json({ ErrorMessage: error.issues[0].message });
    }

    const todo = {
        title: data.title,
        done: false,
        userId: req.userId,
        category: data.category,
    };
    const response = await TodoModel.create(todo);
    console.log(response);
    res.status(201).json(response);
});

app.patch("/todo/:id", auth, async (req, res) => {
    const todoId = req.params.id;
    console.log("\nPATCH req came with todo id:", todoId);
    todoId == "undefined" &&
        res
            .status(404)
            .json({ message: "the patch todo's ID was not provided" });

    const toUpdateTodo = await TodoModel.findById(todoId);
    console.log("before updating toUpdateTodo", toUpdateTodo);
    // todo id donesn't exist catch ?
    Object.assign(toUpdateTodo, req.body);
    console.log("after updating toUpdateTodo", toUpdateTodo);

    const data = await TodoModel.updateOne({ _id: todoId }, toUpdateTodo);
    res.status(200).json({ "Updated successfully with data:": data });
});

app.delete("/todo/:id", auth, async (req, res) => {
    console.log("delete req came");
    const id = req.params.id;
    console.log("delete todo req came with id", id);
    if (id === "undefined" || !id) {
        return res.status(404).json({
            message: "The ID of todo which is to be deleted isen't provided",
        });
    }
    const todoToDelete = await TodoModel.findByIdAndDelete({ _id: id });
    res.status(200).send(`todo deleted successfully! ${todoToDelete}`);
});

// New soft delete endpoint: updates category to "bin" and date to now
app.patch("/todo/:id/delete", auth, async (req, res) => {
    const id = req.params.id;
    console.log("soft delete todo req came with id", id);
    if (id === "undefined" || !id) {
        return res.status(404).json({
            message: "The ID of todo which is to be deleted isen't provided",
        });
    }
    const updatedTodo = await TodoModel.findOneAndUpdate(
        { _id: id, userId: req.userId },
        { category: "bin", date: new Date() },
        { new: true }
    );
    if (!updatedTodo) {
        return res.status(404).json({ message: "Todo not found" });
    }
    res.status(200).json({ message: "Todo moved to bin successfully", todo: updatedTodo });
});

// Empty bin endpoint: permanently delete all todos with category "bin" for user
app.delete("/todos/bin", auth, async (req, res) => {
    console.log("empty bin req came for userId:", req.userId);
    const result = await TodoModel.deleteMany({ userId: req.userId, category: "bin" });
    res.status(200).json({ message: "Bin emptied successfully", deletedCount: result.deletedCount });
});

app.get("/todos/:category", auth, async (req, res) => {
    console.log("show todos get req came with params:", req.params);
    const userId = req.userId;
    console.log("userId:", userId);
    const category = req.params.category.toLowerCase(); // "public" "private" "bin" "all"

    let findQuery = { userId: userId };
    if (!category || category === "all") {
        findQuery.category = { $ne: "bin" };
    } else {
        findQuery.category = category;
    }

    //TODO: make the fetching todos as streaming, i.e. there will a be btn on FE
    //"Load more todos"/when user reaches end of todo and it will fetch next 25 todos. 
    const todos = await TodoModel.find(findQuery).sort({ date: -1 }).limit(25);

    res.json({ todos });
});

app.get("/profile/:userName", async (req, res) => {
    const userName = req.params.userName;
    console.log("\n\nget user req came with name:", userName);
    const data = await UserModel.find({ name: userName });

    // console.log('data', data);
    if (data.length === 0) {
        console.log("user profile not found");
        res.status(404).json({ ErrorMessage: "User not found" });
        return;
    }

    let editable = false;
    try {
        const token = req.headers.token;
        console.log("token", token);
        const decodedData = jwt.verify(token, JWT_SECRET);
        console.log("decodedData", decodedData);
        if (decodedData) {
            if (decodedData.id === String(data[0]._id)) editable = true;
        }
    } catch (error) {
        console.log("Profiler viewer can't edit it", error);
    }

    const userData = {
        links: data[0].userData.links,
        bio: data[0].userData.bio,
        pfp: data[0].userData.pfp,
        date: data[0].date,
        followers: data[0].followers,
        following: data[0].following,
        name: data[0].name,
    };

    console.log(userData);
    console.log("editable", editable);
    res.status(200).json({ userData, editable });
});

// Endpoint to fetch uploaded images
app.get("/api/uploaded-images", async (req, res) => {
    try {
        const apiKey = UPLOADTHING_TOKEN;
        const utapi = new UTApi({ apiKey });

        const response = await utapi.listFiles();
        console.log("response", response);
        res.status(200).json(response.files);
    } catch (error) {
        console.error("Error fetching uploaded images:", error);
        res.status(500).json({ error: "Failed to fetch uploaded images" });
    }
});

app.patch("/api/follow/:followerName", auth, async (req, res) => {
    const followerName = req.params.followerName;
    console.log("follow req came with userName", followerName);

    const userId = req.userId;
    console.log("userId", userId);

    const user = await UserModel.findOne({ name: followerName });
    if (!user) {
        console.log("User not found");
        res.status(204).send("User not found");
        return;
    } else if (user._id.toString() === userId) {
        console.log("You can't follow yourself");
        res.status(200).send("You can't follow yourself");
        return;
    } else if (user.followers.includes(userId)) {
        console.log("Unfollowing user");
        await UserModel.updateOne(
            { name: followerName },
            { $pull: { followers: userId } },
        );
        res.status(200).send("unfollowed");
        return;
    } else {
        console.log("Following user");
        await UserModel.updateOne(
            { name: followerName },
            { $push: { followers: userId } },
        );
        res.status(200).send("followed");
    }
});

app.get("/api/feed", async (req, res) => {
    // leaving my comments here as my rough work, like a student.
    // POV: when you don't use AI at all to make the algo or write code.
    try {
        const todos = await TodoModel.find({
            category: "public",
        })
            .sort({ date: -1 })
            .limit(50)
            .lean();

        // usersInfo: {
        //     {userId1: user1info}
        //     {userId2: user2info}
        //     {userId3: user3info}
        // }
        // feedContent: {
        // date1: [
        //      {
        //          user1: [
        //              todo1,
        //              todo2,
        //              todo3
        //          ],
        //          user3: [
        //              todo1,
        //              todo2
        //          ]
        //      }
        // ],
        //     date2: [
        //          {
        //              user1: [todo1, todo3],
        //              user2: [todo1, todo2, todo3],
        //              user3: [todo2, todo3]
        //          }
        //     ],
        //     date3: [
        //          {
        //              user1: [todo1, todo2, todo3],
        //              user2: [todo1, todo2, todo3, todo4]
        //          }
        //     ]
        // }
        const usersInfo = {};
        const feedContent = {};

        for (const todo of todos) {
            const date = `${todo.date.getDate() + todo.date.getMonth() * 31 + 366 * todo.date.getFullYear()}`;
            const userId = String(todo.userId);
            if (!Object.keys(feedContent).includes(date)) {
                feedContent[date] = [];
            }

            if (!Object.keys(usersInfo).includes(userId)) {
                const user = await UserModel.findById(userId);
                usersInfo[userId] = {
                    pfp: user.userData.pfp,
                    name: user.name,
                    id: user._id,
                };
            }
            todoData = {
                title: todo.title,
                done: todo.done,
                isPinned: todo.isPinned,
            };

            // console.log(feedContent[date])
            // console.log("feedContent[date][0]", feedContent[date][0]);
            let userSingleDateTodos;
            if (feedContent[date]) {
                userSingleDateTodos = feedContent[date][userId];
            }
            // console.log("usersSingleDateTodos before:", usersSingleDateTodos);
            if (!userSingleDateTodos) {
                // console.count();
                const userInfo = { ...usersInfo[userId] };
                userInfo["date"] = todo.date;
                userInfo["tags"] = [];
                userSingleDateTodos = [userInfo];
            }
            userSingleDateTodos[0]["tags"].push(...todo.tags);
            // using splice and inserting ele at pos 1 instead of .push as, i want
            // the first todo that was made that day to appear first in list and
            // last as last i.e. maintain the creation oreder of that day instead
            // of desc order which show latest first and older last.
            userSingleDateTodos.splice(1, 0, todoData);
            // console.log("usersSingleDateTodos after:", usersSingleDateTodos);
            // console.dir(usersSingleDateTodos, { depth: null });
            feedContent[date][userId] = userSingleDateTodos;
            // console.dir(feedContent, {depth: 5});
        }

        // console.dir(feedContent, { depth: null });
        const feedCards = [];
        const dateArr = Object.keys(feedContent);
        for (const userPostedThatDateKey of dateArr.sort((a, b) => b - a)) {
            // console.log(userPostedThatDateKey);
            for (const userPostedThatDateValue of Object.values(
                feedContent[userPostedThatDateKey],
            )) {
                // for (const userTodos of Object.values(
                //     userPostedThatDateValue,
                // )) {
                // console.log(userTodos);
                feedCards.push(userPostedThatDateValue);
                // }
            }
        }

        res.status(200).json(feedCards);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch feed" });
    }
});

console.timeEnd("Server Started...");

app.listen(PORT, () => console.log("app started on port", PORT));
