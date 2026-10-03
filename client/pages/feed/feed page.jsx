import { useEffect, useState } from "react";
import axios from "axios";
import Nav from "../nav/nav";
import FeedTodo from "./components/feed todo";
import "./feed page.css";

export default function FeedPage() {
  const [feedTodos, setFeedTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchFeed() {
      try {
        setLoading(true);
        // TODO: Replace with actual feed endpoint when available
        // For now, fetch public todos from all users
        const res = await axios.get(
          "https://todo-app-be-0kqo.onrender.com/feed",
          // "http://localhost:3000/feed",
          { headers: { token: localStorage.getItem("token") } },
        );
        setFeedTodos(res.data.todos || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching feed:", err);
        // Fallback: show demo data if endpoint doesn't exist
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
    setFeedTodos((prev) =>
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
            <p className="error-note">Using demo data for preview</p>
          </div>
          <FeedDemoData
            onLike={handleLike}
            onRepost={handleRepost}
            onComment={handleComment}
            onShare={handleShare}
          />
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
            {feedTodos.length > 0 ? (
              feedTodos.map((todo) => (
                <FeedTodo
                  key={todo._id}
                  todo={todo}
                  onLike={handleLike}
                  onRepost={handleRepost}
                  onComment={handleComment}
                  onShare={handleShare}
                />
              ))
            ) : (
              <div className="feed-empty">
                <p>No public todos yet.</p>
                <p className="empty-hint">
                  Be the first to post a public todo!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Demo data component for when backend endpoint is not available
function FeedDemoData({ onLike, onRepost, onComment, onShare }) {
  const demoTodos = [
    {
      _id: "demo-1",
      title: "Just finished building the feed page for our todo app! 🚀",
      done: false,
      date: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      tags: [
        ["react", "#61dafb"],
        ["coding", "#61dafb"],
        ["feed", "#2dd4bf"],
      ],
      userId: "user-1",
      userName: "harshal",
      userPfp: "4KyPfbMtfhiMv7QSoSGW4s6dc50UKVtONHrZ7XyTuL8nveGj",
      likes: 42,
      userLiked: false,
      reposts: 12,
      comments: 8,
    },
    {
      _id: "demo-2",
      title: "Learning TypeScript and loving the type safety! 💙",
      done: false,
      date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      tags: [
        ["typescript", "#3178c6"],
        ["learning", "#2dd4bf"],
      ],
      userId: "user-2",
      userName: "sarah_dev",
      userPfp: "4KyPfbMtfhiMv7QSoSGW4s6dc50UKVtONHrZ7XyTuL8nveGj",
      likes: 128,
      userLiked: true,
      reposts: 24,
      comments: 15,
    },
    {
      _id: "demo-3",
      title:
        "New project idea: A collaborative todo app with real-time sync. Thoughts?",
      done: false,
      date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      tags: [
        ["ideas", "#f59e0b"],
        ["collab", "#8b5cf6"],
        ["realtime", "#ec4899"],
      ],
      userId: "user-3",
      userName: "alex_codes",
      userPfp: "4KyPfbMtfhiMv7QSoSGW4s6dc50UKVtONHrZ7XyTuL8nveGj",
      likes: 56,
      userLiked: false,
      reposts: 8,
      comments: 23,
    },
  ];

  return (
    <div id="feed-container">
      <h1 className="feed-title">Feed</h1>
      <div className="feed-list">
        {demoTodos.map((todo) => (
          <FeedTodo
            key={todo._id}
            todo={todo}
            onLike={onLike}
            onRepost={onRepost}
            onComment={onComment}
            onShare={onShare}
          />
        ))}
      </div>
    </div>
  );
}
