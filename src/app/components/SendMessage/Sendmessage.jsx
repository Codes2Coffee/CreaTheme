import React, { useState, useEffect, createRef } from "react";
import "./Sendmessage.scss";
import Button from "@mui/material/Button";
import { auth, firestore, storage } from "../../firebase/config";
import firebase from "firebase";
import Aos from "aos";
import { useHistory } from "react-router-dom";
import gsap from "gsap";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
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

function Sendmessage() {
  const [msg, setMsg] = useState("");
  const db = firestore;
  const history = useHistory();

  const [useruid, setUseruid] = useState(null);
  const [user, setUser] = useState(null);
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

  // useEffect(() => {
  //   inputRef.current.selectionEnd = cursorposition;
  // }, [cursorposition, inputRef]);

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

  const [muser, setMuser] = useState([]);
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

  const hasUser = muser.some((val) => {
    return val.userID === useruid;
  });

  let getmid;

  muser.map((val) => {
    if (val.userID === useruid) {
      getmid = val.id;
    }
    return val;
  });

  //aniSend
  document.querySelectorAll(".button").forEach((button) => {
    let getVar = (variable) =>
      getComputedStyle(button).getPropertyValue(variable);

    if (user) {
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

  async function sendMessage(e) {
    e.preventDefault();
    if (user) {
      if (msg.trim() !== "") {
        if (hasUser) {
          await db
            .collection("messaged")
            .doc(getmid)
            .update({
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            })
            .then(async () => {
              await db
                .collection("messages " + useruid)
                .doc()
                .set({
                  type: "text",
                  userID: useruid,
                  text: msg.trim(),
                  imgURL: user.imgURL,
                  status: "unread",
                  createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                });
            });

          setMsg("");
        } else {
          await db
            .collection("messaged")
            .add({
              userID: useruid,
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            })
            .then(async () => {
              await db
                .collection("messages " + useruid)
                .doc()
                .set({
                  type: "text",
                  userID: useruid,
                  text: msg.trim(),
                  imgURL: user.imgURL,
                  createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                  status: "unread",
                });
            });
          setMsg("");
        }
      } else {
        setMsg("");
      }
    } else {
      history.push("/Signin");
    }
  }

  const handleShowEmoji = () => {
    inputRef.current.focus();
    setShowemoji(!showEmoji);
  };

  const classes = useStyles();

  const [imgSubmit, setImgSubmit] = useState(false);
  const handleImgSend = (e) => {
    setShowemoji(false);
    if (user) {
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
                    .collection("messages " + useruid)
                    .doc()
                    .set({
                      type: "img",
                      userID: useruid,
                      imgURLs,
                      imgURL: user.imgURL,
                      createdAt:
                        firebase.firestore.FieldValue.serverTimestamp(),
                      status: "unread",
                    });
                });
            } else {
              await db
                .collection("messaged")
                .add({
                  userID: useruid,
                  createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                })
                .then(async () => {
                  await db
                    .collection("messages " + useruid)
                    .doc()
                    .set({
                      type: "img",
                      userID: useruid,
                      imgURLs,
                      imgURL: user.imgURL,
                      createdAt:
                        firebase.firestore.FieldValue.serverTimestamp(),
                      status: "unread",
                    });
                });
            }
          } catch (err) {
            console.log(err.message);
          }
        }
      );
    } else {
      history.push("/Signin");
    }
  };

  return (
    <div>
      <div className="sendSubCont">
        <div className={showEmoji ? "emojisCont emojisContShow" : "emojisCont"}>
          <Emoji pickEmoji={pickEmoji} />
        </div>
        <div className="leftSendCont">
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
              onClick={() => {
                handleShowEmoji();
              }}
            >
              <EmojiEmotionsIcon />
            </IconButton>
          </div>
        </div>

        <form onSubmit={sendMessage}>
          <div className="inputCont">
            <div className="messageTextCont">
              <input
                type="text"
                placeholder="Aa"
                value={msg}
                ref={inputRef}
                onChange={(e) => {
                  setMsg(e.target.value);
                }}
                className="messageTxt"
              />
            </div>
            <div className="sendBtnCont">
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
    </div>
  );
}

export default Sendmessage;
