import { Link } from "react-router-dom";
import { Heart, Repeat2, MessageCircle, Share, Square, CheckSquare } from "lucide-react";
import { useState } from "react";

export default function FeedTodo({ todo, onLike, onRepost, onComment, onShare }) {
    const [liked, setLiked] = useState(todo.userLiked || false);
    const [likeCount, setLikeCount] = useState(todo.likes || 0);
    const [repostCount, setRepostCount] = useState(todo.reposts || 0);
    const [commentCount, setCommentCount] = useState(todo.comments || 0);

    function handleLikeClick() {
        const newLiked = !liked;
        setLiked(newLiked);
        setLikeCount(newLiked ? likeCount + 1 : likeCount - 1);
        onLike(todo._id, liked);
    }

    function handleRepostClick() {
        setRepostCount(repostCount + 1);
        onRepost(todo._id);
    }

    function handleCommentClick() {
        setCommentCount(commentCount + 1);
        onComment(todo._id);
    }

    function handleShareClick() {
        onShare(todo._id);
    }

    const formattedDate = new Date(todo.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });

    return (
        <div className="feed-todo-container">
            <div className="feed-todo-header">
                <Link to={`/profile/${todo.userName}`} className="feed-todo-author-link">
                    <img
                        src={`https://utfs.io/f/${todo.userPfp}`}
                        alt={todo.userName}
                        className="feed-todo-pfp"
                    />
                    <div className="feed-todo-author-info">
                        <span className="feed-todo-name">{todo.userName}</span>
                        <span className="feed-todo-dot">·</span>
                        <span className="feed-todo-date">{formattedDate}</span>
                    </div>
                </Link>
            </div>

            <div className="feed-todo-content">
                <div className="feed-todo-title-row">
                    {todo.done ? (
                        <CheckSquare className="feed-todo-check-icon" />
                    ) : (
                        <Square className="feed-todo-check-icon" />
                    )}
                    <span className={`feed-todo-title ${todo.done ? "feed-todo-done" : ""}`}>
                        {todo.title}
                    </span>
                </div>

                {todo.tags && todo.tags.length > 0 && (
                    <ul className="feed-todo-tag-container">
                        {todo.tags.map(([tag, tagColor], index) => (
                            <li
                                key={index}
                                className="feed-todo-tag"
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

            <div className="feed-todo-actions">
                <button
                    className={`feed-action-btn ${liked ? "feed-action-btn-liked" : ""}`}
                    onClick={handleLikeClick}
                    aria-label={liked ? "Unlike" : "Like"}
                >
                    <Heart
                        className={`feed-action-icon ${liked ? "feed-action-icon-liked" : ""}`}
                        fill={liked ? "currentColor" : "none"}
                    />
                    {likeCount > 0 && <span className="feed-action-count">{likeCount}</span>}
                </button>

                <button
                    className="feed-action-btn"
                    onClick={handleRepostClick}
                    aria-label="Repost"
                >
                    <Repeat2 className="feed-action-icon" />
                    {repostCount > 0 && <span className="feed-action-count">{repostCount}</span>}
                </button>

                <button
                    className="feed-action-btn"
                    onClick={handleCommentClick}
                    aria-label="Comment"
                >
                    <MessageCircle className="feed-action-icon" />
                    {commentCount > 0 && <span className="feed-action-count">{commentCount}</span>}
                </button>

                <button
                    className="feed-action-btn"
                    onClick={handleShareClick}
                    aria-label="Share"
                >
                    <Share className="feed-action-icon" />
                </button>
            </div>
        </div>
    );
}
