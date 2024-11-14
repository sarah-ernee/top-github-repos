import React, { useState, useEffect, useCallback } from "react";
import "./App.css";

const App = () => {
  const [repos, setRepos] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Trigger the API when page number changes
  useEffect(() => {
    const fetchRepos = async () => {
      setLoading(true);

      const date = new Date();
      date.setDate(date.getDate() - 10);

      const dateString = date.toISOString().split("T")[0];

      try {
        const response = await fetch(
          `https://api.github.com/search/repositories?q=created:>${dateString}&sort=stars&order=desc&page=${page}`
        );

        const data = await response.json();

        if (data.items.length === 0) {
          setHasMore(false); // no more items to display
        }

        setRepos((prevRepos) => [...prevRepos, ...data.items]);
      } catch (error) {
        console.error("Error fetching repos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, [page]);

  // Page number change with scroll event
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 200 &&
      !loading &&
      hasMore
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [loading, hasMore]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore, handleScroll]);

  return (
    <div className="app">
      <h1>Trending Repos</h1>
      <div className="repo-list">
        {repos.map((repo) => (
          <div key={repo.id} className="repo-item">
            <img
              src={repo.owner.avatar_url}
              alt={`${repo.owner.login} avatar`}
              className="avatar"
            />

            <div className="repo-details">
              <h2>{repo.name}</h2>
              <p>{repo.description || "No description available"}</p>

              <p>
                ⭐ {repo.stargazers_count} | By {repo.owner.login}
              </p>
            </div>
          </div>
        ))}
      </div>

      {loading && <p className="loader">Loading...</p>}
      {!hasMore && <p className="end-message">No more repos available</p>}
    </div>
  );
};

export default App;
