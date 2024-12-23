import { Dialog, Box, Typography, List, ListItem, styled } from "@mui/material";
import { useOpenDialog } from "../../contexts/openFollowerDialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import classes from "./followersDialog.module.css";
import { useAuth } from "../../auth/auth";
import { allUsers } from "../../App";
import { useContext } from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

import { useParams } from "react-router";

const dialogStyle = {
  width: "350px",
  height: "400px",
};

const Image = styled("img")({
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  marginRight: "10px",
});

const Header = styled(Box)`
  border-bottom: 1px solid lightgray;
  padding: 10px;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const Follower = styled(Box)`
  padding: 10px;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const FollowerList = styled(Box)`
  display: flex;
  align-items: center;
`;

const Followers = ({ user, followers }) => {
  const [allFollowers, setAllFollowers] = useState(followers);
  const navigate = useNavigate();
  const [rerender, setRerender] = useState(false);
  // const allUser = useContext(allUsers);
  // console.log(allUser, "alluser", user);
  const { opendialog, setOpendialog } = useOpenDialog();
  const auth = useAuth();
  const { id } = useParams();

  useEffect(() => {
    setAllFollowers(followers);
  }, [followers]);

  const removeFollower = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.put(
        `https://linkup-bww4.onrender.com/api/v1/user/block/${id}`,
        {},
        { headers: { authorisation: `Bearer ${token}` } }
      );
      setAllFollowers(allFollowers.filter((following) => following._id !== id));
      let u = auth.user;
      console.log(id, "id");
      console.log(u, "before change");
      u.user.followers = u.user.followers.filter(
        (following) => following !== id
      );
      u.followers = u.followers - 1;
      console.log(u, "after change");
      auth.setUser({ ...u, user: u.user, followers: u.followers });
      setUser({ ...user, followers: user.followers - 1 });
      setRerender(!rerender);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Dialog
      open={opendialog}
      PaperProps={{ sx: dialogStyle }}
      onClose={() => {
        setOpendialog(false);
      }}
    >
      <Header>
        <Typography>Followers</Typography>
        <FontAwesomeIcon
          icon={faXmark}
          onClick={() => {
            setOpendialog(false);
          }}
          className={classes.xmark}
        ></FontAwesomeIcon>
      </Header>
      {allFollowers.map((follow) => {
        return (
          <Follower key={follow._id}>
            <FollowerList>
              <Image
                src={follow.profilePic.url}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  navigate(`/profile/${follow._id}`);
                  setOpendialog(false);
                }}
              ></Image>
              <Typography>{follow.name}</Typography>
            </FollowerList>
            {auth.user.user._id == id && (
              <Box>
                <button
                  className={classes.button}
                  onClick={() => {
                    removeFollower(follow._id);
                  }}
                >
                  Block
                </button>
              </Box>
            )}
          </Follower>
        );
      })}
    </Dialog>
  );
};

export default Followers;
