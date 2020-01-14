import React, { useState, useEffect } from "react";
import axios from "axios";
import PostCard from "./components/PostCard";
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5000/api/posts`)
      .then(response => {
        setPosts(response.data);
      })
      .catch(error => {
        console.log(error);
      });
    setLoading(false);
  }, []);
  return (
    <div className="App">

    </div>
  );
}

export default App;
