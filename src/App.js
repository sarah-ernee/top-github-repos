import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [repos, setRepos] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRepos = async () => {
      setLoading(true);

      const date = new Date();
      date.setDate(date.getDate() - 10);

      const dateString = date.toISOString().split("T")[0];

      const response = await fetch(
        `https://api.github.com/search/repositories?q=created:>${dateString}&sort=stars&order=desc&page=${page}`
      );

      const data = await response.json();
      
      setRepos((prevRepos) => [...prevRepos, ...data.items]);
      setLoading(false);
    };

    fetchRepos();
  }, [page]);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    </div>
  );
};

export default App;
