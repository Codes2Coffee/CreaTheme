import React, { useState, useEffect, useRef, createRef } from "react";
import "./Adminchat.scss";
import { firestore, storage } from "../../firebase/config";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import firebase from "firebase";
import { BsFillChatFill } from "react-icons/bs";
import Tooltip from "@mui/material/Tooltip";
import { id } from "date-fns/locale";
import { styled } from "@mui/material/styles";
import gsap from "gsap";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import Badge from "@material-ui/core/Badge";
import Emoji from "../Emoji/Emojis";

const useStyles = makeStyles((theme) => ({
  root: {
    "&>*": {
      margin: theme.spacing(1),
    },
  },
  input: {
    display: "none",
  },
}));

function Adminchat() {
  const db = firestore;
  const [muser, setMuser] = useState([]);
  const scroll = useRef();

  useEffect(() => {
    const fetchData = async () => {
      const db = firestore;
      db.collection("messaged").onSnapshot((snapshot) => {
        const newUser = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setMuser(newUser);
      });
    };
    fetchData();
  }, []);
  const [userget, setUserget] = useState("");

  const StyledBadge2 = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      padding: "0 4px",
      backgroundColor: "#EB002D",
    },
  }));

  const scrollToBottom = () => {
    try {
      scroll.current.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      console.log(err);
    }
  };

  const ColorButton = styled(Button)(({ theme }) => ({
    "&:hover": {
      backgroundColor: "#edeff1",
    },
  }));

  const [user, setUser] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const db = firestore;
      db.collection("users").onSnapshot((snapshot) => {
        const newUser = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setUser(newUser);
      });
    };
    fetchData();
  }, []);

  const [msg, setMsg] = useState("");
  const [lmsg, setLmsg] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const db = firestore;
      db.collection("messaged")
        .orderBy("createdAt", "desc")
        .limit(1)
        .onSnapshot((snapshot) => {
          const newUser = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          setLmsg(newUser);
          //   setUserget(newUser.id);
        });
    };
    fetchData();
  }, []);

  const inputRef = createRef();
  const [showEmoji, setShowemoji] = useState(true);
  const [cursorposition, setCursorposition] = useState();

  const pickEmoji = (e, { emoji }) => {
    const ref = inputRef.current;
    ref.focus();
    const start = msg.substring(0, ref.selectionStart);
    const end = msg.substring(ref.selectionStart);
    const txt = start + emoji + end;
    setMsg(txt);
    setCursorposition(start.length + emoji.length);
  };

  const handleShowEmoji = () => {
    inputRef.current.focus();
    setShowemoji(!showEmoji);
  };

  let latest = "";
  lmsg.map((val) => (latest = val.userID));

  console.log(latest);
  const [select, setSelect] = useState(false);

  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const db = firestore;
      db.collection("messages " + userget)
        .orderBy("createdAt")
        .onSnapshot({ includeMetadataChanges: true }, (snapshot) => {
          const newMessage = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          setMessages(newMessage);
          if (userget !== "") {
            scrollToBottom();
          }
        });
    };
    fetchData();
  }, [userget]);

  const hasUser = muser.some((val) => {
    return val.userID === userget;
  });

  let getmid;

  muser.map((val) => {
    if (val.userID === userget) {
      getmid = val.id;
    }
    return val;
  });

  async function sendMessage(e) {
    e.preventDefault();
    if (muser.length > 0) {
      if (msg.trim() !== "") {
        if (hasUser) {
          await db
            .collection("messaged")
            .doc(getmid)
            .update({
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            })
            .then(async () => {
              await db.collection("messages " + userget).add({
                type: "text",
                text: msg.trim(),
                userID: "admin",
                sendto: userget,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                status: "unread",
              });
              setMsg("");
            })
            .then(() => {
              messages.map((val) => {
                if (val.status === "unread" && val.userID !== "admin") {
                  db.collection("messages " + userget)
                    .doc(val.id)
                    .update({
                      status: "seen",
                    });
                }
                return val;
              });
            });
        } else {
          await db
            .collection("messaged")
            .add({
              userID: userget,
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            })
            .then(async () => {
              await db.collection("messages " + userget).add({
                type: "text",
                text: msg.trim(),
                userID: "admin",
                sendto: userget,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                status: "unread",
              });
              setMsg("");
            });
        }
      } else {
        setMsg("");
      }
    } else {
      setMsg("");
    }
  }

  const [imgSubmit, setImgSubmit] = useState(false);
  const handleImgSend = (e) => {
    setImgSubmit(true);
    const img = e.target.files[0];
    const imgu = URL.createObjectURL(e.target.files[0]);
    const uploadTask = storage.ref(`messageImg/${img.name}`).put(img);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
      },
      (error) => {
        console.log(error);
      },
      async () => {
        try {
          let imgURLs = "";
          if (imgu) {
            const res = await fetch(imgu);
            const blob = await res.blob();

            const imgRef = storage.ref().child(`messageImg/${img.name}`);
            await imgRef.put(blob);

            imgURLs = await imgRef.getDownloadURL();
          }

          if (hasUser) {
            await firestore
              .collection("messaged")
              .doc(getmid)
              .update({
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
              })
              .then(async () => {
                await db
                  .collection("messages " + userget)
                  .doc()
                  .set({
                    type: "img",
                    userID: "admin",
                    sendto: userget,
                    imgURLs,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    status: "unread",
                  });
              });
          } else {
            await db
              .collection("messaged")
              .add({
                userID: userget,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
              })
              .then(async () => {
                await db
                  .collection("messages " + userget)
                  .doc()
                  .set({
                    type: "img",
                    userID: "admin",
                    sendto: userget,
                    imgURLs,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    status: "unread",
                  });
              });
          }
        } catch (err) {
          console.log(err.message);
        }
      }
    );
  };

  const handleChatClick = () => {
    messages.map((val) => {
      if (val.status === "unread" && val.userID !== "admin") {
        db.collection("messages " + userget)
          .doc(val.id)
          .update({
            status: "seen",
          });
      }
      return val;
    });
  };

  //aniSend
  document.querySelectorAll(".button").forEach((button) => {
    let getVar = (variable) =>
      getComputedStyle(button).getPropertyValue(variable);

    if (muser.length > 0) {
      if (msg.trim() !== "") {
        button.addEventListener("click", (e) => {
          if (!button.classList.contains("active")) {
            button.classList.add("active");

            gsap.to(button, {
              keyframes: [
                {
                  "--left-wing-first-x": 50,
                  "--left-wing-first-y": 100,
                  "--right-wing-second-x": 50,
                  "--right-wing-second-y": 100,
                  duration: 0.2,
                  onComplete() {
                    gsap.set(button, {
                      "--left-wing-first-y": 0,
                      "--left-wing-second-x": 40,
                      "--left-wing-second-y": 100,
                      "--left-wing-third-x": 0,
                      "--left-wing-third-y": 100,
                      "--left-body-third-x": 40,
                      "--right-wing-first-x": 50,
                      "--right-wing-first-y": 0,
                      "--right-wing-second-x": 60,
                      "--right-wing-second-y": 100,
                      "--right-wing-third-x": 100,
                      "--right-wing-third-y": 100,
                      "--right-body-third-x": 60,
                    });
                  },
                },
                {
                  "--left-wing-third-x": 20,
                  "--left-wing-third-y": 90,
                  "--left-wing-second-y": 90,
                  "--left-body-third-y": 90,
                  "--right-wing-third-x": 80,
                  "--right-wing-third-y": 90,
                  "--right-body-third-y": 90,
                  "--right-wing-second-y": 90,
                  duration: 0.2,
                },
                {
                  "--rotate": 50,
                  "--left-wing-third-y": 95,
                  "--left-wing-third-x": 27,
                  "--right-body-third-x": 45,
                  "--right-wing-second-x": 45,
                  "--right-wing-third-x": 60,
                  "--right-wing-third-y": 83,
                  duration: 0.25,
                },
                {
                  "--rotate": 55,
                  "--plane-x": -8,
                  "--plane-y": 24,
                  duration: 0.2,
                },
                {
                  "--rotate": 40,
                  "--plane-x": 45,
                  "--plane-y": -180,
                  "--plane-opacity": 0,
                  duration: 0.3,
                  onComplete() {
                    setTimeout(() => {
                      button.removeAttribute("style");
                      gsap.fromTo(
                        button,
                        {
                          opacity: 0,
                          y: -8,
                        },
                        {
                          opacity: 1,
                          y: 0,
                          clearProps: true,
                          duration: 0.3,
                          onComplete() {
                            button.classList.remove("active");
                          },
                        }
                      );
                    }, 2000);
                  },
                },
              ],
            });

            gsap.to(button, {
              keyframes: [
                {
                  "--text-opacity": 0,
                  "--border-radius": 0,
                  "--left-wing-background": getVar("--primary-darkest"),
                  "--right-wing-background": getVar("--primary-darkest"),
                  duration: 0.1,
                },
                {
                  "--left-wing-background": getVar("--primary"),
                  "--right-wing-background": getVar("--primary"),
                  duration: 0.1,
                },
                {
                  "--left-body-background": getVar("--primary-dark"),
                  "--right-body-background": getVar("--primary-darkest"),
                  duration: 0.4,
                },
                {
                  "--success-opacity": 1,
                  "--success-scale": 1,
                  duration: 0.25,
                  delay: 0.25,
                },
              ],
            });
          }
        });
      }
    }
  });

  var now = new Date();
  const classes = useStyles();

  return (
    <div>
      <h2>Chats</h2>
      {/* {messages.length > 0 ? ( */}
      <div className="adminChatCont">
        <div className="leftCont">
          {muser.length > 0 ? (
            muser
              .sort((a, b) => {
                if (a.createdAt < b.createdAt) return 1;
                if (a.createdAt > b.createdAt) return -1;
              })
              .map((item) => (
                <div className="messageCard">
                  {user
                    .filter((val) => {
                      return item.userID === val.id;
                    })
                    .map((val) => (
                      <Button
                        variant="text"
                        className="userInfoCont"
                        onClick={() => {
                          setUserget(item.userID);
                          handleChatClick();
                          setSelect(!select);
                        }}
                        style={
                          userget === item.userID
                            ? { backgroundColor: "#EDEFF1" }
                            : { backgroundColor: "#fff" }
                        }
                      >
                        <Avatar src={val.imgURL} alt="userImg" />
                        <div className="nameWrap">
                          <h3 className="nameCont">{val.firstname}</h3>
                          <h3 className="nameCont">{val.lastname}</h3>
                        </div>
                        <div className="botWrap">
                          <p></p>
                        </div>
                      </Button>
                    ))}
                </div>
              ))
          ) : (
            <div></div>
          )}
          <p>All users</p>
          {user.length > 0 ? (
            user.map((val) => (
              <div className="messageCard2">
                <Button
                  variant="text"
                  className="userInfoCont2"
                  onClick={() => {
                    setUserget(val.id);
                  }}
                  style={
                    userget === val.id
                      ? { backgroundColor: "#EDEFF1" }
                      : { backgroundColor: "#fff" }
                  }
                >
                  <Avatar src={val.imgURL} alt="userImg" />
                  <div className="nameWrap2">
                    <h3 className="nameCont2">{val.firstname}</h3>
                    <h3 className="nameCont2">{val.lastname}</h3>
                  </div>
                  <div className="botWrap">
                    <p></p>
                  </div>
                </Button>
              </div>
            ))
          ) : (
            <div></div>
          )}
        </div>
        <div className="messagesCont" id="out">
          {userget !== "" ? (
            <div className="messageContent" id="inside">
              {messages.length > 0 ? (
                messages.map((msg) =>
                  msg.type === "text" ? (
                    <div
                      className={
                        msg.userID === "admin"
                          ? "msgWrapper msgWrapSend"
                          : "msgWrapper"
                      }
                    >
                      <div className="statWrap">
                        {msg.userID === "admin" && (
                          <div
                            className="dateCont"
                            style={{ fontSize: "x-small" }}
                          >
                            {msg.createdAt !== null &&
                              (msg.createdAt.toDate().getFullYear() ===
                              now.getFullYear() ? (
                                msg.createdAt.toDate().getMonth() ===
                                now.getMonth() ? (
                                  msg.createdAt.toDate().getDate() ===
                                  now.getDate() ? (
                                    <p>
                                      Today{" "}
                                      {msg.createdAt
                                        .toDate()
                                        .toLocaleTimeString(
                                          navigator.language,
                                          {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          }
                                        )}
                                    </p>
                                  ) : now.getDate() -
                                      msg.createdAt.toDate().getDate() ===
                                    1 ? (
                                    <p>
                                      Yesterday{" "}
                                      {msg.createdAt
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
                                      {msg.createdAt.toDate().toDateString()}{" "}
                                      {msg.createdAt
                                        .toDate()
                                        .toLocaleTimeString(
                                          navigator.language,
                                          {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          }
                                        )}
                                    </p>
                                  )
                                ) : (
                                  <p>
                                    {msg.createdAt.toDate().toDateString()}{" "}
                                    {msg.createdAt
                                      .toDate()
                                      .toLocaleTimeString(navigator.language, {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                  </p>
                                )
                              ) : (
                                <p>
                                  {msg.createdAt.toDate().toDateString()}{" "}
                                  {msg.createdAt
                                    .toDate()
                                    .toLocaleTimeString(navigator.language, {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                </p>
                              ))}
                          </div>
                        )}
                        {msg.userID !== "admin" && (
                          <div
                            className="dateCont2"
                            style={{ fontSize: "x-small" }}
                          >
                            {msg.createdAt !== null &&
                              (msg.createdAt.toDate().getFullYear() ===
                              now.getFullYear() ? (
                                msg.createdAt.toDate().getMonth() ===
                                now.getMonth() ? (
                                  msg.createdAt.toDate().getDate() ===
                                  now.getDate() ? (
                                    <p>
                                      Today{" "}
                                      {msg.createdAt
                                        .toDate()
                                        .toLocaleTimeString(
                                          navigator.language,
                                          {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          }
                                        )}
                                    </p>
                                  ) : now.getDate() -
                                      msg.createdAt.toDate().getDate() ===
                                    1 ? (
                                    <p>
                                      Yesterday{" "}
                                      {msg.createdAt
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
                                      {msg.createdAt.toDate().toDateString()}{" "}
                                      {msg.createdAt
                                        .toDate()
                                        .toLocaleTimeString(
                                          navigator.language,
                                          {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          }
                                        )}
                                    </p>
                                  )
                                ) : (
                                  <p>
                                    {msg.createdAt.toDate().toDateString()}{" "}
                                    {msg.createdAt
                                      .toDate()
                                      .toLocaleTimeString(navigator.language, {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                  </p>
                                )
                              ) : (
                                <p>
                                  {msg.createdAt.toDate().toDateString()}{" "}
                                  {msg.createdAt
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
                            msg.userID === "admin"
                              ? "msgCont msgSend"
                              : "msgCont"
                          }
                        >
                          <p className="msgText">{msg.text}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={
                        msg.userID === "admin"
                          ? "adMsgImgCont adMsgImgContSend"
                          : "adMsgImgCont"
                      }
                    >
                      <div className="wraps">
                        <div className="imgDateCont">
                          {msg.createdAt !== null &&
                            (msg.createdAt.toDate().getFullYear() ===
                            now.getFullYear() ? (
                              msg.createdAt.toDate().getMonth() ===
                              now.getMonth() ? (
                                msg.createdAt.toDate().getDate() ===
                                now.getDate() ? (
                                  <p>
                                    Today{" "}
                                    {msg.createdAt
                                      .toDate()
                                      .toLocaleTimeString(navigator.language, {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                  </p>
                                ) : now.getDate() -
                                    msg.createdAt.toDate().getDate() ===
                                  1 ? (
                                  <p>
                                    Yesterday{" "}
                                    {msg.createdAt
                                      .toDate()
                                      .toLocaleTimeString(navigator.language, {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                  </p>
                                ) : (
                                  <p>
                                    {msg.createdAt.toDate().toDateString()}{" "}
                                    {msg.createdAt
                                      .toDate()
                                      .toLocaleTimeString(navigator.language, {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                  </p>
                                )
                              ) : (
                                <p>
                                  {msg.createdAt.toDate().toDateString()}{" "}
                                  {msg.createdAt
                                    .toDate()
                                    .toLocaleTimeString(navigator.language, {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                </p>
                              )
                            ) : (
                              <p>
                                {msg.createdAt.toDate().toDateString()}{" "}
                                {msg.createdAt
                                  .toDate()
                                  .toLocaleTimeString(navigator.language, {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                              </p>
                            ))}
                        </div>
                        <div className="msgImgWrap">
                          <img src={msg.imgURLs} alt="Creatheme" />
                        </div>
                      </div>
                    </div>
                  )
                )
              ) : (
                <div className="noMsg">No messages yet.</div>
              )}

              <div className="sendCont">
                <form onSubmit={sendMessage}>
                  <div className="inputCont">
                    <div
                      className={
                        showEmoji ? "emojisCont emojisContShow" : "emojisCont"
                      }
                    >
                      <Emoji pickEmoji={pickEmoji} />
                    </div>
                    <div className="imgSendCont">
                      <input
                        accept="image/*"
                        className={classes.input}
                        id="contained-button-file"
                        multiple
                        type="file"
                        onChange={handleImgSend}
                      />
                      <label htmlFor="contained-button-file">
                        <IconButton
                          color="inherit"
                          className="imgSendBtn"
                          component="span"
                        >
                          <InsertPhotoIcon />
                        </IconButton>
                      </label>
                    </div>
                    <div className="emojiBtnCont">
                      <IconButton
                        color="inherit"
                        className="emojiBtn"
                        onClick={handleShowEmoji}
                      >
                        <EmojiEmotionsIcon />
                      </IconButton>
                    </div>
                    <div className="messageTextCont">
                      <input
                        type="text"
                        placeholder="Aa"
                        ref={inputRef}
                        value={msg}
                        onChange={(e) => {
                          setMsg(e.target.value);
                        }}
                        className="messageTxt"
                      />
                    </div>

                    <div className="adSendBtnCont">
                      <button class="button" type="submit">
                        <span class="default">Send</span>
                        <span class="success">Sent</span>
                        <div class="left"></div>
                        <div class="right"></div>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              <div ref={scroll}></div>
            </div>
          ) : (
            <div className="welcome">
              <h1>
                <BsFillChatFill />
              </h1>
            </div>
          )}
        </div>
      </div>
      {/* ) : (
        <div>You have no messages.</div>
      )} */}
    </div>
  );
}

export default Adminchat;
