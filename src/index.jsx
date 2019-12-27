import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "../node_modules/react-vis/dist/style.css";
import "./styles.css";
import Chart from "./Chart";

const API_ROOT = "https://api.github.com";
// const defaultRepo = "reduxjs/redux";

const getStatsEndpoint = repo =>
  `${API_ROOT}/repos/${repo}/stats/commit_activity`;

function fetchAndSetStats({ repo, setStats }) {
  fetch(getStatsEndpoint(repo.full_name))
    .then(res => res.json())
    .then(res => {
      console.log(res);
      setStats(res);
    })
    .catch(() => {
      setStats([]);
    });
}

function fetchAndSetRepo({ value, setResults, setSearching }) {
  fetch(`${API_ROOT}/search/repositories?q=${value}&sort=stars`)
    .then(res => res.json())
    .then(res => {
      setResults(res.items.slice(0, 5));
      setSearching(false);
    })
    .catch(() => {
      setSearching(false);
    });
}

function emptyState() {
  return (
    <div className="empty-state-root">Start by searching for a repo..</div>
  );
}

function App() {
  const [repo, setRepo] = useState({});
  const [stats, setStats] = useState([]);
  const [searching, setSearching] = useState(null);
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetchAndSetStats({ repo, setStats });
  }, [repo]);

  function searchRepoByString(e) {
    if (!searching) {
      setSearching(true);
    }
    const { value } = e.target;
    fetchAndSetRepo({
      value,
      setResults,
      setSearching
    });
  }

  return (
    <div className="App">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for a repo here"
          onChange={searchRepoByString}
        />
        {searching === true ? (
          <p>fetching...</p>
        ) : (
          <ul className="search-results">
            {results.map(result => (
              <li
                key={result.id}
                className="search-result-row"
                onClick={() => {
                  console.log(result);
                  setRepo(result);
                  setResults([]);
                  setStats([]);
                  fetchAndSetStats({
                    repo: result,
                    setStats
                  });
                }}
              >
                {result.full_name}
              </li>
            ))}
          </ul>
        )}
      </div>
      {stats.length ? (
        <div className="stats-container-root">
          <div className="stats-container">
            <h3>
              <a target="_blank" href={repo.html_url} rel="noreferrer noopener">
                {repo.full_name}
              </a>
            </h3>
            <Chart data={stats} />
            <p>Stars: {repo.stargazers_count}</p>
            <p>{repo.description}</p>
          </div>
        </div>
      ) : repo.full_name ? (
        <p>Loading...</p>
      ) : (
        emptyState()
      )}
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
