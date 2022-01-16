import React, { useEffect, useState } from "react";
import "./Profile.scss";
import { Link, Route, Switch, useHistory } from "react-router-dom";
import { auth, firestore } from "../../firebase/config";
import { Avatar, Button } from "@material-ui/core";
import Aos from "aos";
import "aos/dist/aos.css";
import Nav from "../../components/nav/Nav";
import loading from "../../components/loading/loading";
import Purchase from "../../components/profile/Purchase";
import Likes from "../../components/profile/Likes";
import DeliveryAddress from "../../components/profile/DeliveryAddress";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import ArrowForwardIosRoundedIcon from "@material-ui/icons/ArrowForwardIosRounded";
import Del from "../../components/DeliveryAddress/Deladdress";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import MLink from "@mui/material/Link";
import HomeIcon from "@mui/icons-material/Home";
import PersonRoundedIcon from "@material-ui/icons/PersonRounded";
import FavoriteRoundedIcon from "@material-ui/icons/FavoriteRounded";
import PersonPinCircleRoundedIcon from "@material-ui/icons/PersonPinCircleRounded";
import LocalShippingRoundedIcon from "@material-ui/icons/LocalShippingRounded";
import Messenger from "../Message/Message";
import ModeCommentRoundedIcon from "@mui/icons-material/ModeCommentRounded";
import IconButton from "@material-ui/core/IconButton";

