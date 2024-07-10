import { useState, useEffect } from "react";
const apiKey = import.meta.env.VITE_APP_API_KEY;
function truncateHTMLContent(html, maxLength) {
  const plainText =
    new DOMParser().parseFromString(html, "text/html").body.textContent || "";
  return plainText.length > maxLength
    ? plainText.substring(0, maxLength) + "..."
    : plainText;
}
function useBlogData() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "https://blogapi-production-fb2f.up.railway.app/blog",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "x-api-key": apiKey,
            },
          },
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const jsonData = await response.json();

        // Fetch like and dislike counts for each blog post
        await Promise.all(
          jsonData.map(async (item) => {
            const likeResponse = await fetch(
              `https://blogapi-production-fb2f.up.railway.app/user/blog/${item._id}/likes/count`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "x-api-key": apiKey,
                },
              },
            );
            const dislikeResponse = await fetch(
              `https://blogapi-production-fb2f.up.railway.app/user/blog/${item._id}/dislikes/count`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "x-api-key": apiKey,
                },
              },
            );
            if (likeResponse.ok && dislikeResponse.ok) {
              const likeData = await likeResponse.json();
              const dislikeData = await dislikeResponse.json();
              item.likes = likeData.likesCount;
              item.dislikes = dislikeData.dislikesCount;
            } else {
              throw new Error("Error fetching like/dislike counts");
            }
          }),
        );

        setData(jsonData); // Update state with likes and dislikes
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    }

    fetchData();
  }, []);

  return data;
}

export { useBlogData, truncateHTMLContent };
