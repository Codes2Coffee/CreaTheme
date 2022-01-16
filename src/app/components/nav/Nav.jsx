import React, { useEffect, useState } from "react";
import "./nav.scss";
import logo1 from "../../images/CreaThemeLogo.png";
import { Link, useHistory } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { GrSearch } from "react-icons/gr";
import { VscTriangleUp } from "react-icons/vsc";
import { AiFillSetting } from "react-icons/ai";
import { BsFillChatFill } from "react-icons/bs";
import { auth, firestore } from "../../firebase/config";
import { Avatar } from "@material-ui/core";
import Aos from "aos";
import "aos/dist/aos.css";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import { withStyles } from "@material-ui/core/styles";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import DoneAllRoundedIcon from "@mui/icons-material/DoneAllRounded";
import { GiShakingHands } from "react-icons/gi";
import LocalShippingIcon from "@material-ui/icons/LocalShipping";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import { styled } from "@mui/system";
import BadgeUnstyled from "@mui/core/BadgeUnstyled";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import LocalMallRoundedIcon from "@mui/icons-material/LocalMallRounded";
import HomeIcon from "@mui/icons-material/Home";

function Nav({ shownotif, setShownotif, setToggleMsg }) {
  const [logo, setLogo] = useState([]);
  const [showhamburger, setShowhamburger] = useState(false);
  const [user, setUser] = useState(null);
  const history = useHistory();

  const StyledBadge = withStyles((theme) => ({
    badge: {
      right: -3,
      top: 13,
      border: `2px solid ${theme.palette.background.paper}`,
      padding: "0 4px",
      // backgroundColor: "red",
    },
  }))(Badge);

  const [useruid, setUseruid] = useState(null);

  useEffect(() => {
    Aos.init({ duration: 9000 });

    const unsub = auth.onAuthStateChanged((u) => {
      if (!u) return setUser(null);
      // setUser(u);

      firestore
        .collection("users")
        .doc(u.uid)
        .get()
        .then((doc) => {
          if (!doc.exists) return setUser(u);
          setUser(doc.data());
          setUseruid(u.uid);
        })
        .catch((err) => {
          console.log(err);
        });
    });

    return unsub;
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

  const db = firestore;
  useEffect(() => {
    const fetchData = async () => {
      const db = firestore;
      db.collection("webinfo").onSnapshot((snapshot) => {
        const newLogo = snapshot.docs.map((doc) => doc.data());
        setLogo(newLogo);
      });
    };
    fetchData();
  }, []);

  const [wY, setWY] = useState(false);

  useEffect(() => {
    const onscroll = (e) => {
      if (window.scrollY > 2) {
        return setWY(true);
      }

      if (window.scrollY <= 2) {
        setWY(false);
      }
    };
    window.addEventListener("scroll", onscroll);
    return () => {
      window.removeEventListener("scroll", onscroll);
    };
  }, []);
  // console.log(user);

  const [searchBarContent, setSearchBarContent] = useState("");
  const handleSearch = (e) => {
    setSearchBarContent(e.target.value);
    console.log(searchBarContent);
  };

  const [cartProducts, setCartProducts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const db = firestore;
      db.collection("cart " + useruid).onSnapshot((snapshot) => {
        const newCartProduct = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setCartProducts(newCartProduct);
      });
    };
    fetchData();
  }, [useruid]);

  let x = 0;

  cartProducts.map((items) => (x = x + items.qty));
  console.log("total qty: ", x, cartProducts.length);

  // const [shownotif, setShownotif] = useState(false);

  const [notif, setNotif] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const db = firestore;
      db.collection("notify")
        .where("userID", "==", useruid)
        .onSnapshot((snapshot) => {
          const newNotif = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          setNotif(newNotif);
        });
    };
    fetchData();
  }, [useruid]);

  let newCount = 0;
  notif.map((val) => {
    if (val.status === "unread") {
      newCount = newCount + 1;
    }
    return val;
  });

  let earlyCount = 0;
  notif.map((val) => {
    if (val.status === "read") {
      earlyCount = earlyCount + 1;
    }
    return val;
  });

  console.log("count", newCount);

  const today = Date.now();
  const currentDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(today);
  console.log(currentDate);

  const dateFormatter = Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  var d = new Date();

  const invisible = notif.some((val) => {
    return val.status === "unread";
  });

  const StyledBadge2 = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      padding: "0 4px",
      backgroundColor: "#EB002D",
    },
  }));

  const StyledBadge3 = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      top: "10px",
      padding: "0 4px",
      backgroundColor: "#EB002D",
      right: "-20px",
    },
  }));

  const StyledBadge5 = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      top: "10px",
      padding: "0 4px",
      backgroundColor: "#EB002D",
      right: "-20px",
    },
  }));

  const StyledBadge4 = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      top: "0px",
      padding: "0 4px",
      backgroundColor: "#EB002D",
      right: "-10px",
      PointerEvents: "none",
    },
  }));

  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const db = firestore;
      db.collection("messages " + useruid)
        .orderBy("createdAt")
        .onSnapshot((snapshot) => {
          const newMessage = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          setMessages(newMessage);
        });
    };
    fetchData();
  }, [useruid]);

  let msgUnread = 0;
  messages.map((val) => {
    if (val.status === "unread" && val.userID === "admin") {
      msgUnread = msgUnread + 1;
    }
    return val;
  });

  const [showMenu, setShowmenu] = useState(false);

  const [check, setCheck] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const db = firestore;
      const data = await db.collection("statusheck").get();
      setCheck(data.docs.map((doc) => doc.data()));
    };
    fetchData();
  }, []);

  //   var resizeEvent = window.document.createEvent('UIEvents');
  // resizeEvent.initUIEvent('resize', true, false, window, 0);
  // window.dispatchEvent(resizeEvent);
  let size = 0;
  size = window.addEventListener("resize", function (event) {
    return window.innerWidth;
    // var newHeight = window.innerHeight;
  });
  console.log("width: ", size);

  const [showmenu2, setShowmenu2] = useState(false);

  const [response, setResponse] = useState(false);

  window.addEventListener("resize", function () {
    if (window.innerWidth <= 750) {
      setResponse(true);
    } else {
      setResponse(false);
    }
  });

  console.log(response);

  return (
    <div className="nav-c">
      {wY ? (
        <div className="snavUp" style={{ backgroundColor: "#fff" }}>
          <div className="slogo">
            {check.map((val) =>
              val.status !== "new" ? (
                <Link to="/">
                  {logo.map((log) => (
                    <img src={log.imgURL} alt="Creatheme" />
                  ))}
                </Link>
              ) : (
                <Link to="/settings">
                  {logo.map((log) => (
                    <img src={log.imgURL} width="80px" alt="emdf" />
                  ))}
                </Link>
              )
            )}

            {logo.map((log) => (
              <p className="logoT">{log.title}</p>
            ))}
          </div>

          {/* <div className="ssearch-bar">
            <input
              type="text"
              className="ssearch-bar__input"
              placeholder="What are you looking for?"
              aria-label="Search"
              onChange={handleSearch}
            />
            <button className="ssearch-bar__submit">
              <Link to="">
                <GrSearch />
              </Link>
            </button>
          </div> */}
          <div className="midSpace"></div>
          <div
            className="snavRight"
            style={
              window.innerWidth <= 750
                ? { display: "none" }
                : { display: "flex" }
            }
          >
            <nav className="navF">
              <div className="selector"></div>
              <ul>
                <li>
                  {check.map((val) =>
                    val.status !== "new" ? (
                      <Link className="homeBtn" to="/">
                        Home
                      </Link>
                    ) : (
                      <Link
                        onClick={() => {
                          alert("Please set up profile first.");
                        }}
                        className="homeBtn"
                        to="/settings"
                      >
                        Home
                      </Link>
                    )
                  )}
                </li>
                {/* <li>
                <button className="saboutBtn" onClick={() => scrolltoTop2()}>
                  ABOUT US
                </button>
              </li> */}

                <li>
                  {user ? (
                    check.map((val) =>
                      val.status !== "new" ? (
                        <Link to="/shop">Shop</Link>
                      ) : (
                        <Link
                          onClick={() => {
                            alert("Please set up profile first.");
                          }}
                          to="/settings"
                        >
                          Shop
                        </Link>
                      )
                    )
                  ) : (
                    <Link to="/">Shop</Link>
                  )}
                </li>

                <li>
                  {user ? (
                    check.map((val) =>
                      val.status !== "new" ? (
                        <Link to="/admininfo">Seller</Link>
                      ) : (
                        <Link
                          onClick={() => {
                            alert("Please set up profile first.");
                          }}
                          to="/settings"
                        >
                          Seller
                        </Link>
                      )
                    )
                  ) : (
                    <Link to="/">Seller</Link>
                  )}
                </li>
                {/* <li>
                <button className="scontactBtn" onClick={() => scrolltoTop()}>
                  CONTACT US
                </button>
              </li> */}
              </ul>
            </nav>
            {user ? (
              check.map((val) =>
                val.status !== "new" ? (
                  <StyledBadge4 badgeContent={msgUnread} color="secondary">
                    <button
                      className="saccLoggedBtn"
                      onMouseEnter={() => {
                        setShowmenu(true);
                      }}
                      onMouseLeave={() => {
                        setShowmenu(false);
                      }}
                    >
                      ACCOUNT
                    </button>
                  </StyledBadge4>
                ) : (
                  <Link
                    onClick={() => {
                      alert("Please set up profile first.");
                    }}
                    className="saccnBtn"
                    to="/settings"
                  >
                    ACCOUNT
                  </Link>
                )
              )
            ) : (
              <Link className="saccnBtn" to="/Signin">
                ACCOUNT
              </Link>
            )}

            {user && (
              <div
                className={showMenu ? "smenuCon smenuShow" : "smenuCon"}
                onMouseEnter={() => {
                  setShowmenu(true);
                }}
                onMouseLeave={() => {
                  setShowmenu(false);
                }}
              >
                <div className="sarrow">
                  <VscTriangleUp />
                </div>
                <div className="smenu">
                  <div className="spcont">
                    {logo.map((log) => (
                      <Link
                        style={{ color: log.color }}
                        to="/profile"
                        className="sprofile"
                      >
                        <Avatar src={user.imgURL} />
                        <div className="sprofileInfo">
                          <h3 style={{ color: log.color }}>{user.firstname}</h3>
                          <p style={{ color: log.color1 }}>{user.email}</p>
                        </div>
                      </Link>
                    ))}
                    <Link to="/settings" className="ssettCon">
                      {logo.map((log) => (
                        <div style={{ color: log.color }} className="ssettIcon">
                          <AiFillSetting />
                        </div>
                      ))}
                      <div className="ssettInfo">
                        {logo.map((log) => (
                          <h3 style={{ color: log.color }}>SETTINGS</h3>
                        ))}
                        {logo.map((log) => (
                          <p style={{ color: log.color1 }}>Edit your profile</p>
                        ))}
                      </div>
                    </Link>

                    <button
                      className="smessageCon"
                      onClick={() => {
                        setToggleMsg(true);
                      }}
                    >
                      {logo.map((log) => (
                        <div className="smessIcon" style={{ color: log.color }}>
                          <BsFillChatFill />
                        </div>
                      ))}
                      <div className="smessInfo">
                        {logo.map((log) => (
                          <StyledBadge3
                            badgeContent={msgUnread}
                            color="secondary"
                          >
                            <h3 style={{ color: log.color }}>Message</h3>
                          </StyledBadge3>
                        ))}
                        {logo.map((log) => (
                          <p style={{ color: log.color1 }}>
                            Take a look at your messages
                          </p>
                        ))}
                      </div>
                    </button>

                    <div className="slogoutBtn">
                      {logo.map((log) => (
                        <Button
                          className="sLogout"
                          variant="contained"
                          color="primary"
                          onClick={() => auth.signOut()}
                          style={{ backgroundColor: log.color }}
                        >
                          Logout
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {user ? (
              check.map((val) =>
                val.status !== "new" ? (
                  <IconButton
                    aria-label="search"
                    color="inherit"
                    onClick={() => history.push("/cart")}
                    className="sbag"
                    style={
                      window.location.pathname === "/cart"
                        ? { backdropFilter: "brightness(80%)" }
                        : { backdropFilter: "brightness(100%)" }
                    }
                  >
                    <StyledBadge
                      badgeContent={x}
                      color="secondary"
                      invisible={
                        window.location.pathname === "/cart"
                          ? true
                          : false || x === 0
                          ? true
                          : false
                      }
                    >
                      <ShoppingCartIcon />
                    </StyledBadge>
                  </IconButton>
                ) : (
                  <IconButton
                    aria-label="search"
                    color="inherit"
                    onClick={() => {
                      alert("Please set up profile first.");
                    }}
                    className="sbag"
                  >
                    <ShoppingCartIcon />
                  </IconButton>
                )
              )
            ) : (
              <IconButton
                aria-label="search"
                color="inherit"
                onClick={() => history.push("/Signin")}
                className="sbag"
              >
                <FaShoppingCart />
              </IconButton>
            )}
          </div>
          {user ? (
            check.map((val) =>
              val.status !== "new" ? (
                <div className="notifCont">
                  <IconButton
                    aria-label="search"
                    color="inherit"
                    onClick={() => {
                      if (shownotif) {
                        setShownotif(false);
                      } else {
                        setShownotif(true);
                      }
                      setShowhamburger(false);
                    }}
                    className="notifBtn"
                    style={
                      shownotif
                        ? { backdropFilter: "brightness(85%)" }
                        : { backdropFilter: "brightness(100%)" }
                    }
                  >
                    <StyledBadge2
                      color="primary"
                      variant="dot"
                      invisible={!invisible}
                    >
                      <CircleNotificationsIcon />
                    </StyledBadge2>
                  </IconButton>

                  <div
                    className={
                      shownotif ? "notifWrapper notifShow" : "notifWrapper"
                    }
                  >
                    <div className="nArrow">
                      <VscTriangleUp />
                    </div>
                    <div className="notifPreview">
                      <div className="content">
                        <div className="notifHeader">
                          <div className="left">
                            <h3>Notifications</h3>
                            <p>You have {newCount} unread notifications</p>
                          </div>
                          <div className="right">
                            <IconButton
                              aria-label="search"
                              color="inherit"
                              className="markReadBtn"
                              onClick={() => {
                                notif.map((item) => {
                                  if (item.status === "unread") {
                                    db.collection("notify")
                                      .doc(item.id)
                                      .update({
                                        status: "read",
                                      });
                                  }
                                  return item;
                                });
                              }}
                            >
                              <DoneAllRoundedIcon />
                            </IconButton>
                          </div>
                        </div>

                        <div className="cardCont">
                          <p className="newTitle">New</p>
                          {newCount > 0 ? (
                            notif
                              .filter((val) => {
                                return val.status === "unread";
                              })
                              .sort((a, b) => {
                                if (a.timestamp < b.timestamp) return 1;
                                if (a.timestamp > b.timestamp) return -1;
                              })
                              .map((val) => (
                                <Button
                                  variant="text"
                                  className="notifCard"
                                  onClick={() => {
                                    db.collection("notify")
                                      .doc(val.id)
                                      .update({
                                        status: "read",
                                      })
                                      .then(() => {
                                        history.push("/profile");
                                      });
                                  }}
                                >
                                  {val.dealmethod === "meetup"
                                    ? logo.map((col) => (
                                        <div className="nMeetupCont">
                                          <div
                                            className="iconCont"
                                            style={{ color: col.color }}
                                          >
                                            <GiShakingHands />
                                          </div>
                                          <div className="LeftCont">
                                            <p>
                                              Meet with seller on{" "}
                                              {val.meetupDate} at{" "}
                                              {val.meetupLocation}
                                            </p>
                                            <p>Receive order: {val.title}</p>
                                            <div className="timeCont">
                                              <div className="clock">
                                                <AccessTimeFilledIcon />
                                              </div>
                                              {val.timestamp
                                                .toDate()
                                                .getDate() === d.getDate() ? (
                                                <p>
                                                  Today{" "}
                                                  {val.timestamp
                                                    .toDate()
                                                    .toLocaleTimeString(
                                                      navigator.language,
                                                      {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                      }
                                                    )}
                                                </p>
                                              ) : (
                                                <p>
                                                  {val.timestamp
                                                    .toDate()
                                                    .toDateString()}{" "}
                                                  {val.timestamp
                                                    .toDate()
                                                    .toLocaleTimeString(
                                                      navigator.language,
                                                      {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                      }
                                                    )}
                                                </p>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      ))
                                    : logo.map((col) => (
                                        <div className="nDeliveryCont">
                                          <div
                                            className="iconCont"
                                            style={{ color: col.color1 }}
                                          >
                                            <LocalShippingIcon />
                                          </div>
                                          <div className="LeftCont">
                                            <p>
                                              Your order will be delivered by{" "}
                                              {val.deliveryDate} at{" "}
                                              {val.deliveryLocation}
                                            </p>
                                            <p>Receive order: {val.title}</p>

                                            <div className="timeCont">
                                              <div className="clock">
                                                <AccessTimeFilledIcon />
                                              </div>
                                              {val.timestamp
                                                .toDate()
                                                .getDate() === d.getDate() ? (
                                                <p>
                                                  Today{" "}
                                                  {val.timestamp
                                                    .toDate()
                                                    .toLocaleTimeString(
                                                      navigator.language,
                                                      {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                      }
                                                    )}
                                                </p>
                                              ) : (
                                                <p>
                                                  {val.timestamp
                                                    .toDate()
                                                    .toDateString()}{" "}
                                                  {val.timestamp
                                                    .toDate()
                                                    .toLocaleTimeString(
                                                      navigator.language,
                                                      {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                      }
                                                    )}
                                                </p>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                </Button>
                              ))
                          ) : (
                            <p
                              style={{
                                color: "rgba(0, 0, 0, 0.336)",
                                paddingLeft: "10px",
                                borderBottom: "1.5px solid rgba(0, 0, 0, 0.2)",
                              }}
                            >
                              No new notifications
                            </p>
                          )}
                          <p className="earlyTitle">Earlier</p>
                          <div className="delNotifWrapper">
                            {earlyCount > 0 ? (
                              notif
                                .filter((val) => {
                                  return val.status === "read";
                                })
                                .sort((a, b) => {
                                  if (a.timestamp < b.timestamp) return 1;
                                  if (a.timestamp > b.timestamp) return -1;
                                })
                                .map((val) => (
                                  <Button
                                    variant="text"
                                    className="notifCard"
                                    onClick={() => {
                                      history.push("/profile");
                                    }}
                                  >
                                    {val.dealmethod === "meetup"
                                      ? logo.map((col) => (
                                          <div className="nMeetupCont">
                                            <div
                                              className="iconCont"
                                              style={{ color: col.color }}
                                            >
                                              <GiShakingHands />
                                            </div>
                                            <div className="LeftCont">
                                              <p>
                                                Meet with seller on{" "}
                                                {val.meetupDate} at{" "}
                                                {val.meetupLocation}
                                              </p>
                                              <p>Receive order: {val.title}</p>
                                              <div className="timeCont">
                                                <div className="clock">
                                                  <AccessTimeFilledIcon />
                                                </div>
                                                {val.timestamp
                                                  .toDate()
                                                  .getDate() === d.getDate() ? (
                                                  <p>
                                                    Today{" "}
                                                    {val.timestamp
                                                      .toDate()
                                                      .toLocaleTimeString(
                                                        navigator.language,
                                                        {
                                                          hour: "2-digit",
                                                          minute: "2-digit",
                                                        }
                                                      )}
                                                  </p>
                                                ) : (
                                                  <p>
                                                    {val.timestamp
                                                      .toDate()
                                                      .toDateString()}{" "}
                                                    {val.timestamp
                                                      .toDate()
                                                      .toLocaleTimeString(
                                                        navigator.language,
                                                        {
                                                          hour: "2-digit",
                                                          minute: "2-digit",
                                                        }
                                                      )}
                                                  </p>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        ))
                                      : logo.map((col) => (
                                          <div className="nDeliveryCont">
                                            <div
                                              className="iconCont"
                                              style={{ color: col.color1 }}
                                            >
                                              <LocalShippingIcon />
                                            </div>
                                            <div className="LeftCont">
                                              <p>
                                                Your order will be delivered by{" "}
                                                {val.deliveryDate} at{" "}
                                                {val.deliveryLocation}
                                              </p>
                                              <p>Receive order: {val.title}</p>
                                              <div className="timeCont">
                                                <div className="clock">
                                                  <AccessTimeFilledIcon />
                                                </div>
                                                {val.timestamp
                                                  .toDate()
                                                  .getDate() === d.getDate() ? (
                                                  <p>
                                                    Today{" "}
                                                    {val.timestamp
                                                      .toDate()
                                                      .toLocaleTimeString(
                                                        navigator.language,
                                                        {
                                                          hour: "2-digit",
                                                          minute: "2-digit",
                                                        }
                                                      )}
                                                  </p>
                                                ) : (
                                                  <p>
                                                    {val.timestamp
                                                      .toDate()
                                                      .toDateString()}{" "}
                                                    {val.timestamp
                                                      .toDate()
                                                      .toLocaleTimeString(
                                                        navigator.language,
                                                        {
                                                          hour: "2-digit",
                                                          minute: "2-digit",
                                                        }
                                                      )}
                                                  </p>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                  </Button>
                                ))
                            ) : (
                              <p
                                style={{
                                  color: "rgba(0, 0, 0, 0.336)",
                                  paddingLeft: "10px",
                                }}
                              >
                                No earlier notifications
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <IconButton
                  aria-label="search"
                  color="inherit"
                  onClick={() => {
                    alert("Please set up profile first.");
                  }}
                  className="notifBtn"
                  style={
                    shownotif
                      ? { backdropFilter: "brightness(85%)" }
                      : { backdropFilter: "brightness(100%)" }
                  }
                >
                  <StyledBadge2
                    color="primary"
                    variant="dot"
                    invisible={!invisible}
                  >
                    <CircleNotificationsIcon />
                  </StyledBadge2>
                </IconButton>
              )
            )
          ) : (
            <IconButton
              aria-label="search"
              color="inherit"
              onClick={() => history.push("/Signin")}
              className="notifBtn"
            >
              <CircleNotificationsIcon />
            </IconButton>
          )}

          {user ? (
            check.map((val) =>
              val.status !== "new" ? (
                <IconButton
                  aria-label="search"
                  color="inherit"
                  onClick={() => history.push("/cart")}
                  className="sbag"
                  style={
                    window.innerWidth <= 750
                      ? window.location.pathname === "cart"
                        ? { display: "flex", backdropFilter: "brightness(80%)" }
                        : {
                            display: "flex",
                            backdropFilter: "brightness(100%)",
                          }
                      : { display: "none" }
                  }
                >
                  <StyledBadge
                    badgeContent={x}
                    color="secondary"
                    invisible={
                      window.location.pathname === "/cart"
                        ? true
                        : false || x === 0
                        ? true
                        : false
                    }
                  >
                    <ShoppingCartIcon />
                  </StyledBadge>
                </IconButton>
              ) : (
                <IconButton
                  aria-label="search"
                  color="inherit"
                  onClick={() => {
                    alert("Please set up profile first.");
                  }}
                  className="sbag"
                  style={
                    window.innerWidth <= 750
                      ? window.location.pathname === "cart"
                        ? { display: "flex", backdropFilter: "brightness(80%)" }
                        : {
                            display: "flex",
                            backdropFilter: "brightness(100%)",
                          }
                      : { display: "none" }
                  }
                >
                  <StyledBadge
                    badgeContent={x}
                    color="secondary"
                    invisible={
                      window.location.pathname === "/cart"
                        ? true
                        : false || x === 0
                        ? true
                        : false
                    }
                  >
                    <ShoppingCartIcon />
                  </StyledBadge>
                </IconButton>
              )
            )
          ) : (
            <IconButton
              aria-label="search"
              color="inherit"
              onClick={() => history.push("/Signin")}
              className="sbag"
              style={
                window.innerWidth <= 750
                  ? { display: "flex" }
                  : { display: "none" }
              }
            >
              <FaShoppingCart />
            </IconButton>
          )}

          <div
            className="hamBurgerCont"
            style={
              window.innerWidth <= 750
                ? { display: "flex" }
                : { display: "none" }
            }
          >
            <IconButton
              color="inherit"
              className="hamburgerBtn"
              onClick={() => {
                let status = "";
                check.map((val) => {
                  status = val.status;
                });
                if (status !== "new") {
                  if (showhamburger) {
                    setShowhamburger(false);
                    setShowmenu2(false);
                  } else {
                    setShowhamburger(true);
                    setShownotif(false);
                  }
                } else {
                  alert("Please setup profile first.");
                }

                console.log(showhamburger);
              }}
            >
              {showhamburger ? (
                <div className="closeHbtn">
                  <CloseRoundedIcon />
                </div>
              ) : (
                <div className="openHbtn">
                  <Badge
                    badgeContent={msgUnread}
                    color="secondary"
                    invisible={msgUnread < 1 ? true : showmenu2 ? true : false}
                  >
                    <MenuRoundedIcon />
                  </Badge>
                </div>
              )}
            </IconButton>
          </div>
          {showhamburger ? (
            <div
              className="optionsContShow"
              style={wY ? { top: "8vh" } : { top: "12vh" }}
            >
              <Button
                className="hBtn"
                variant="text"
                onClick={() => {
                  history.push("/");
                }}
              >
                <HomeIcon /> Home
              </Button>
              <Button
                className="hBtn"
                variant="text"
                onClick={() => {
                  history.push("/shop");
                }}
              >
                <LocalMallRoundedIcon /> Shop
              </Button>
              {admin.map((val) => (
                <Button
                  className="hBtn"
                  variant="text"
                  onClick={() => {
                    history.push("/admininfo");
                  }}
                >
                  <Avatar
                    src={val.imgURL}
                    style={{
                      height: "30px",
                      width: "30px",
                      marginRight: "10px",
                    }}
                  />{" "}
                  Seller
                </Button>
              ))}
              {user ? (
                <Button
                  className="hBtn"
                  variant="text"
                  onClick={() => {
                    if (showmenu2) {
                      setShowmenu2(false);
                    } else {
                      setShowmenu2(true);
                    }
                  }}
                >
                  Account
                  {showmenu2 ? (
                    <div className="accIconContA">
                      <Badge
                        badgeContent={msgUnread}
                        color="secondary"
                        invisible={
                          msgUnread < 1 ? true : showmenu2 ? true : false
                        }
                      >
                        <ArrowBackIosRoundedIcon />
                      </Badge>
                    </div>
                  ) : (
                    <div className="accIconCont">
                      <Badge
                        badgeContent={msgUnread}
                        color="secondary"
                        invisible={
                          msgUnread < 1 ? true : showmenu2 ? true : false
                        }
                      >
                        <AddRoundedIcon />
                      </Badge>
                    </div>
                  )}
                </Button>
              ) : (
                <Button
                  className="hBtn"
                  variant="text"
                  onClick={() => {
                    history.push("/Signin");
                  }}
                >
                  Account
                </Button>
              )}

              {user && (
                <div className={showmenu2 ? "hmenuCon hmenuShow" : "hmenuCon"}>
                  <div className="hmenu">
                    <div className="hpcont">
                      {logo.map((log) => (
                        <Link
                          style={{ color: log.color }}
                          to="/profile"
                          className="hprofile"
                        >
                          <Avatar src={user.imgURL} />
                          <div className="hprofileInfo">
                            <h3 style={{ color: log.color }}>
                              {user.firstname}
                            </h3>
                            <p style={{ color: log.color1 }}>{user.email}</p>
                          </div>
                        </Link>
                      ))}
                      <Link to="/settings" className="hsettCon">
                        {logo.map((log) => (
                          <div
                            style={{ color: log.color }}
                            className="hsettIcon"
                          >
                            <AiFillSetting />
                          </div>
                        ))}
                        <div className="hsettInfo">
                          {logo.map((log) => (
                            <h3 style={{ color: log.color }}>SETTINGS</h3>
                          ))}
                          {logo.map((log) => (
                            <p style={{ color: log.color1 }}>
                              Edit your profile
                            </p>
                          ))}
                        </div>
                      </Link>
                      <button
                        className="hmessageCon"
                        onClick={() => {
                          setToggleMsg(true);
                          setShowhamburger(false);
                        }}
                      >
                        {logo.map((log) => (
                          <div
                            className="hmessIcon"
                            style={{ color: log.color }}
                          >
                            <BsFillChatFill />
                          </div>
                        ))}

                        <div className="hmessInfo">
                          {logo.map((log) => (
                            <StyledBadge3
                              badgeContent={msgUnread}
                              color="secondary"
                            >
                              <h3 style={{ color: log.color }}>Message</h3>
                            </StyledBadge3>
                          ))}

                          {logo.map((log) => (
                            <p style={{ color: log.color1 }}>
                              Take a look at your messages
                            </p>
                          ))}
                        </div>
                      </button>
                      <div className="hlogoutBtn">
                        {logo.map((log) => (
                          <Button
                            className="hLogout"
                            variant="contained"
                            color="primary"
                            onClick={() => auth.signOut()}
                            style={{ backgroundColor: log.color }}
                          >
                            Logout
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <Button
                className="hBtn"
                variant="text"
                onClick={() => {
                  history.push("/cart");
                }}
              >
                <ShoppingCartIcon /> Cart
              </Button>
            </div>
          ) : (
            <div className="optionsCont">
              <Button className="hBtn" variant="text">
                Home
              </Button>
              <Button className="hBtn" variant="text">
                Shop
              </Button>
              <Button className="hBtn" variant="text">
                Account
              </Button>
              <Button className="hBtn" variant="text">
                Cart
              </Button>
            </div>
          )}
        </div>
      ) : (
        logo.map((log) => (
          <div className="snavbar" style={{ backgroundColor: log.color }}>
            <div className="slogo">
              {check.map((val) =>
                val.status !== "new" ? (
                  <Link to="/">
                    {logo.map((log) => (
                      <img src={log.imgURL} width="80px" alt="emdf" />
                    ))}
                  </Link>
                ) : (
                  <Link to="/settings">
                    {logo.map((log) => (
                      <img src={log.imgURL} width="80px" alt="emdf" />
                    ))}
                  </Link>
                )
              )}
              {logo.map((log) => (
                <p className="logoT">{log.title}</p>
              ))}
            </div>

            {/* <div className="ssearch-bar">
              <input
                type="text"
                className="ssearch-bar__input"
                placeholder="What are you looking for?"
                aria-label="Search"
              />
              <button className="ssearch-bar__submit">
                <Link to="">
                  <GrSearch />
                </Link>
              </button>
            </div> */}
            <div className="midSpace"></div>
            <div
              className="snavRight"
              style={
                window.innerWidth <= 750
                  ? { display: "none" }
                  : { display: "flex" }
              }
            >
              <nav>
                <div className="selector"></div>
                <ul>
                  <li>
                    {check.map((val) =>
                      val.status !== "new" ? (
                        <Link className="homeBtn" to="/">
                          Home
                        </Link>
                      ) : (
                        <Link
                          className="homeBtn"
                          onClick={() => {
                            alert("Please set up profile first.");
                          }}
                          to="/settings"
                        >
                          Home
                        </Link>
                      )
                    )}
                  </li>
                  {/* <li>
                <button className="saboutBtn" onClick={() => scrolltoTop2()}>
                  ABOUT US
                </button>
              </li> */}
                  <li>
                    {user ? (
                      check.map((val) =>
                        val.status !== "new" ? (
                          <Link to="/shop">Shop</Link>
                        ) : (
                          <Link
                            onClick={() => {
                              alert("Please set up profile first.");
                            }}
                            to="/settings"
                          >
                            Shop
                          </Link>
                        )
                      )
                    ) : (
                      <Link to="/Signin">Shop</Link>
                    )}
                  </li>
                  <li>
                    {user ? (
                      check.map((val) =>
                        val.status !== "new" ? (
                          <Link to="/admininfo">Seller</Link>
                        ) : (
                          <Link
                            onClick={() => {
                              alert("Please set up profile first.");
                            }}
                            to="/settings"
                          >
                            Seller
                          </Link>
                        )
                      )
                    ) : (
                      <Link to="/">Seller</Link>
                    )}
                  </li>
                  {/* <li>
                <button className="scontactBtn" onClick={() => scrolltoTop()}>
                  CONTACT US
                </button>
              </li> */}
                </ul>
              </nav>
              {user ? (
                check.map((val) =>
                  val.status !== "new" ? (
                    <StyledBadge4 badgeContent={msgUnread} color="secondary">
                      <button
                        className="saccLoggedBtn"
                        onMouseEnter={() => {
                          setShowmenu(true);
                        }}
                        onMouseLeave={() => {
                          setShowmenu(false);
                        }}
                      >
                        ACCOUNT
                      </button>
                    </StyledBadge4>
                  ) : (
                    <Link
                      onClick={() => {
                        alert("Please set up profile first.");
                      }}
                      className="saccnBtn"
                      to="/settings"
                    >
                      ACCOUNT
                    </Link>
                  )
                )
              ) : (
                <Link className="saccnBtn" to="/Signin">
                  ACCOUNT
                </Link>
              )}

              {user && (
                <div className={showMenu ? "smenuCon smenuShow" : "smenuCon"}>
                  <div className="sarrow">
                    <VscTriangleUp />
                  </div>
                  <div className="smenu">
                    <div className="spcont">
                      {logo.map((log) => (
                        <Link
                          style={{ color: log.color }}
                          to="/profile"
                          className="sprofile"
                        >
                          <Avatar src={user.imgURL} />
                          <div className="sprofileInfo">
                            <h3 style={{ color: log.color }}>
                              {user.firstname}
                            </h3>
                            <p style={{ color: log.color1 }}>{user.email}</p>
                          </div>
                        </Link>
                      ))}
                      <Link to="/settings" className="ssettCon">
                        {logo.map((log) => (
                          <div
                            style={{ color: log.color }}
                            className="ssettIcon"
                          >
                            <AiFillSetting />
                          </div>
                        ))}
                        <div className="ssettInfo">
                          {logo.map((log) => (
                            <h3 style={{ color: log.color }}>SETTINGS</h3>
                          ))}
                          {logo.map((log) => (
                            <p style={{ color: log.color1 }}>
                              Edit your profile
                            </p>
                          ))}
                        </div>
                      </Link>
                      <button
                        className="smessageCon"
                        onClick={() => {
                          setToggleMsg(true);
                        }}
                      >
                        {logo.map((log) => (
                          <div
                            className="smessIcon"
                            style={{ color: log.color }}
                          >
                            <BsFillChatFill />
                          </div>
                        ))}

                        <div className="smessInfo">
                          {logo.map((log) => (
                            <StyledBadge3
                              badgeContent={msgUnread}
                              color="secondary"
                            >
                              <h3 style={{ color: log.color }}>Message</h3>
                            </StyledBadge3>
                          ))}

                          {logo.map((log) => (
                            <p style={{ color: log.color1 }}>
                              Take a look at your messages
                            </p>
                          ))}
                        </div>
                      </button>
                      <div className="slogoutBtn">
                        {logo.map((log) => (
                          <Button
                            className="sLogout"
                            variant="contained"
                            color="primary"
                            onClick={() => auth.signOut()}
                            style={{ backgroundColor: log.color }}
                          >
                            Logout
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {user ? (
                check.map((val) =>
                  val.status !== "new" ? (
                    <IconButton
                      aria-label="search"
                      color="inherit"
                      onClick={() => history.push("/cart")}
                      className="sbag"
                      style={
                        window.location.pathname === "/cart"
                          ? { backdropFilter: "brightness(80%)" }
                          : { backdropFilter: "brightness(100%)" }
                      }
                    >
                      <StyledBadge
                        badgeContent={x}
                        color="secondary"
                        invisible={
                          window.location.pathname === "/cart"
                            ? true
                            : false || x === 0
                            ? true
                            : false
                        }
                      >
                        <ShoppingCartIcon />
                      </StyledBadge>
                    </IconButton>
                  ) : (
                    <IconButton
                      aria-label="search"
                      color="inherit"
                      onClick={() => {
                        alert("Please set up profile first.");
                      }}
                      className="sbag"
                    >
                      <ShoppingCartIcon />
                    </IconButton>
                  )
                )
              ) : (
                <IconButton
                  aria-label="search"
                  color="inherit"
                  onClick={() => history.push("/Signin")}
                  className="sbag"
                >
                  <FaShoppingCart />
                </IconButton>
              )}

              {/* <Link to="/cart" className="sbag">
            <FaShoppingCart />
          </Link> */}
              {/* <Button
            variant="contained"
            color="primary"
            className="ssellbtn"
            onClick={() => history.push("/dropzone")}
          >
            SELL
          </Button> */}
              {/* <Link to="/dropzone" className="ssellbtn">
            SELL
          </Link> */}
            </div>

            {user ? (
              check.map((val) =>
                val.status !== "new" ? (
                  <div className="notifCont">
                    <IconButton
                      aria-label="search"
                      color="inherit"
                      onClick={() => {
                        if (shownotif) {
                          setShownotif(false);
                        } else {
                          setShownotif(true);
                        }
                        setShowhamburger(false);
                      }}
                      className="notifBtn"
                      style={
                        shownotif
                          ? { backdropFilter: "brightness(85%)" }
                          : { backdropFilter: "brightness(100%)" }
                      }
                    >
                      <StyledBadge2
                        color="primary"
                        variant="dot"
                        invisible={!invisible}
                      >
                        <CircleNotificationsIcon className="nicon" />
                      </StyledBadge2>
                    </IconButton>

                    <div
                      className={
                        shownotif ? "notifWrapper notifShow" : "notifWrapper"
                      }
                    >
                      <div className="nArrow">
                        <VscTriangleUp />
                      </div>
                      <div className="notifPreview">
                        <div className="content">
                          <div className="notifHeader">
                            <div className="left">
                              <h3>Notifications</h3>
                              <p>You have {newCount} unread notifications</p>
                            </div>
                            <div className="right">
                              <IconButton
                                aria-label="search"
                                color="inherit"
                                className="markReadBtn"
                                onClick={() => {
                                  notif.map((item) => {
                                    if (item.status === "unread") {
                                      db.collection("notify")
                                        .doc(item.id)
                                        .update({
                                          status: "read",
                                        });
                                    }
                                    return item;
                                  });
                                }}
                              >
                                <DoneAllRoundedIcon />
                              </IconButton>
                            </div>
                          </div>

                          <div className="cardCont">
                            <p className="newTitle">New</p>
                            {newCount > 0 ? (
                              notif
                                .filter((val) => {
                                  return val.status === "unread";
                                })
                                .sort((a, b) => {
                                  if (a.timestamp < b.timestamp) return 1;
                                  if (a.timestamp > b.timestamp) return -1;
                                })
                                .map((val) => (
                                  <Button
                                    variant="text"
                                    className="notifCard"
                                    onClick={() => {
                                      db.collection("notify")
                                        .doc(val.id)
                                        .update({
                                          status: "read",
                                        })
                                        .then(() => {
                                          history.push("/profile");
                                        });
                                    }}
                                  >
                                    {val.dealmethod === "meetup"
                                      ? logo.map((col) => (
                                          <div className="nMeetupCont">
                                            <div
                                              className="iconCont"
                                              style={{ color: col.color }}
                                            >
                                              <GiShakingHands />
                                            </div>
                                            <div className="LeftCont">
                                              <p>
                                                Meet with seller on{" "}
                                                {val.meetupDate} at{" "}
                                                {val.meetupLocation}
                                              </p>
                                              <p>Receive order: {val.title}</p>
                                              <div className="timeCont">
                                                <div className="clock">
                                                  <AccessTimeFilledIcon />
                                                </div>
                                                {val.timestamp
                                                  .toDate()
                                                  .getDate() === d.getDate() ? (
                                                  <p>
                                                    Today{" "}
                                                    {val.timestamp
                                                      .toDate()
                                                      .toLocaleTimeString(
                                                        navigator.language,
                                                        {
                                                          hour: "2-digit",
                                                          minute: "2-digit",
                                                        }
                                                      )}
                                                  </p>
                                                ) : (
                                                  <p>
                                                    {val.timestamp
                                                      .toDate()
                                                      .toDateString()}{" "}
                                                    {val.timestamp
                                                      .toDate()
                                                      .toLocaleTimeString(
                                                        navigator.language,
                                                        {
                                                          hour: "2-digit",
                                                          minute: "2-digit",
                                                        }
                                                      )}
                                                  </p>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        ))
                                      : logo.map((col) => (
                                          <div className="nDeliveryCont">
                                            <div
                                              className="iconCont"
                                              style={{ color: col.color1 }}
                                            >
                                              <LocalShippingIcon />
                                            </div>
                                            <div className="LeftCont">
                                              <p>
                                                Your order will be delivered by{" "}
                                                {val.deliveryDate} at{" "}
                                                {val.deliveryLocation}
                                              </p>
                                              <p>Receive order: {val.title}</p>
                                              <div className="timeCont">
                                                <div className="clock">
                                                  <AccessTimeFilledIcon />
                                                </div>
                                                {val.timestamp
                                                  .toDate()
                                                  .getDate() === d.getDate() ? (
                                                  <p>
                                                    Today{" "}
                                                    {val.timestamp
                                                      .toDate()
                                                      .toLocaleTimeString(
                                                        navigator.language,
                                                        {
                                                          hour: "2-digit",
                                                          minute: "2-digit",
                                                        }
                                                      )}
                                                  </p>
                                                ) : (
                                                  <p>
                                                    {val.timestamp
                                                      .toDate()
                                                      .toDateString()}{" "}
                                                    {val.timestamp
                                                      .toDate()
                                                      .toLocaleTimeString(
                                                        navigator.language,
                                                        {
                                                          hour: "2-digit",
                                                          minute: "2-digit",
                                                        }
                                                      )}
                                                  </p>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                  </Button>
                                ))
                            ) : (
                              <p
                                style={{
                                  color: "rgba(0, 0, 0, 0.336)",
                                  paddingLeft: "10px",
                                  borderBottom:
                                    "1.5px solid rgba(0, 0, 0, 0.2)",
                                }}
                              >
                                No new notifications
                              </p>
                            )}
                            <p className="earlyTitle">Earlier</p>
                            <div className="delNotifWrapper">
                              {earlyCount > 0 ? (
                                notif
                                  .filter((val) => {
                                    return val.status === "read";
                                  })
                                  .sort((a, b) => {
                                    if (a.timestamp < b.timestamp) return 1;
                                    if (a.timestamp > b.timestamp) return -1;
                                  })
                                  .map((val) => (
                                    <Button
                                      variant="text"
                                      className="notifCard"
                                      onClick={() => {
                                        history.push("/profile");
                                      }}
                                    >
                                      {val.dealmethod === "meetup"
                                        ? logo.map((col) => (
                                            <div className="nMeetupCont">
                                              <div
                                                className="iconCont"
                                                style={{ color: col.color }}
                                              >
                                                <GiShakingHands />
                                              </div>
                                              <div className="LeftCont">
                                                <p>
                                                  Meet with seller on{" "}
                                                  {val.meetupDate} at{" "}
                                                  {val.meetupLocation}
                                                </p>
                                                <p>
                                                  Receive order: {val.title}
                                                </p>
                                                <div className="timeCont">
                                                  <div className="clock">
                                                    <AccessTimeFilledIcon />
                                                  </div>
                                                  {val.timestamp
                                                    .toDate()
                                                    .getDate() ===
                                                  d.getDate() ? (
                                                    <p>
                                                      Today{" "}
                                                      {val.timestamp
                                                        .toDate()
                                                        .toLocaleTimeString(
                                                          navigator.language,
                                                          {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                          }
                                                        )}
                                                    </p>
                                                  ) : (
                                                    <p>
                                                      {val.timestamp
                                                        .toDate()
                                                        .toDateString()}{" "}
                                                      {val.timestamp
                                                        .toDate()
                                                        .toLocaleTimeString(
                                                          navigator.language,
                                                          {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                          }
                                                        )}
                                                    </p>
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                          ))
                                        : logo.map((col) => (
                                            <div className="nDeliveryCont">
                                              <div
                                                className="iconCont"
                                                style={{ color: col.color1 }}
                                              >
                                                <LocalShippingIcon />
                                              </div>
                                              <div className="LeftCont">
                                                <p>
                                                  Your order will be delivered
                                                  by {val.deliveryDate} at{" "}
                                                  {val.deliveryLocation}
                                                </p>
                                                <p>
                                                  Receive order: {val.title}
                                                </p>
                                                <div className="timeCont">
                                                  <div className="clock">
                                                    <AccessTimeFilledIcon />
                                                  </div>
                                                  {val.timestamp
                                                    .toDate()
                                                    .getDate() ===
                                                  d.getDate() ? (
                                                    <p>
                                                      Today{" "}
                                                      {val.timestamp
                                                        .toDate()
                                                        .toLocaleTimeString(
                                                          navigator.language,
                                                          {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                          }
                                                        )}
                                                    </p>
                                                  ) : (
                                                    <p>
                                                      {val.timestamp
                                                        .toDate()
                                                        .toDateString()}{" "}
                                                      {val.timestamp
                                                        .toDate()
                                                        .toLocaleTimeString(
                                                          navigator.language,
                                                          {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                          }
                                                        )}
                                                    </p>
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                          ))}
                                    </Button>
                                  ))
                              ) : (
                                <p
                                  style={{
                                    color: "rgba(0, 0, 0, 0.336)",
                                    paddingLeft: "10px",
                                  }}
                                >
                                  No earlier notifications
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <IconButton
                    aria-label="search"
                    color="inherit"
                    onClick={() => {
                      alert("Please set up profile first.");
                    }}
                    className="notifBtn"
                    style={
                      shownotif
                        ? { backdropFilter: "brightness(85%)" }
                        : { backdropFilter: "brightness(100%)" }
                    }
                  >
                    <StyledBadge2
                      color="primary"
                      variant="dot"
                      invisible={!invisible}
                    >
                      <CircleNotificationsIcon />
                    </StyledBadge2>
                  </IconButton>
                )
              )
            ) : (
              <IconButton
                aria-label="search"
                color="inherit"
                className="notifBtn"
                onClick={() => history.push("/Signin")}
              >
                <CircleNotificationsIcon />
              </IconButton>
            )}

            {user ? (
              check.map((val) =>
                val.status !== "new" ? (
                  <IconButton
                    aria-label="search"
                    color="inherit"
                    onClick={() => history.push("/cart")}
                    className="sbag"
                    style={
                      window.innerWidth <= 750
                        ? { display: "flex" }
                        : { display: "none" }
                    }
                  >
                    <StyledBadge
                      badgeContent={x}
                      color="secondary"
                      invisible={
                        window.location.pathname === "/cart"
                          ? true
                          : false || x === 0
                          ? true
                          : false
                      }
                    >
                      <ShoppingCartIcon />
                    </StyledBadge>
                  </IconButton>
                ) : (
                  <IconButton
                    aria-label="search"
                    color="inherit"
                    onClick={() => {
                      alert("Please set up profile first.");
                    }}
                    className="sbag"
                    style={
                      window.innerWidth <= 750
                        ? window.location.pathname === "cart"
                          ? {
                              display: "flex",
                              backdropFilter: "brightness(80%)",
                            }
                          : {
                              display: "flex",
                              backdropFilter: "brightness(100%)",
                            }
                        : { display: "none" }
                    }
                  >
                    <ShoppingCartIcon />
                  </IconButton>
                )
              )
            ) : (
              <IconButton
                aria-label="search"
                color="inherit"
                onClick={() => history.push("/Signin")}
                className="sbag"
                style={
                  window.innerWidth <= 750
                    ? { display: "flex" }
                    : { display: "none" }
                }
              >
                <FaShoppingCart />
              </IconButton>
            )}

            <div
              className="hamBurgerCont"
              style={
                window.innerWidth <= 750
                  ? { display: "flex" }
                  : { display: "none" }
              }
            >
              <IconButton
                color="inherit"
                className="hamburgerBtn"
                onClick={() => {
                  let status = "";
                  check.map((val) => {
                    status = val.status;
                  });
                  if (status !== "new") {
                    if (showhamburger) {
                      setShowhamburger(false);
                      setShowmenu2(false);
                    } else {
                      setShowhamburger(true);
                      setShownotif(false);
                    }
                  } else {
                    alert("Please setup profile first.");
                  }

                  console.log(showhamburger);
                }}
              >
                {showhamburger ? (
                  <div className="closeHbtn">
                    <CloseRoundedIcon />
                  </div>
                ) : (
                  <div className="openHbtn">
                    <Badge
                      badgeContent={msgUnread}
                      color="secondary"
                      invisible={
                        msgUnread < 1 ? true : showmenu2 ? true : false
                      }
                    >
                      <MenuRoundedIcon />
                    </Badge>
                  </div>
                )}
              </IconButton>
            </div>
            {showhamburger ? (
              <div
                className="optionsContShow"
                style={wY ? { top: "8vh" } : { top: "12vh" }}
              >
                <Button
                  className="hBtn"
                  variant="text"
                  onClick={() => {
                    history.push("/");
                  }}
                >
                  <HomeIcon /> Home
                </Button>
                <Button
                  className="hBtn"
                  variant="text"
                  onClick={() => {
                    history.push("/shop");
                  }}
                >
                  <LocalMallRoundedIcon /> Shop
                </Button>
                {admin.map((val) => (
                  <Button
                    className="hBtn"
                    variant="text"
                    onClick={() => {
                      history.push("/admininfo");
                    }}
                  >
                    <Avatar
                      src={val.imgURL}
                      style={{
                        height: "30px",
                        width: "30px",
                        marginRight: "10px",
                      }}
                    />{" "}
                    Seller
                  </Button>
                ))}

                {user ? (
                  <Button
                    className="hBtn"
                    variant="text"
                    onClick={() => {
                      if (showmenu2) {
                        setShowmenu2(false);
                      } else {
                        setShowmenu2(true);
                      }
                    }}
                  >
                    Account
                    {showmenu2 ? (
                      <div className="accIconContA">
                        <Badge
                          badgeContent={msgUnread}
                          color="secondary"
                          invisible={
                            msgUnread < 1 ? true : showmenu2 ? true : false
                          }
                        >
                          <ArrowBackIosRoundedIcon />
                        </Badge>
                      </div>
                    ) : (
                      <div className="accIconCont">
                        <Badge
                          badgeContent={msgUnread}
                          color="secondary"
                          invisible={
                            msgUnread < 1 ? true : showmenu2 ? true : false
                          }
                        >
                          <AddRoundedIcon />
                        </Badge>
                      </div>
                    )}
                  </Button>
                ) : (
                  <Button
                    className="hBtn"
                    variant="text"
                    onClick={() => {
                      history.push("/Signin");
                    }}
                  >
                    Account
                  </Button>
                )}

                {user && (
                  <div
                    className={showmenu2 ? "hmenuCon hmenuShow" : "hmenuCon"}
                  >
                    <div className="hmenu">
                      <div className="hpcont">
                        {logo.map((log) => (
                          <Link
                            style={{ color: log.color }}
                            to="/profile"
                            className="hprofile"
                          >
                            <Avatar src={user.imgURL} />
                            <div className="hprofileInfo">
                              <h3 style={{ color: log.color }}>
                                {user.firstname}
                              </h3>
                              <p style={{ color: log.color1 }}>{user.email}</p>
                            </div>
                          </Link>
                        ))}
                        <Link to="/settings" className="hsettCon">
                          {logo.map((log) => (
                            <div
                              style={{ color: log.color }}
                              className="hsettIcon"
                            >
                              <AiFillSetting />
                            </div>
                          ))}
                          <div className="hsettInfo">
                            {logo.map((log) => (
                              <h3 style={{ color: log.color }}>SETTINGS</h3>
                            ))}
                            {logo.map((log) => (
                              <p style={{ color: log.color1 }}>
                                Edit your profile
                              </p>
                            ))}
                          </div>
                        </Link>
                        <button
                          className="hmessageCon"
                          onClick={() => {
                            setToggleMsg(true);
                            setShowhamburger(false);
                          }}
                        >
                          {logo.map((log) => (
                            <div
                              className="hmessIcon"
                              style={{ color: log.color }}
                            >
                              <BsFillChatFill />
                            </div>
                          ))}

                          <div className="hmessInfo">
                            {logo.map((log) => (
                              <StyledBadge3
                                badgeContent={msgUnread}
                                color="secondary"
                              >
                                <h3 style={{ color: log.color }}>Message</h3>
                              </StyledBadge3>
                            ))}

                            {logo.map((log) => (
                              <p style={{ color: log.color1 }}>
                                Take a look at your messages
                              </p>
                            ))}
                          </div>
                        </button>
                        <div className="hlogoutBtn">
                          {logo.map((log) => (
                            <Button
                              className="hLogout"
                              variant="contained"
                              color="primary"
                              onClick={() => auth.signOut()}
                              style={{ backgroundColor: log.color }}
                            >
                              Logout
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <Button
                  className="hBtn"
                  variant="text"
                  onClick={() => {
                    history.push("/cart");
                  }}
                >
                  <ShoppingCartIcon /> Cart
                </Button>
              </div>
            ) : (
              <div className="optionsCont">
                <Button className="hBtn" variant="text">
                  Home
                </Button>
                <Button className="hBtn" variant="text">
                  Shop
                </Button>
                <Button className="hBtn" variant="text">
                  Account
                </Button>
                <Button className="hBtn" variant="text">
                  Cart
                </Button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
export default Nav;
