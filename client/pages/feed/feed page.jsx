import { useEffect, useState } from "react";
import axios from "axios";
import Nav from "../nav/nav";
import FeedTodo from "./components/feed todo";
import "./feed page.css";

export default function FeedPage() {
    const [feedCards, setfeedCards] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchFeed() {
            try {
                setLoading(true);
                const res = await axios.get(
                    `${API_BASE}/api/feed`,
                    { headers: { token: localStorage.getItem("token") } },
                );
                setfeedCards(res.data);
                setError(null);
            } catch (err) {
                console.error("Error fetching feed:", err);
                // Fallback: show demo todos if endpoint doesn't exist
                if (err.response?.status === 404) {
                    setError("Feed endpoint not implemented on backend");
                } else {
                    setError("Failed to load feed");
                }
            } finally {
                setLoading(false);
            }
        }

        fetchFeed();
    }, []);

    function handleLike(todoId, isLiked) {
        // Optimistic update
        setfeedCards((prev) =>
            prev.map((todo) =>
                todo._id === todoId
                    ? {
                          ...todo,
                          likes: isLiked ? todo.likes - 1 : todo.likes + 1,
                          userLiked: !isLiked,
                      }
                    : todo,
            ),
        );

        // TODO: Call backend like/unlike endpoint when available
        // axios.post(`/todo/${todoId}/${isLiked ? 'unlike' : 'like'}`)
    }

    function handleRepost(todoId) {
        // TODO: Implement repost functionality
        console.log("Repost:", todoId);
    }

    function handleComment(todoId) {
        // TODO: Implement comments functionality
        console.log("Comment:", todoId);
    }

    function handleShare(_todoId) {
        // TODO: Implement share functionality
        if (navigator.share) {
            navigator.share({ text: `Check out this todo!` });
        } else {
            navigator.clipboard.writeText(window.location.href);
        }
    }

    if (loading) {
        return (
            <div className="display-flex">
                <Nav />
                <div id="feed-page">
                    <div className="feed-loading">
                        <div className="loading-spinner"></div>
                        <p>Loading feed...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="display-flex">
                <Nav />
                <div id="feed-page">
                    <div className="feed-error">
                        <p>{error}</p>
                        <p className="error-note">Error occured</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="display-flex">
            <Nav />
            <div id="feed-page">
                <div id="feed-container">
                    <h1 className="feed-title">Feed</h1>
                    <div className="feed-list">
                        {feedCards.map((currItem) => {
                            return (
                                <FeedTodo
                                    key={currItem[0].id + currItem[0].date}
                                    cardInfo={currItem[0]}
                                    date={currItem[0].date}
                                    todos={currItem.slice(1)}
                                    tags={currItem[0].tags}
                                    onLike={handleLike}
                                    onRepost={handleRepost}
                                    onComment={handleComment}
                                    onShare={handleShare}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
