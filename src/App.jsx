import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          "https://blogapi-production-fb2f.up.railway.app/user",
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    }

    fetchData();
  }, []);
  return (
    <div>
      {data && data.length > 0 ? (
        <ul>
          {data.map((item) => (
            <li key={uuidv4()}>
              <div>
                <p>Username: {item.username}</p>
                <p>Email: {item.email}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
}

export default App;
