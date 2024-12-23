import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./uploadPhoto.scss";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../auth/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const uploadPhoto = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const types = ["image/png", "image/jpeg"];
  const handleChange = (e) => {
    let selected = e.target.files[0];
    if (selected && types.includes(selected.type)) {
      setFile(selected);
      setError("");
    } else {
      setFile(null);
      setError("Please select an image file (png or jpeg)");
    }
  };
  const submitHandler = async () => {
    if (file) {
      setDisabled(true);
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append("files", file);
        const token = localStorage.getItem("token");
        const user = await axios.put(
          "https://linkup-bww4.onrender.com/api/v1/user/uploadProfilePic",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              authorisation: `Bearer ${token}`,
            },
          }
        );
        console.log(user, "uploadphoto");
        auth.setUser({
          ...auth.user,
          user: { ...auth.user.user, profilePic: user.data.data.profilePic },
        });
        console.log(user);
        navigate("/description");
        setDisabled(false);
        setLoading(false);
      } catch (err) {
        setDisabled(false);
        setLoading(false);
        console.log(err);
        toast.error(`${err.response.data.error}`, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    } else {
      setDisabled(false);
      setLoading(false);
      alert("Please upload an image");
    }
  };
  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    if (!error) {
      setPreview(null);
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  }, [file]);
  return (
    <>
      <div className="fileDaddy">
        <div className="overlay">
          <div className="file-card">
            {preview && (
              <FontAwesomeIcon
                icon={faXmark}
                className="xmark"
                onClick={() => {
                  setFile(null);
                  setPreview(null);
                }}
              />
            )}
            {preview && <img className="image" src={preview} alt="preview" />}
            {!preview && (
              <div className="file-inputs-parent">
                <div className="file-inputs">
                  <input type="file" onChange={handleChange} />
                  <button>
                    <i>
                      <FontAwesomeIcon icon={faPlus} />
                    </i>
                    Upload
                  </button>
                </div>
                <p className="main">Upload your photo</p>
                <p className="info">This will be your profile photo</p>
                <p className="main">Supported files</p>
                <p className="info">PDF, JPG, PNG</p>
              </div>
            )}
          </div>
          <div className="buttoms">
            {!loading && (
              <button
                className="buttom"
                type="button"
                onClick={() => {
                  navigate("/description");
                }}
              >
                Skip
              </button>
            )}
            {!loading && (
              <button
                className="buttom2"
                type="button"
                onClick={submitHandler}
                disabled={disabled}
              >
                Next
              </button>
            )}
            {loading && <div className="spin1" />}
          </div>
          {error && <div className="error">{error}</div>}
        </div>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
};

export default uploadPhoto;
