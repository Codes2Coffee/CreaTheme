import React, { useState } from "react";
import "./Admininformation.scss";
import Nav from "../../components/nav/Nav";
import Admininfo from "../../components/Adminprofile/Admininfo";
import Messenger from "../Message/Message";

function Admininformation() {
  const [shownotif, setShownotif] = useState(false);
  const [toggleMsg, setToggleMsg] = useState(false);
  return (
    <div>
      <div className="adminInformSubCont">
        <Nav
          shownotif={shownotif}
          setShownotif={setShownotif}
          setToggleMsg={setToggleMsg}
        />
        <Messenger toggleMsg={toggleMsg} setToggleMsg={setToggleMsg} />
        <Admininfo
          shownotif={shownotif}
          setShownotif={setShownotif}
          setToggleMsg={setToggleMsg}
        />
      </div>
    </div>
  );
}

export default Admininformation;
