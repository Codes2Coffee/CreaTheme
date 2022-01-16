import React, { useState, useEffect } from "react";
import "./Admin.scss";
import { Route, Switch, useHistory } from "react-router-dom";
import PieChartRoundedIcon from "@material-ui/icons/PieChartRounded";
import PeopleRoundedIcon from "@material-ui/icons/PeopleRounded";
import LocalMallRoundedIcon from "@material-ui/icons/LocalMallRounded";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from "@material-ui/core/styles";
import ListSubheader from "@material-ui/core/ListSubheader";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import Dashboard from "../../components/admin/Dashboard";
import Product from "../../components/admin/Product";
import User from "../../components/admin/user";
import Editing from "../../components/admin/Editing";
import Listings from "../../pages/Listing/Listing1";
import Orders from "../../components/admin/Orders";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import Button from "@material-ui/core/Button";
import LocalShippingIcon from "@material-ui/icons/LocalShipping";
import { BsFillChatFill } from "react-icons/bs";
import Adminchat from "../../components/adminMessage/Adminchat";
import Adminprofile from "../../components/Adminprofile/Adminprofile";
import { firestore } from "../../firebase/config";
import { VscTriangleUp } from "react-icons/vsc";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  list: {
    width: 250,
  },
  fullList: {
    width: "auto",
  },
}));

