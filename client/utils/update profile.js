import axios from "axios";
import { API_BASE } from "./config";

export async function updateProfile(updatedData) {
    // let outDatedData;
    // function getUpdatedTodo(todo) {
    //     outDatedData = todo;
    //     console.log("getUpdatedTodo outdated todo:", outDatedData, '\n\n');
    //     return Object.assign(todo, updatedData);
    // }
    // setTodos((prev_todos) => prev_todos.map(
    //     todo => todo._id === todoId ? getUpdatedTodo(todo) : todo
    // ));

    // console.log('\ntodoId:', todoId, '\nupdatedData:', updatedData, '\noutDatedData:', outDatedData);
    try {
        const res = await axios.patch(
            `${API_BASE}/profile`,
            updatedData,
            {
                headers: {
                    "token": localStorage.getItem("token")
                }
            }
        );
        console.log("updated todo successfully, res:", res);
    } catch (err) {
        // setTodos((prev_todos) => prev_todos.map(
        //     todo => todo._id == todoId ? Object.assign(todo, outDatedData) : todo
        // ));
        console.error(`\nThere is an error with updating this: ${updatedData} \n ${err}`);
    }
}