function Profile() {
  const [user, setUser] = useState(null);
  const history = useHistory();
  const [hover, setHover] = useState(false);
  const [hover2, setHover2] = useState(false);
  const [hover3, setHover3] = useState(false);
  const [shownotif, setShownotif] = useState(false);

  const [status, setStatus] = useState("init");
  console.log(window.location.pathname);
  useEffect(() => {
    Aos.init({ duration: 9000 });

    const unsub = auth.onAuthStateChanged((u) => {
      if (!u) return history.push("/Signin");

      firestore
        .collection("users")
        .doc(u.uid)
        .get()
        .then((doc) => {
          if (!doc.exists) return setUser(u);
          setUser(doc.data());
          setStatus("ok");
        })
        .catch((err) => {
          setStatus("error");
          console.log(err);
        });
    });

    return unsub;
  }, []);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const [color, setColor] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const db = firestore;
      const data = await db.collection("webinfo").get();
      setColor(data.docs.map((doc) => doc.data()));
    };
    fetchData();
  }, []);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [bread, setBread] = useState("orders");
  console.log(bread);

  var loc = window.location.pathname;
  const [toggleMsg, setToggleMsg] = useState(false);

  const open = Boolean(anchorEl);
  if (status === "init")
    return (
      <div>
        <loading />
      </div>
    );
  if (status === "noUser") return <div>please login</div>;
  if (status === "error") return <div>something went wrong</div>;

  return (
    <div>
      <Nav
        shownotif={shownotif}
        setShownotif={setShownotif}
        setToggleMsg={setToggleMsg}
      />
      <Messenger toggleMsg={toggleMsg} setToggleMsg={setToggleMsg} />
      <div className="openChatBtnCont">
        {color.map((col) => (
          <IconButton
            className="openChatBtn"
            onClick={() => {
              if (user) {
                setToggleMsg(true);
              } else {
                history.push("/Signin");
              }
            }}
          >
            <ModeCommentRoundedIcon
              style={{ fontSize: "30px", color: col.color }}
            />
          </IconButton>
        ))}
      </div>
      <div
        className="profileCon"
        onClick={() => {
          setShownotif(false);
        }}
      >
        <div className="breadCrumbs">
          {loc === "/profile" && (
            <Breadcrumbs aria-label="breadcrumb">
              <MLink
                underline="hover"
                sx={{ display: "flex", alignItems: "center" }}
                color="inherit"
                href="/"
              >
                <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                HOME
              </MLink>
              <Typography
                sx={{ display: "flex", alignItems: "center" }}
                color="text.primary"
              >
                <PersonRoundedIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                PROFILE
              </Typography>
              <Typography
                sx={{ display: "flex", alignItems: "center" }}
                color="text.primary"
              >
                <LocalShippingRoundedIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                ORDERS
              </Typography>
            </Breadcrumbs>
          )}
          {loc === "/profile/likes" && (
            <Breadcrumbs aria-label="breadcrumb">
              <MLink
                underline="hover"
                sx={{ display: "flex", alignItems: "center" }}
                color="inherit"
                href="/"
              >
                <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                HOME
              </MLink>
              <Typography
                sx={{ display: "flex", alignItems: "center" }}
                color="text.primary"
              >
                <PersonRoundedIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                PROFILE
              </Typography>
              <Typography
                sx={{ display: "flex", alignItems: "center" }}
                color="text.primary"
              >
                <FavoriteRoundedIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                LIKES
              </Typography>
            </Breadcrumbs>
          )}
          {loc === "/profile/deliveryAddress" && (
            <Breadcrumbs aria-label="breadcrumb">
              <MLink
                underline="hover"
                sx={{ display: "flex", alignItems: "center" }}
                color="inherit"
                href="/"
              >
                <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                HOME
              </MLink>
              <Typography
                sx={{ display: "flex", alignItems: "center" }}
                color="text.primary"
              >
                <PersonRoundedIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                PROFILE
              </Typography>
              <Typography
                sx={{ display: "flex", alignItems: "center" }}
                color="text.primary"
              >
                <PersonPinCircleRoundedIcon
                  sx={{ mr: 0.5 }}
                  fontSize="inherit"
                />
                DELIVERY ADDRESS
              </Typography>
            </Breadcrumbs>
          )}
        </div>

        <div className="pleftCon">
          <div className="pAvatar">
            <Avatar src={user.imgURL} />
          </div>
          <h1>
            {user.firstname} {user.lastname}
          </h1>
          <h4 className="pEmail">{user.email}</h4>
          <div className="pAdd">
            <h3>
              {user.brgy}
              {", "} {user.city}
              {", "} {user.province}
            </h3>
          </div>
          <div className="delCont">
            <Del />
          </div>
        </div>
        <div className="prightCon">
          <div className="pBtnCon">
            <div className="pLeftCont">
              {color.map((col) => (
                <div className="purchaseBtnCont">
                  <Button
                    variant="text"
                    className="purchaseBtn"
                    style={
                      loc === "/profile"
                        ? { color: "white" }
                        : { color: "black" }
                    }
                    onClick={() => {
                      setBread("orders");
                      history.push("/profile");
                    }}
                  >
                    Orders
                  </Button>
                </div>
              ))}

              {color.map((col) => (
                <div className="likesBtnCont">
                  <Button
                    variant="text"
                    className="likesBtn"
                    style={
                      loc === "/profile/likes"
                        ? { color: "white" }
                        : { color: "black" }
                    }
                    onClick={() => {
                      setBread("likes");
                      history.push("/profile/likes");
                    }}
                  >
                    Likes
                  </Button>
                </div>
              ))}

              {color.map((col) => (
                <div className="deliveryBtnCont">
                  <Button
                    variant="text"
                    className="deliveryBtn"
                    style={
                      loc === "/profile/deliveryAddress"
                        ? { color: "white" }
                        : { color: "black" }
                    }
                    onClick={() => {
                      setBread("delivery");
                      history.push("/profile/deliveryAddress");
                    }}
                  >
                    Delivery Address
                  </Button>
                </div>
              ))}

              {color.map((col) => (
                <div
                  className="topSelector"
                  style={{ backgroundColor: col.color }}
                ></div>
              ))}

              {color.map((col) => (
                <div
                  className={`selector ${window.location.pathname.replace(
                    /\//g,
                    "_"
                  )} `}
                  style={{ backgroundColor: col.color }}
                ></div>
              ))}
            </div>

            <div className="peditBtn">
              <Button
                variant="outlined"
                onClick={() => history.push("/settings")}
              >
                Edit
              </Button>
            </div>
          </div>
          <div className="pBotCon">
            <Switch>
              <Route exact path="/profile" component={Purchase} />
              <Route exact path="/profile/likes" component={Likes} />
              <Route
                exact
                path="/profile/deliveryAddress"
                component={DeliveryAddress}
              />
            </Switch>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
