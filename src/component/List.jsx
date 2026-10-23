import { useState, useEffect } from "react";
import axios from "axios";

export default function List() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("https://jsonplaceholder.typicode.com/users").then((res) => {
      setData(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <ul>
      {data.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}