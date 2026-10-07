import { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, RotateCcw, ArchiveX, AlertTriangle } from "lucide-react";
import Nav from "../nav/nav";
import "../todos/todos page.css";
import "./bin page.css";
import { API_BASE } from "../../utils/config";

export default function BinPage() {
    const [binTodos, setBinTodos] = useState([]);
    const [loading, setLoading] = useState(true);

    const directDelete = JSON.parse(localStorage.getItem("settings") || "{}").directDelete === true;

    async function fetchBinTodos() {
        try {
            setLoading(true);
            const res = await axios.get(`${API_BASE}/todos/bin`, {
                headers: {
                    token: localStorage.getItem("token"),
                },
            });
            setBinTodos(res.data.todos || []);
        } catch (err) {
            console.error("Error fetching bin todos:", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchBinTodos();
    }, []);

    async function restoreTodo(todoId) {
        const todoToRestore = binTodos.find((t) => t._id === todoId);
        setBinTodos((prev) => prev.filter((t) => t._id !== todoId));

        try {
            await axios.patch(
                `${API_BASE}/todo/${todoId}`,
                { category: "private" },
                {
                    headers: {
                        token: localStorage.getItem("token"),
                    },
                }
            );
        } catch (err) {
            console.error("Error restoring todo:", err);
            setBinTodos((prev) => [...prev, todoToRestore]);
        }
    }

    async function permanentlyDeleteTodo(todoId) {
        const todoToDelete = binTodos.find((t) => t._id === todoId);
        setBinTodos((prev) => prev.filter((t) => t._id !== todoId));

        try {
            await axios.delete(`${API_BASE}/todo/${todoId}`, {
                headers: {
                    token: localStorage.getItem("token"),
                },
            });
        } catch (err) {
            console.error("Error permanently deleting todo:", err);
            setBinTodos((prev) => [...prev, todoToDelete]);
        }
    }

    async function emptyBin() {
        const snapshot = [...binTodos];
        setBinTodos([]);
        try {
            await Promise.all(
                snapshot.map((t) =>
                    axios.delete(`${API_BASE}/todo/${t._id}`, {
                        headers: { token: localStorage.getItem("token") },
                    })
                )
            );
        } catch (err) {
            console.error("Error emptying bin:", err);
            setBinTodos(snapshot);
        }
    }

    const directDeleteInfoCard = (
        <div className="bin-direct-delete-info-card">
            <AlertTriangle className="bin-direct-delete-icon" />
            <div>
                <p className="bin-direct-delete-title">Direct deletion is on</p>
                <p className="bin-direct-delete-desc">
                    Todos you delete from now on will be permanently removed and won't be saved here. You can turn this off in Settings.
                </p>
            </div>
        </div>
    );

    return (
        <div className="display-flex">
            <Nav />
            <div id="bin-page">
                <div id="bin-container">
                    <div className="bin-header">
                        <div className="bin-title">
                            <h1>Bin</h1>
                            <span className="bin-count-badge">
                                {binTodos.length} {binTodos.length === 1 ? "item" : "items"}
                            </span>
                        </div>
                        {binTodos.length > 0 && (
                            <button className="bin-empty-btn btnR" onClick={emptyBin} title="Empty bin">
                                Empty bin
                            </button>
                        )}
                    </div>

                    {loading ? (
                        <div className="feed-loading">
                            <div className="loading-spinner"></div>
                            <p>Loading bin...</p>
                        </div>
                    ) : binTodos.length === 0 ? (
                        directDelete ? (
                            directDeleteInfoCard
                        ) : (
                            <div className="bin-empty-state">
                                <ArchiveX className="bin-empty-icon" />
                                <h3 className="bin-empty-title">Your bin is empty</h3>
                                <p className="bin-empty-desc">
                                    Deleted todos will appear here. You can restore them anytime or permanently remove them.
                                </p>
                            </div>
                        )
                    ) : (
                        <div className="all-todos">
                            {directDelete && directDeleteInfoCard}
                            {binTodos.map((todo) => {
                                const formattedDate = todo.date
                                    ? new Date(todo.date).toLocaleDateString(undefined, {
                                        month: "short",
                                        day: "numeric",
                                    })
                                    : "";

                                return (
                                    <div className="single-todo-container" key={todo._id}>
                                        <div className="todo-title">
                                            <div className="todo-title-text">
                                                <span className="todo-title-label">{todo.title}</span>
                                                {todo.tags && todo.tags.length > 0 && (
                                                    <ul className="todo-tag-container">
                                                        {todo.tags.map(([tag, tagColor], index) => (
                                                            <li
                                                                key={index}
                                                                className="todo-tag"
                                                                style={{
                                                                    backgroundColor: tagColor + "22",
                                                                    borderColor: tagColor + "55",
                                                                    color: tagColor,
                                                                }}
                                                            >
                                                                {tag}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        </div>

                                        {formattedDate && (
                                            <span className="bin-date-badge" title="Deleted date">
                                                {formattedDate}
                                            </span>
                                        )}

                                        <div className="bin-actions">
                                            <button
                                                className="btnR bin-restore-btn"
                                                onClick={() => restoreTodo(todo._id)}
                                                title="Restore to Todos"
                                                aria-label="Restore"
                                            >
                                                <RotateCcw className="nav-icon" />
                                            </button>
                                            <button
                                                className="btnR bin-permanent-delete-btn"
                                                onClick={() => permanentlyDeleteTodo(todo._id)}
                                                title="Delete permanently"
                                                aria-label="Delete permanently"
                                            >
                                                <Trash2 className="nav-icon" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
