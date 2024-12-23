import SinglePost from "./singlePost";
import classes from "./posts.module.css";
import { useEffect, useState } from "react";
import axios from "axios";

const Posts = () => {
  const token = localStorage.getItem("token");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPosts = async () => {
      try {
        console.log(token);
        const posts1 = await axios.get(
          "https://linkup-bww4.onrender.com/api/v1/all_posts/every",
          {
            headers: {
              "Content-Type": "application/json",
              authorisation: `Bearer ${token}`,
            },
          }
        );
        // console.log((await posts1).data.data)
        // console.log(posts1);
        setPosts(posts1.data.data);
        // console.log(posts1);
        setLoading(false);
      } catch (err) {
        // console.log(err);
        setLoading(false);
      }
    };
    getPosts();
  }, []);

  return (
    <>
      {loading && (
        <div className={classes.loading}>
          <div className={classes.spin} />
        </div>
      )}
      {!loading && (
        <>
          {posts.length > 0 && posts && (
            <div className={classes.posts}>
              {!loading &&
                posts.map((post) => {
                  if (post) {
                    return <SinglePost key={post.id} post={post} />;
                  }
                })}
            </div>
          )}
          {posts.length == 0 && (
            <div className={classes.noPosts}>No Posts to view</div>
          )}
        </>
      )}
    </>
  );
};

export default Posts;
