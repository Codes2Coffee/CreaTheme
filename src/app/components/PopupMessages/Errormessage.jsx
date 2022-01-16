import React, { useState, useEffect } from "react";
import "./Errormessage.scss";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import Button from "@material-ui/core/Button";
import { firestore } from "../../firebase/config";

function Errormessage({ error, errorPrimary, failed, setFailed }) { 
  const [color, setColor] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const db = firestore;
      db.collection("webinfo").onSnapshot((snapshot) => {
        const newColor = snapshot.docs.map((doc) => doc.data());
        setColor(newColor);
      });
    };
    fetchData();
  }, []);
  return (
    <div>
      <div
        className={failed ? "errorSubCont errorSubContShow" : "errorSubCont"}
      >
        <div className="iconCont">
          {color.map((val) => (
            <ErrorRoundedIcon
              className="errorIcon"
              style={{ color: val.color }}
            />
          ))}
        </div>
        <div className="errorTextCont">
          <h2>{errorPrimary}</h2>
          <h4>{error}</h4>
        </div>
        <div className="okBtnCont">
          {color.map((val) => (
            <Button
              variant="contained"
              color="primary"
              style={{ backgroundColor: val.color }}
              onClick={() => {
                setFailed(false);
              }}
            >
              OK
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Errormessage;