function Admin() {
  const history = useHistory();
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [drop, setDrop] = useState(false);

  const classes2 = useStyles();
  const [state, setState] = React.useState({
    top: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const [selected1, setSelected1] = useState(false);
  const [selected2, setSelected2] = useState(false);
  const [selected3, setSelected3] = useState(false);
  const [selected4, setSelected4] = useState(false);
  const [selected5, setSelected5] = useState(false);
  const db = firestore;

  const handleClick = () => {
    setOpen(!open);
  };
  const innerTheme = createTheme({
    palette: {
      secondary: {
        main: green[500],
      },
    },
  });

  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const db = firestore;
      db.collection("users").onSnapshot((snapshot) => {
        const newUser = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setUsers(newUser);
      });
    };
    fetchData();
  }, []);

  const [admin, setAdmin] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const db = firestore;
      db.collection("admin").onSnapshot((snapshot) => {
        const newAdmin = snapshot.docs.map((doc) => doc.data());
        setAdmin(newAdmin);
      });
    };
    fetchData();
  }, []);
  const status = admin.some((val) => {
    return val.status === "logged";
  });
  console.log(status);

  const [menushow, setMenushow] = useState(false);
  var loc = window.location.pathname;
  console.log(loc);

  const handleAvatarClick = () => {
    setMenushow(false);
    history.push("/admin/profile");
  };

  function handleLogout() {
    if (document.readyState === "complete") {
      history.push("/adminhome");
    }
  }

  return (
    <div>
      {status ? (
        <div className="adminCon">
          <div className="leftCon" onClick={() => setMenushow(false)}>
            {admin.map((val) => (
              <div
                className="avatarCon"
                onClick={() => history.push("/admin/profile")}
              >
                <Avatar alt="admin-profile" src={val.imgURL}></Avatar>
                <p>{val.firstname}</p>
                <p>{val.lastname}</p>
              </div>
            ))}

            <div className="listCont">
              <List
                component="nav"
                aria-labelledby="nested-list-subheader"
                subheader={
                  <ListSubheader component="div" id="nested-list-subheader">
                    Admin
                  </ListSubheader>
                }
                className={classes.root}
              >
                <ThemeProvider theme={innerTheme}>
                  <ListItem
                    button
                    onClick={() => {
                      history.push("/admin");
                      setSelected1(true);
                      setSelected2(false);
                      setSelected3(false);
                      setSelected4(false);
                      setSelected5(false);
                    }}
                    className={
                      loc === "/admin" ? "dashBtn dashBtnS" : "dashBtn"
                    }
                  >
                    <ListItemIcon>
                      <PieChartRoundedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" />
                  </ListItem>
                </ThemeProvider>

                <ListItem
                  button
                  onClick={() => {
                    history.push("/admin/user");
                    setSelected2(true);
                    setSelected1(false);
                    setSelected3(false);
                    setSelected4(false);
                    setSelected5(false);
                  }}
                  className={
                    loc === "/admin/user" ? "userBtn userBtnS" : "userBtn"
                  }
                >
                  <ListItemIcon>
                    <PeopleRoundedIcon />
                  </ListItemIcon>
                  <ListItemText primary="User" />
                </ListItem>
                <ListItem
                  button
                  onClick={() => {
                    history.push("/admin/product");
                    setSelected3(true);
                    setSelected2(false);
                    setSelected1(false);
                    setSelected4(false);
                    setSelected5(false);
                  }}
                  className={
                    loc === "/admin/product" ? "prodBtn prodBtnS" : "prodBtn"
                  }
                >
                  <ListItemIcon>
                    <LocalMallRoundedIcon />
                  </ListItemIcon>
                  <ListItemText primary="Product" />
                </ListItem>
                <ListItem
                  button
                  onClick={() => {
                    history.push("/admin/orders");
                    setSelected5(true);
                    setSelected4(false);
                    setSelected3(false);
                    setSelected2(false);
                    setSelected1(false);
                  }}
                  className={
                    loc === "/admin/orders"
                      ? "ordersBtn ordersBtnS"
                      : "ordersBtn"
                  }
                >
                  <ListItemIcon>
                    <LocalShippingIcon />
                  </ListItemIcon>
                  <ListItemText primary="Orders" />
                </ListItem>
                <ListItem
                  button
                  onClick={() => {
                    history.push("/admin/editing");
                    setSelected4(true);
                    setSelected3(false);
                    setSelected2(false);
                    setSelected1(false);
                    setSelected5(false);
                  }}
                  className={
                    loc === "/admin/editing"
                      ? "editingBtn editingBtnS"
                      : "editingBtn"
                  }
                >
                  <ListItemIcon>
                    <EditRoundedIcon />
                  </ListItemIcon>
                  <ListItemText primary="Editing" />
                </ListItem>
              </List>
              {/* <div
              className={`selector ${window.location.pathname.replace(
                /\//g,
                "_"
              )} `}
            ></div> */}
            </div>
          </div>
          <div className="rightCon">
            <div className="topNav">
              <div
                className={drop ? "searchCon searchConDrop" : "searchCon"}
                onClick={() => setDrop(true)}
              >
                <SearchIcon />
                <input
                  type="text"
                  className="searchBarDrop"
                  aria-label="search"
                  placeholder="Search..."
                />
                <Button
                  variant="contained"
                  color="primary"
                  className="searchBarDrop_submit"
                >
                  Search
                </Button>
              </div>
              <div className="topCon2">
                {/* <div className="adSearchBtn">
                <IconButton
                  aria-label="search"
                  color="inherit"
                  onClick={() => setDrop(true)}
                >
                  <SearchIcon />
                </IconButton>
              </div> */}

                <div className="topAvatarBtn">
                  <IconButton
                    aria-label="chat"
                    color="inherit"
                    className="adProfileBtn"
                    style={
                      menushow
                        ? { filter: "brightness(75%)" }
                        : { filter: "brightness(100%)" }
                    }
                    onClick={() => {
                      if (menushow) {
                        setMenushow(false);
                      } else {
                        setMenushow(true);
                      }
                    }}
                  >
                    {admin.map((val) => (
                      <Avatar alt="admin-profile" src={val.imgURL}>
                        S
                      </Avatar>
                    ))}
                  </IconButton>
                </div>
                <div className="adChatBtn">
                  <IconButton
                    aria-label="chat"
                    color="inherit"
                    className="chatIconBtn"
                    onClick={() => {
                      history.push("/admin/chat");
                    }}
                  >
                    <BsFillChatFill />
                  </IconButton>
                </div>
                <div
                  className={menushow ? "menuCont menuContShow" : "menuCont"}
                >
                  <div className="menu">
                    <div className="arrowCont">
                      <VscTriangleUp />
                    </div>
                    {admin.map((val) => (
                      <div className="topMenuCont">
                        <h3 className="menuName">
                          {val.firstname} {val.lastname}
                        </h3>
                        <p className="username">@{val.username}</p>
                      </div>
                    ))}
                    <div className="botMenuCont">
                      <Button
                        variant="text"
                        className="option1"
                        onClick={handleAvatarClick}
                      >
                        <PersonRoundedIcon />
                        <p className="menuText">Profile</p>
                      </Button>
                      <div className="logoutBtnCont">
                        <Button
                          variant="outlined"
                          className="logoutBtn"
                          onClick={() => {
                            db.collection("admin")
                              .doc("4U6Ln0cxG3r6EZvKVarw")
                              .update({
                                status: "out",
                              })
                              .then(() => {
                                history.push("/adminhome");
                              });
                          }}
                        >
                          Logout
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="adBotCon" onClick={() => setMenushow(false)}>
              <Switch>
                <Route exact path="/admin" component={Dashboard} />
                <Route exact path="/admin/product" component={Product} />
                <Route exact path="/admin/user" component={User} />
                <Route exact path="/admin/editing" component={Editing} />
                <Route exact path="/admin/listings" component={Listings} />
                <Route exact path="/admin/orders" component={Orders} />
                <Route exact path="/admin/chat" component={Adminchat} />
                <Route exact path="/admin/profile" component={Adminprofile} />
              </Switch>
            </div>
          </div>
        </div>
      ) : (
        <div className="errorCont">
          <h1>Error loading page.</h1>
          <Button
            onClick={() => {
              history.push("/adminhome");
            }}
          >
            Signin
          </Button>
        </div>
      )}
    </div>
  );
}

export default Admin;
