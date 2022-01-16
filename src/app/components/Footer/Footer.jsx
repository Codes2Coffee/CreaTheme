import React, { useState } from "react";
import "./Footer.scss";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";

function Footer() {
  const history = useHistory();
  return (
    <div>
      <div className="footerConts">
        <div className="footWrap">
          <div className="cardCont">
            <h1 className="cardTxtBig">
              Are you ready to manage your own online shop?
            </h1>
            <h3 className="cardTxtSmall">Let's get started!</h3>
            <Button
              className="startBtn"
              variant="contained"
              color="primary"
              onClick={() => history.push("/adminhome")}
            >
              Get started
            </Button>
          </div>
          <div className="arrowHead"></div>
          <div className="dot"></div>
          <div className="round"></div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
