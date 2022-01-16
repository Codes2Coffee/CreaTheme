import React, { useState, useEffect } from "react";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import Button from "@material-ui/core/Button";
import "./Confirmation.scss";
import { firestore } from "../../firebase/config";

function Confirmation({ confirmMsg, action, confirm, cancel }) {
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
        className={
          confirm
            ? "confirmMessageCont confirmMessageContShow"
            : "confirmMessageCont"
        }
      >
        <div className="confirmMessageForm">
          <div className="cIconCont">
            {color.map((val) => (
              <ErrorRoundedIcon
                className="confirmIcon"
                style={{ color: val.color }}
              />
            ))}
          </div>
          <h2>{confirmMsg}</h2>
          {color.map((val) => (
            <div className="confirmBtnCont">
              <Button className="confirmCancelBtn" onClick={cancel}>
                Cancel
              </Button>
              <Button
                className="confirmBtn"
                variant="contained"
                color="primary"
                style={{ backgroundColor: val.color }}
                onClick={action}
              >
                Proceed
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Confirmation;
