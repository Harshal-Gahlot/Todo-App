const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const User = new Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    userData: {
        bio: { type: String, default: "", maxlenght: 220 },
        links: {
            site: { type: String, default: "" },
            X: { type: String, default: "" },
            Lnkedin: { type: String, default: "" },
            github: { type: String, default: "" },
            gitlab: { type: String, default: "" },
            YT: { type: String, default: "" },
            Insta: { type: String, default: "" }
        },
    },
    date: { type: Date, default: Date.now }
});

const Todo = new Schema({
    title: { type: String, required: true },
    done: { type: Boolean, required: true },
    userId: { type: ObjectId, required: true },
    category: { type: String, required: true, default: "public" },
    tags: { type: [[String]], default: [] },
    isPinned: { type: Boolean, default: false },
    date: { type: Date, default: Date.now }
});

const UserModel = mongoose.model("users", User);
const TodoModel = mongoose.model("todos", Todo);

module.exports = {
    UserModel: UserModel,
    TodoModel: TodoModel
};