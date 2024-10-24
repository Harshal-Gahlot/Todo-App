const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const User = new Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true },
    password: String
});

const Todo = new Schema({
    title: { type: String, required: true },
    done: { type: Boolean, required: true },
    userId: { type: ObjectId, required: true }
});

const UserModel = mongoose.model("users", User);
const TodoModel = mongoose.model("todos", Todo);

module.exports = {
    UserModel: UserModel,
    TodoModel: TodoModel
};