import React, { useState, useEffect } from "react";
import "./Purchase.scss";
import { firestore, auth, storage } from "../../firebase/config";
import Aos from "aos";
import Button from "@material-ui/core/Button";
import firebase from "firebase";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import AddPhotoAlternateRoundedIcon from "@mui/icons-material/AddPhotoAlternateRounded";
import { IconButton } from "@material-ui/core";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { makeStyles } from "@material-ui/core/styles";
import { v4 as uuid } from "uuid";
import CircularProgress from "@mui/material/CircularProgress";

const db = firestore;

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

function Purchase() {
  const [orders, setOrders] = useState([]);
  const formatter = new Intl.NumberFormat("en");

  const [user, setUser] = useState(null);
  const [useruid, setUseruid] = useState(null);
  const db = firestore;

  useEffect(() => {
    Aos.init({ duration: 9000 });

    const unsub = auth.onAuthStateChanged((u) => {
      if (!u) return setUser(null);

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

  // console.log("imgurl: ", user.imgURL);

  useEffect(() => {
    const fetchData = async () => {
      const db = firestore;
      db.collection("orders").onSnapshot((snapshot) => {
        const newOrder = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setOrders(newOrder);
      });
    };
    fetchData();
  }, []);

  const [color, setColor] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const db = firestore;
      db.collection("webinfo").onSnapshot((snapshot) => {
        const newColor = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setColor(newColor);
      });
    };
    fetchData();
  }, []);

  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      db.collection("productinfo").onSnapshot((snapshot) => {
        const newProduct = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setProducts(newProduct);
      });
    };
    fetchData();
  }, [db]);

  const [transactions, setTransactions] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      db.collection("transactions").onSnapshot((snapshot) => {
        const newTransac = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setTransactions(newTransac);
      });
    };
    fetchData();
  }, [db]);

  const [totalsales, setTotalsales] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const db = firestore;
      db.collection("sales").onSnapshot((snapshot) => {
        const newSale = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setTotalsales(newSale);
      });
    };
    fetchData();
  }, []);

  let total;
  totalsales.map((sale) => (total = sale.totalsales));

  const hasOrder = orders.some((val) => {
    return val.userID === useruid;
  });

  var options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  let mm = "";
  var today = new Date();
  var month = today.toLocaleDateString("en-US", options);
  mm = month.split(" ")[1];

  const [rvalue, setRvalue] = useState(0);
  const [showrate, setShowrate] = useState(false);

  const classes = useStyles();

  const [rateImg, setRateImg] = useState([]);

  const handleRateChange = (e) => {
    if (e.target.files.length > 0) {
      if (rateImg.length + e.target.files.length > 5)
        return alert("You can only add up to 5 photos.");
      const fileArray = [...e.target.files].map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
          id: uuid(),
        })
      );

      setRateImg([...rateImg, ...fileArray]);

      Array.from(e.target.files).map((file) => URL.revokeObjectURL(file));
    }
  };

  const removeImg = (id) => () => {
    const imgs = rateImg.filter((img) => img.id !== id);
    setRateImg(imgs);
  };

  const [comment, setComment] = useState(
    "Good product. Well packed. Will buy again."
  );
  const [idGet, setIDget] = useState("");
  const [variationget, setVariationget] = useState("");
  const [sizeget, setSizeget] = useState("");

  const [comments, setComments] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const db = firestore;
      const data = await db.collection("comments").get();
      setComments(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    fetchData();
  }, []);

  const [lastcomment, setLastcomment] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const db = firestore;
      db.collection("comments")
        .orderBy("createdAt", "desc")
        .limit(1)
        .onSnapshot((snapshot) => {
          const newID = snapshot.docs.map((doc) => ({
            id: doc.id,
          }));
          setLastcomment(newID);
        });
    };
    fetchData();
  }, []);

  var count = comments.length;
  var doc = "";
  var zero = 0;
  let idget;
  lastcomment.forEach((val) => {
    idget = val.id;
  });
  idget = +idget + 1;
  console.log("plus1: ", idget);
  console.log("count: ", count);
  if (count < 1) {
    doc = count.toString();
  } else {
    doc = idget.toString();
  }
  const [commentsubmit, setCommentsubmit] = useState(false);

  const multipleUpload = () => {
    for (let i = 0; i < rateImg.length; i++) {
      const uploadTask = storage
        .ref("commentimages/")
        .child(rateImg[i].name)
        .put(rateImg[i]);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          let progress;
          progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("progress: ", progress);
        },
        (err) => {
          console.log("err: ", err);
        },
        () => {
          storage
            .ref("commentimages")
            .child(rateImg[i].name)
            .getDownloadURL()
            .then((imageURL) => {
              firestore
                .collection("comments")
                .doc(doc)
                .update({
                  allImages: firebase.firestore.FieldValue.arrayUnion(imageURL),
                });
            })
            .then(() => {
              setShowrate(false);
              setRvalue(0);
              setComment("Good product. Well packed. Will buy again.");
              setRateImg([]);
              setCommentsubmit(false);
            });
        }
      );
    }
    console.log("okay na");
  };

  const handleCommentUpload = async () => {
    try {
      if (rateImg.length > 0) {
        setCommentsubmit(true);
        await db
          .collection("comments")
          .doc(doc)
          .set({
            comment: comment.trim(),
            rate: rvalue,
            userImg: user.imgURL,
            fname: user.firstname,
            lname: user.lastname,
            prodID: idGet,
            prodVariation: variationget,
            prodSize: sizeget,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          })
          .then(() => {
            let getTotal = 0;
            let getRated = 0;
            products
              .filter((val) => {
                return val.id === idGet;
              })
              .map((val) => {
                getTotal = val.totalrate;
                getRated = val.rating;
              });

            db.collection("productinfo")
              .doc(idGet)
              .update({
                totalrate: getTotal + rvalue,
                rating: getRated + 1,
              });
          })
          .then(() => {
            multipleUpload();
          });
      } else {
        setCommentsubmit(true);
        await db
          .collection("comments")
          .doc(doc)
          .set({
            comment: comment.trim(),
            rate: rvalue,
            userImg: user.imgURL,
            fname: user.firstname,
            lname: user.lastname,
            prodID: idGet,
            prodVariation: variationget,
            allImages: "",
            prodSize: sizeget,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          })
          .then(() => {
            let getTotal = 0;
            let getRated = 0;
            products
              .filter((val) => {
                return val.id === idGet;
              })
              .map((val) => {
                getTotal = val.totalrate;
                getRated = val.rating;
              });

            db.collection("productinfo")
              .doc(idGet)
              .update({
                totalrate: getTotal + rvalue,
                rating: getRated + 1,
              });
          })
          .then(() => {
            setShowrate(false);
            setRvalue(0);
            setComment("Good product. Well packed. Will buy again.");
            setRateImg([]);
            setCommentsubmit(false);
          });
      }
    } catch (err) {
      console.log(err);
    }
  };

  console.log("idGet: ", idGet);

  return (
    <div>
      <div className={showrate ? "reviewWrap reviewWrapShow" : "reviewWrap"}>
        <div className={showrate ? "reviewCont reviewContShow" : "reviewCont"}>
          <div className="closeReviewCont">
            <IconButton
              onClick={() => {
                setShowrate(false);
              }}
            >
              <CloseRoundedIcon />
            </IconButton>
          </div>
          <Typography component="legend">Review</Typography>

          <Rating
            name="simple-controlled"
            value={rvalue}
            onChange={(event, newValue) => {
              setRvalue(newValue);
            }}
          />
          <div className="addPhotoBtnCont">
            <input
              type="file"
              accept="image/*"
              multiple
              className={classes.input}
              id="contained-button-file2"
              onChange={handleRateChange}
            />
            <label htmlFor="contained-button-file2">
              <IconButton color="inherit" component="span">
                <AddPhotoAlternateRoundedIcon style={{ opacity: "0.7" }} />
              </IconButton>
            </label>

            {rateImg.map((val) => (
              <div className="imgreviewPreview">
                <IconButton
                  color="inherit"
                  className="removeRateImg"
                  onClick={removeImg(val.id)}
                >
                  <CloseRoundedIcon className="removeIcon" />
                </IconButton>
                <img src={val.preview} alt="" />
              </div>
            ))}
          </div>

          <TextField
            id="outlined-multiline-static"
            placeholder="Comment"
            className="reviewText"
            multiline
            rows={4}
            onChange={(e) => {
              setComment(e.target.value);
            }}
            // defaultValue="Default Value"
          />
          {color.map((val) => (
            <div className="reviewSubmitBtn">
              <Button
                variant="contained"
                color="primary"
                style={{ backgroundColor: val.color }}
                disabled={comment.trim() === "" ? true : false}
                onClick={() => {
                  handleCommentUpload();
                }}
              >
                {commentsubmit ? <CircularProgress /> : "Submit"}
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="purchaseSubCont">
        {hasOrder ? (
          orders
            .filter((val) => {
              return val.userID === useruid;
            })
            .sort((a, b) => {
              if (a.timestamp < b.timestamp) return 1;
              if (a.timestamp > b.timestamp) return -1;
            })
            .map((items) => (
              <div className="orderCard">
                <div className="startCont">
                  <div className="imgWrapper">
                    <img src={items.imgURL} alt="order-img" />
                  </div>
                  <div className="infoCont">
                    <h3>{items.title}</h3>
                    <p>{items.category}</p>
                    <p>₱ {formatter.format(items.price)}</p>
                    <p>Qty: {items.qty}</p>
                    <p>Variations:</p>
                    <p>
                      {items.size} {items.variation}
                    </p>
                  </div>
                </div>
                <div className="midCont">
                  <h3>
                    From: {items.ordererFirstname} {items.ordererLastname}
                  </h3>
                  <p>Email: {items.ordererEmail}</p>
                  <p>Deal method: {items.dealmethod}</p>
                  {items.dealmethod === "meetup" ? (
                    <p>Meet-up location: {items.meetupLocation}</p>
                  ) : (
                    <div className="delInfoCont">
                      <p>Delivery Info:</p>
                      <p>Fullname: {items.fullname}</p>
                      <p>Contact number: {items.phonenumber}</p>
                      <p>
                        Address: {items.detailedAddress} {", "}
                        {items.brgy}
                        {", "}
                        {items.city} {", "} {items.province} {", "}{" "}
                        {items.region}
                      </p>
                    </div>
                  )}
                </div>
                <div className="endCont">
                  <div className="statusCont">
                    <h4>Status: </h4>
                    <h4
                      className="statCont"
                      style={
                        items.status === "declined"
                          ? { color: "#E6191A" }
                          : { color: "#00df89" }
                      }
                    >
                      {" "}
                      {items.status}
                    </h4>
                    {items.status === "scheduled" ? (
                      <div>
                        <p>Meet seller on: {items.meetupDate}</p>
                        <p>Location: {items.meetupLocation}</p>
                      </div>
                    ) : (
                      <div></div>
                    )}
                    {items.status === "shipped" ? (
                      <div>
                        <p>Your order will be delivered by:</p>
                        <p>{items.expectedDate}</p>
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </div>
                  {items.status === "scheduled" ||
                  items.status === "shipped" ? (
                    <div className="receiveBtnCont">
                      <Button
                        variant="contained"
                        color="primary"
                        className="receiveBtn"
                        style={{
                          background: "#00ab55",
                          marginLeft: "20px",
                          marginRight: "-20px",
                        }}
                        onClick={() => {
                          let num;
                          products.map((val) => {
                            if (val.prodtitle === items.title) {
                              num = val.sold;
                            }
                          });
                          let num2;
                          products.map((val) => {
                            if (val.prodtitle === items.title) {
                              num2 = val.stock;
                            }
                          });
                          const hasValue = transactions.some((val) => {
                            return (
                              items.title === val.title && val.month === mm
                            );
                          });
                          let IDget = "";
                          let priceGet = 0;
                          transactions.map((val) => {
                            if (items.title === val.title) {
                              priceGet = val.sale;
                              IDget = val.id;
                            }
                            return val;
                          });

                          console.log(num2, num);
                          db.collection("orders")
                            .doc(items.id)
                            .update({
                              status: "received",
                            })
                            .then(() => {
                              db.collection("productinfo")
                                .doc(items.ID)
                                .update({
                                  sold: num + items.qty,
                                  stock: num2 - items.qty,
                                });
                            })
                            .then(() => {
                              db.collection("sales")
                                .doc("MFUNa9RQ916nxkcKGWcF")
                                .update({
                                  totalsales: total + items.price,
                                });
                            })
                            .then(() => {
                              if (hasValue) {
                                db.collection("transactions")
                                  .doc(IDget)
                                  .update({
                                    sale: priceGet + items.price,
                                    timestamp:
                                      firebase.firestore.FieldValue.serverTimestamp(),
                                  });
                              } else {
                                db.collection("transactions").doc().set({
                                  title: items.title,
                                  sale: items.price,
                                  month: mm,
                                  timestamp:
                                    firebase.firestore.FieldValue.serverTimestamp(),
                                });
                              }
                            })
                            .then(() => {
                              setShowrate(true);
                              setIDget(items.ID);
                              setVariationget(items.variation);
                              setSizeget(items.size);
                            });
                        }}
                      >
                        Received
                      </Button>
                    </div>
                  ) : (
                    <div></div>
                  )}
                </div>
              </div>
            ))
        ) : (
          <div>You have no orders yet.</div>
        )}
      </div>
    </div>
  );
}

export default Purchase;
