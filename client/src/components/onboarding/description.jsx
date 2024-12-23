import classes from "./description.module.scss";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Dialog,
  Box,
  Typography,
  List,
  ListItem,
  styled,
  TextField,
} from "@mui/material";
import { border, borderRadius, margin, textAlign } from "@mui/system";
import axios from "axios";
import { useAuth } from "../../auth/auth";

const Description = () => {
  const navigate = useNavigate();
  const [disabled, setDisabled] = useState(false);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const submitHandler = async (e) => {
    setDisabled(true);
    setLoading(true);
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["authorisation"] = `Bearer ${token}`;
      await axios.put(
        "https://linkup-bww4.onrender.com/api/v1/user/addBio",
        {
          bio: description,
        }
      );
      auth.setUser({
        ...auth.user,
        user: { ...auth.user.user, bio: description },
      });
    } catch (err) {
      console.log(err);
    }
    navigate("/");
    setDisabled(false);
    setLoading(false);
  };

  const changeHandler = (e) => {
    setDescription(e.target.value);
  };

  const dialogStyle = {
    margin: "6%",
    height: {
      xs: "200vh",
      sm: "200vh",
      md: 430,
      lg: 430,
      xl: 430,
    },
    width: {
      xs: "100vw",
      sm: "100vw",
      md: 500,
      lg: 500,
      xl: 500,
    },
    boxShadow: "none",
    overflow: "none",
    borderRadius: "10px",
  };

  const Component = styled(Box)`
    padding: 20px;
    font-family: "Lucida Console", "Courier New", monospace;
  `;
  const Heading = styled(Typography)`
    font-size: 25px;
    font-weight: bolder;
    padding-bottom: 6px;
  `;
  const Para = styled(Typography)`
    font-size: 15px;
    color: #888888;
    padding-bottom: 30px;
  `;
  const stl = {
    height: "45px",
    backgroundColor: "#0CAFFF",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "19px",
    width: "100%",
    margin: "2% auto",
    marginLeft: "auto",
    marginRight: "auto",
    textAlign: "center",
    "&:hover": {
      backgroundColor: "#00FFFF",
    },
  };

  const stl1 = {
    height: "45px",
    backgroundColor: "grey",
    color: "white",
    border: "none",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "19px",
    width: "100%",
    margin: "2% auto",
    marginLeft: "auto",
    marginRight: "auto",
    textAlign: "center",
    "&:hover": {
      backgroundColor: "#00FFFF",
    },
  };

  return (
    <Box className={classes.description}>
      {/* <h1 className={classes.heading}>LinkUp</h1>
       */}
      <Dialog open={true} PaperProps={{ sx: dialogStyle }}>
        <Component>
          <Heading>Describe Yourself</Heading>
          <Para>
            What makes you special? Don't think too hard just have fun with it.
          </Para>
          <form onSubmit={submitHandler}>
            <TextField
              placeholder="Add Description"
              value={description}
              maxLength="200"
              autoFocus
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              style={{ width: "100%" }}
            ></TextField>
            {!loading && (
              <button type="submit" style={stl} disabled={disabled}>
                Next
              </button>
            )}
            {loading && <div style={stl1}>Loading...</div>}
          </form>
        </Component>
      </Dialog>
    </Box>
  );
};

export default Description;
