import React, { useState, useEffect, useRef } from "react";
import Sendmessage from "../../components/SendMessage/Sendmessage";
import "./Message.scss";
import Nav from "../../components/nav/Nav";
import { firestore, auth } from "../../firebase/config";
import Aos from "aos";
import Avatar from "@mui/material/Avatar";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import IconButton from "@material-ui/core/IconButton";
import { useHistory } from "react-router-dom";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

function Message({ toggleMsg, setToggleMsg }) {
  const [useruid, setUseruid] = useState(null);
  const [user, setUser] = useState(null);
  const db = firestore;
  const scroll = useRef();
  const history = useHistory();
  window.addEventListener("scroll", function () {
    if (window.scrollY > 1) {
      try {
        this.document.getElementById("msgSubCont").style.height = "91vh";
        this.document.getElementById("msgSubCont").style.borderTop = "none";
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        this.document.getElementById("msgSubCont").style.height = "88vh";
      } catch (err) {
        console.log(err);
      }
    }
  });

  // document.getElementById("outMsg").addEventListener("scroll", function () {
  //   console.log("scroll: ", document.getElementById("outMsg").scrollTop);
  //   if (
  //     document.getElementById("outMsg").scrollHeight -
  //       document.getElementById("outMsg").scrollTop >
  //     1000
  //   ) {
  //     setShowArrowDown(true);
  //   } else {
  //     setShowArrowDown(false);
  //   }
  // });

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

  const scrollToBottom = () => {
    try {
      scroll.current.scrollIntoView({
        behavior: "smooth",
      });
    } catch (err) {
      console.log(err);
    }
  };

  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const db = firestore;
      db.collection("messages " + useruid)
        .orderBy("createdAt")
        .onSnapshot({ includeMetadataChanges: true }, (snapshot) => {
          const newMessage = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
            selector: false,
          }));
          setMessages(newMessage);
          if (scroll !== null) {
            scrollToBottom();
          }
        });
    };
    fetchData();
  }, [useruid]);

  messages.map((val) => {
    if (val.status === "unread" && val.userID === "admin") {
      db.collection("messages " + useruid)
        .doc(val.id)
        .update({
          status: "seen",
        });
    }
    return val;
  });

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

  var now = new Date();
  const [shownotif, setShownotif] = useState(false);
  const [showArrowDown, setShowArrowDown] = useState(false);

  return (
    <div>
      {/* <div className="navCont">
        <Nav shownotif={shownotif} setShownotif={setShownotif} />
      </div> */}

      <div
        className={
          toggleMsg ? "messageSubCont messageSubContShow" : "messageSubCont"
        }
        id="msgSubCont"
        onClick={() => {
          setShownotif(false);
        }}
      >
        {admin.map((val) => (
          <div className="messageTop">
            <IconButton
              className="closeMsgBtn"
              onClick={() => {
                setToggleMsg(false);
              }}
            >
              <CloseRoundedIcon />
            </IconButton>
            {/* <div className="arrowBackCont">
              <IconButton
                onClick={() => {
                  history.goBack();
                }}
              >
                <ArrowBackIosRoundedIcon />
              </IconButton>
            </div> */}
            <Avatar
              alt="Remy Sharp"
              src={val.imgURL}
              style={{ cursor: "pointer" }}
              onClick={() => {
                history.push("/admininfo");
              }}
            />
            <div
              className="adName"
              style={{ cursor: "pointer" }}
              onClick={() => {
                history.push("/admininfo");
              }}
            >
              <h3>
                {val.firstname} {val.lastname}
              </h3>
              <p>Seller</p>
            </div>
          </div>
        ))}
        <IconButton
          className={
            showArrowDown ? "scrollDownBtn scrollDownBtnShow" : "scrollDownBtn"
          }
          onClick={() => {
            scroll.current.scrollIntoView({
              behavior: "smooth",
            });
          }}
        >
          <KeyboardArrowDownRoundedIcon />
        </IconButton>
        <div className="messagesCont" id="outMsg">
          {messages.length > 0 ? (
            messages.map((val) =>
              val.type === "text" ? (
                <div
                  className={
                    val.userID === useruid
                      ? "msgWrapper msgWrapSend"
                      : "msgWrapper"
                  }
                >
                  <div
                    className="statWrap"
                    style={
                      val.userID === useruid
                        ? { justifyContent: "flex-start" }
                        : { justifyContent: "flex-end" }
                    }
                  >
                    {val.userID === useruid && (
                      <div className="dateCont" style={{ fontSize: "x-small" }}>
                        {val.createdAt !== null &&
                          (val.createdAt.toDate().getFullYear() ===
                          now.getFullYear() ? (
                            val.createdAt.toDate().getMonth() ===
                            now.getMonth() ? (
                              val.createdAt.toDate().getDate() ===
                              now.getDate() ? (
                                val.createdAt !== null && (
                                  <p>
                                    Today{" "}
                                    {val.createdAt
                                      .toDate()
                                      .toLocaleTimeString(navigator.language, {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                  </p>
                                )
                              ) : (
                                <p>
                                  {val.createdAt.toDate().toDateString()}{" "}
                                  {val.createdAt
                                    .toDate()
                                    .toLocaleTimeString(navigator.language, {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                </p>
                              )
                            ) : (
                              <p>
                                {val.createdAt.toDate().toDateString()}{" "}
                                {val.createdAt
                                  .toDate()
                                  .toLocaleTimeString(navigator.language, {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                              </p>
                            )
                          ) : (
                            <p>
                              {val.createdAt.toDate().toDateString()}{" "}
                              {val.createdAt
                                .toDate()
                                .toLocaleTimeString(navigator.language, {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                            </p>
                          ))}
                      </div>
                    )}
                    {val.userID !== useruid && (
                      <div
                        className="dateCont2"
                        style={{ fontSize: "x-small" }}
                      >
                        {val.createdAt !== null &&
                          (val.createdAt.toDate().getFullYear() ===
                          now.getFullYear() ? (
                            val.createdAt.toDate().getMonth() ===
                            now.getMonth() ? (
                              val.createdAt.toDate().getDate() ===
                              now.getDate() ? (
                                <p>
                                  Today{" "}
                                  {val.createdAt
                                    .toDate()
                                    .toLocaleTimeString(navigator.language, {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                </p>
                              ) : now.getDate() -
                                  val.createdAt.toDate().getDate() ===
                                1 ? (
                                <p>
                                  Yesterday{" "}
                                  {val.createdAt
                                    .toDate()
                                    .toLocaleTimeString(navigator.language, {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                </p>
                              ) : (
                                <p>
                                  {val.createdAt.toDate().toDateString()}{" "}
                                  {val.createdAt
                                    .toDate()
                                    .toLocaleTimeString(navigator.language, {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                </p>
                              )
                            ) : (
                              <p>
                                {val.createdAt.toDate().toDateString()}{" "}
                                {val.createdAt
                                  .toDate()
                                  .toLocaleTimeString(navigator.language, {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                              </p>
                            )
                          ) : (
                            <p>
                              {val.createdAt.toDate().toDateString()}{" "}
                              {val.createdAt
                                .toDate()
                                .toLocaleTimeString(navigator.language, {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                            </p>
                          ))}
                      </div>
                    )}
                    <div
                      className={
                        val.userID === useruid
                          ? "messageCont messageContSend"
                          : "messageCont"
                      }
                    >
                      <div
                        className={
                          val.userID === useruid
                            ? "messages messageSend"
                            : "messages"
                        }
                      >
                        <p className="msgText">{val.text}</p>
                      </div>
                    </div>
                    {val.userID === useruid ? (
                      <p
                        className="status"
                        style={
                          val.clicked === true
                            ? { display: "block", transition: "0.5s" }
                            : { display: "none", transition: "0.5s" }
                        }
                      >
                        {val.status === "unread" ? "Delivered" : "Seen"}
                      </p>
                    ) : (
                      <div></div>
                    )}
                  </div>
                </div>
              ) : (
                <div
                  className={
                    val.userID === useruid
                      ? "msgImgCont msgImgContSend"
                      : "msgImgCont"
                  }
                >
                  <div className="wraps">
                    <div className="imgDateCont">
                      {val.createdAt !== null &&
                        (val.createdAt.toDate().getFullYear() ===
                        now.getFullYear() ? (
                          val.createdAt.toDate().getMonth() ===
                          now.getMonth() ? (
                            val.createdAt.toDate().getDate() ===
                            now.getDate() ? (
                              <p>
                                Today{" "}
                                {val.createdAt
                                  .toDate()
                                  .toLocaleTimeString(navigator.language, {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                              </p>
                            ) : now.getDate() -
                                val.createdAt.toDate().getDate() ===
                              1 ? (
                              <p>
                                Yesterday{" "}
                                {val.createdAt
                                  .toDate()
                                  .toLocaleTimeString(navigator.language, {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                              </p>
                            ) : (
                              <p>
                                {val.createdAt.toDate().toDateString()}{" "}
                                {val.createdAt
                                  .toDate()
                                  .toLocaleTimeString(navigator.language, {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                              </p>
                            )
                          ) : (
                            <p>
                              {val.createdAt.toDate().toDateString()}{" "}
                              {val.createdAt
                                .toDate()
                                .toLocaleTimeString(navigator.language, {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                            </p>
                          )
                        ) : (
                          <p>
                            {val.createdAt.toDate().toDateString()}{" "}
                            {val.createdAt
                              .toDate()
                              .toLocaleTimeString(navigator.language, {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                          </p>
                        ))}
                    </div>
                    <div className="msgImgWrap">
                      <img src={val.imgURLs} alt="Creatheme" />
                    </div>
                  </div>
                </div>
              )
            )
          ) : (
            <div className="noMessage">No new message</div>
          )}
          <div ref={scroll}></div>
        </div>
        <div className="sendCont">
          <Sendmessage
            scrollToBottom={scrollToBottom}
            scroll={scroll}
            messages={messages}
          />
        </div>
      </div>
    </div>
  );
}

export default Message;
