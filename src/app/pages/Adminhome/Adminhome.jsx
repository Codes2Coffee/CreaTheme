import React from "react";
import { useHistory } from "react-router-dom";
import "./Adminhome.scss";
import Button from "@material-ui/core/Button";
import LocalMallRoundedIcon from "@mui/icons-material/LocalMallRounded";

import IconButton from "@material-ui/core/IconButton";

function Adminhome() {
  const history = useHistory();

  return (
    <div>
      <div className="aHomeCont">
        {/* <h2>Welcome to</h2> */}
        <div className="squareCont">
          <div className="aHomeTitleCont"></div>
          <div className="logoCont"></div>
          <h1 className="ahomeTitle">CreaTheme</h1>
        </div>
        <div className="shopBtnCont">
          <IconButton
            color="inherit"
            className="shopBtn"
            onClick={() => {
              history.push("/");
            }}
          >
            <LocalMallRoundedIcon />
          </IconButton>
        </div>
        <div className="ahomeButtonCont">
          {/* <Button
            className="ahomeRegisterBtn" 
            variant="contained"
            color="primary"
            onClick={() => history.push("/adminsignup")}
          >
            Register
          </Button> */}
          <Button
            className="ahomeSigninBtn"
            variant="contained"
            color="primary"
            onClick={() => history.push("/adminlogin")}
          >
            Signin
          </Button>
        </div>
        <div className="circle1"></div>
        <div className="circle2"></div>
      </div>
    </div>
  );
}

export default Adminhome;
