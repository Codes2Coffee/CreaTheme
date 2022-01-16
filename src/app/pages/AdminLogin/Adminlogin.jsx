import React, { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import "./Adminlogin.scss";
import ArrowBackIosRoundedIcon from "@material-ui/icons/ArrowBackIosRounded";
import { IconButton } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { firestore } from "../../firebase/config";

function Adminlogin() {
  const history = useHistory();
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [admin, setAdmin] = useState([]);
  const db = firestore;
  useEffect(() => {
    const fetchData = async () => {
      const db = firestore;
      db.collection("admin").onSnapshot((snapshot) => {
        const newAdmin = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setAdmin(newAdmin);
      });
    };
    fetchData();
  }, []);

  return (
    <div>
      <div className="aLoginCont">
        <div className="aLarrowBack">
          <IconButton
            aria-label="search"
            color="inherit"
            onClick={() => history.push("/adminhome")}
          >
            <ArrowBackIosRoundedIcon />
          </IconButton>
        </div>
        <div className="aLcenterCont">
          <div className="ahomeLoginTitle">
            <p>Login to CreaTheme</p>
          </div>
          <TextField
            className="aLoginEmail"
            id="outlined-basic"
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <TextField
            className="aLoginPassword"
            id="outlined-password-input"
            label="Password"
            type="password"
            autoComplete="current-password"
            variant="outlined"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <div className="ahomeLoginBtnCont">
            <Button
              className="aloginSubmitBtn"
              variant="contained"
              color="primary"
              onClick={() => {
                const hasuser = admin.some((val) => {
                  return val.username === username;
                });
                const haspass = admin.some((val) => {
                  return val.password === password;
                });
                if (hasuser && haspass) {
                  db.collection("admin")
                    .doc("4U6Ln0cxG3r6EZvKVarw")
                    .update({
                      status: "logged",
                    })
                    .then(() => {
                      // alert("Welcome admin");
                      history.push("/admin");
                    });
                } else {
                  alert("Incorrect username or password!");
                }
              }}
            >
              Login
            </Button>
          </div>
        </div>
        <div className="liCircle1"></div>
        <div className="liCircle2"></div>
      </div>
    </div>
  );
}

export default Adminlogin;
