import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "./singlePost.module.css";
import {
  faHeart,
  faCircleArrowLeft,
  faCircleArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import Comments from "./comments";
import { useNavigate } from "react-router";
import Posts from "./posts";
import { useAuth } from "../../../auth/auth";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import axios from "axios";
import moment from "moment";

const SinglePost = ({ post }) => {
  const navigate = useNavigate();
  const auth = useAuth();
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState(Object(post).comments[0]);
  const [src, setSrc] = useState(0);
  const [isLiked, setIsLiked] = useState(
    post.likedUser[0].includes(auth.user.user._id)
  );
  const [likes, setLikes] = useState(Object(post).likes[0]);
  const [time, setTime] = useState();

  useEffect(() => {
    const date = new Date(post.created_at.split("T")[0]);
    console.log(Date.now() - date);
    setTime(post.created_at.split("T")[0]);
  }, [post]);

  const [address, setAddress] = useState(Object(post.photos[0]).url);
  let add = post.photos;
  let addVideo = post.videos;
  let addBoth = add.concat(addVideo);
  console.log(post.user._id, "liked");

  const commentHandler = () => {
    setShowComment(!showComment);
  };

  const likeHandler = async () => {
    try {
      if (isLiked) {
        const token = localStorage.getItem("token");
        const res = await axios.put(
          `https://socialise-server-gu5o.onrender.com/api/v1/posts/unlike/${post.id}`,
          {},
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(res);
        setLikes(res.data.data.like);
        setIsLiked(!isLiked);
      } else {
        const token = localStorage.getItem("token");
        const res = await axios.put(
          `https://socialise-server-gu5o.onrender.com/api/v1/posts/like/${post.id}`,
          {},
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(res);
        setIsLiked(!isLiked);
        setLikes(res.data.data.like);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={classes.SinglePost}>
      <div className={classes.upper}>
        <img
          src={post.user.profilePic.url}
          className={classes.profile}
          onClick={() => {
            navigate(`/profile/${post.user._id}`);
          }}
        ></img>
        <p style={{ paddingRight: "20px" }}>{post.user.name}</p>
        <p>{moment(post.created_at).fromNow()}</p>
      </div>
      <div>
        <h2 style={{ fontSize: "25px" }}>{post.title}</h2>
        <h3 style={{ color: "grey", fontSize: "15px" }}>{post.description}</h3>
      </div>
      {src < add.length && (
        <div className={classes.image}>
          <img
            src={address}
            style={{ width: "100%", aspectRatio: "0.70" }}
          ></img>
          {src != 0 && (
            <FontAwesomeIcon
              icon={faCircleArrowLeft}
              className={classes.left}
              onClick={() => {
                setSrc(src - 1);
                setAddress(Object(addBoth[src - 1]).url);
              }}
            />
          )}
          {src != addBoth.length - 1 && (
            <FontAwesomeIcon
              icon={faCircleArrowRight}
              className={classes.right}
              onClick={() => {
                setSrc(src + 1);
                setAddress(Object(addBoth[src + 1]).url);
              }}
            />
          )}
        </div>
      )}
      {src >= add.length && (
        <div className={classes.image}>
          <video style={{ width: "100%", aspectRatio: "0.70" }} controls>
            <source src={address} type="video/mp4"></source>
          </video>
          {src != 0 && (
            <FontAwesomeIcon
              icon={faCircleArrowLeft}
              className={classes.left}
              onClick={() => {
                setSrc(src - 1);
                setAddress(Object(addBoth[src - 1]).url);
              }}
            />
          )}
          {src != addBoth.length - 1 && (
            <FontAwesomeIcon
              icon={faCircleArrowRight}
              className={classes.right}
              onClick={() => {
                setSrc(src + 1);
                setAddress(Object(addBoth[src + 1]).url);
              }}
            />
          )}
        </div>
      )}
      <div className={classes.footer}>
        <div className={classes.likes}>
          {!isLiked && (
            <FavoriteBorderOutlinedIcon
              onClick={likeHandler}
              style={{ color: "red", cursor: "pointer" }}
            />
          )}
          {isLiked && (
            <FavoriteOutlinedIcon
              onClick={likeHandler}
              style={{ color: "red", cursor: "pointer" }}
            />
          )}
          <p style={{ paddingLeft: "10px" }}>{likes} likes</p>
        </div>
        <div className={classes.comments} onClick={commentHandler}>
          <p>{comment.length} comments</p>
        </div>
      </div>
      <div>
        {showComment && (
          <Comments
            comments={post.comments}
            id={post.id}
            commentsState={{ comment, setComment }}
          />
        )}
      </div>
    </div>
  );
};

export default SinglePost;
