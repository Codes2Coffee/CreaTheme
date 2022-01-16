import React, { useState, useEffect } from "react";
import Nav from "../../components/nav/Nav";
import "./Shop.scss";
import { firestore, auth } from "../../firebase/config";
import Aos from "aos";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { useHistory } from "react-router-dom";
import firebase from "firebase";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import IconButton from "@material-ui/core/IconButton";
import ArrowForwardIosRoundedIcon from "@material-ui/icons/ArrowForwardIosRounded";
import ArrowBackIosRoundedIcon from "@material-ui/icons/ArrowBackIosRounded";
import FavoriteBorderRoundedIcon from "@material-ui/icons/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@material-ui/icons/FavoriteRounded";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import HomeIcon from "@mui/icons-material/Home";
import LocalMallIcon from "@material-ui/icons/LocalMall";
import Footer from "../../components/Footer/Footer";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { BiMenuAltLeft } from "react-icons/bi";
import { BiMenuAltRight } from "react-icons/bi";
import Success from "../../components/PopupMessages/Successmessage";
import Spinner from "../../components/Spinner/Spinner";
import Error from "../../components/PopupMessages/Errormessage";
import Avatar from "@mui/material/Avatar";
import Rating from "@mui/material/Rating";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Messenger from "../Message/Message";
import ModeCommentRoundedIcon from "@mui/icons-material/ModeCommentRounded";

function Shop() {
  // window.scrollTo(0, 0);

  const [products, setProducts] = useState([]);
  const [variant, setVariant] = useState("");
  const [size, setSize] = useState("");
  const db = firestore;
  const history = useHistory();

  const [user, setUser] = useState(null);
  const [useruid, setUseruid] = useState(null);

  const [success, setSuccess] = useState("");
  const [successPrimary, setSuccessPrimary] = useState("");

  useEffect(() => {
    Aos.init({ duration: 9000 });

    const unsub = auth.onAuthStateChanged((u) => {
      if (!u) return history.push("/Signin");
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
  }, [history]);

  const [cartprodID, setCartprodID] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const db = firestore;
      db.collection("cart " + useruid).onSnapshot((snapshot) => {
        const newCartProduct = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setCartprodID(newCartProduct);
      });
    };
    fetchData();
  }, [useruid]);

  console.log("user id: ", useruid);

  const [color, setColor] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const db = firestore;
      db.collection("webinfo").onSnapshot((snapshot) => {
        const newColor = snapshot.docs.map((doc) => doc.data());
        setColor(newColor);
      });
    };
    fetchData();
  }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const db = firestore;
  //     const data = await db.collection("webinfo").get();
  //     setColor(data.docs.map((doc) => doc.data()));
  //   };
  //   fetchData();
  // }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const db = firestore;
  //     const data = await db.collection("productinfo").get();
  //     setProducts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  //   };
  //   fetchData();
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      const db = firestore;
      db.collection("productinfo").onSnapshot((snapshot) => {
        const newProduct = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setProducts(newProduct);
      });
    };
    try {
      fetchData();
    } catch (err) {
      console.log(err);
    }
  }, []);

  function truncate(input) {
    if (input.length > 15) {
      return input.substring(0, 15) + "...";
    }
    return input;
  }

  console.log(variant);

  var x = 0;
  var y = "";
  color.map((cols) => (y = cols.color));
  console.log(y);
  const formatter = new Intl.NumberFormat("en");

  //dateCompute
  const today = Date.now();
  const dd = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(today);
  console.log("today is:", dd);

  const hasValue = false;

  const [catvalue, setCatvalue] = useState("");
  const [searchcontent, setSearchcontent] = useState("");

  const [category, setCategory] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const db = firestore;
      db.collection("category").onSnapshot((snapshot) => {
        const newCategory = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setCategory(newCategory);
      });
    };
    fetchData();
  }, []);

  const [rating, setRating] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const db = firestore;
      db.collection("rating").onSnapshot((snapshot) => {
        const newRate = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setRating(newRate);
      });
    };
    fetchData();
  }, []);

  const [comments, setComments] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const db = firestore;
      db.collection("comments").onSnapshot((snapshot) => {
        const newComment = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setComments(newComment);
      });
    };
    fetchData();
  }, []);

  const [searchvalue, setSearchvalue] = useState(false);
  const [showHeart, setShowheart] = useState(false);
  const [showdes, setShowdes] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const [filter, setFilter] = useState("");
  const handleClose = (e) => {
    console.log(e.target.value);
    setAnchorEl(null);
  };

  let liked;

  const [focused, setFocused] = useState(false);
  const [idget, setIdget] = useState("");

  let sum = 0;
  rating.map((item) => (sum = sum + item.rate));

  console.log("sum ", sum);

  const [added, setAdded] = useState(false);
  const [preview, setPreview] = useState(false);
  const [failed, setFailed] = useState(false);
  const [error, setError] = useState("");
  const [errorPrimary, setErrorPrimary] = useState("");

  //passingProdInfo
  const [passimg, setPassimg] = useState([]);
  const [passtitle, setPasstitle] = useState("");
  const [passprice, setPassprice] = useState([]);
  const [passprice2, setPassprice2] = useState([]);
  const [passdescription, setPassdescription] = useState("");
  const [passlocation, setPasslocation] = useState([]);
  const [passsize, setPasssize] = useState([]);
  const [passvariation, setPassvariation] = useState([]);
  const [passlike, setPasslike] = useState(0);
  const [passdate, setPassdate] = useState("");
  const [passsold, setPasssold] = useState(0);
  const [passid, setPassid] = useState("");
  const [passdeliverydes, setPassdeliverydes] = useState("");
  const [passweight, setPassweight] = useState("");
  const [passqty, setPassqty] = useState("");
  const [passimgselector, setPassimgselector] = useState(0);
  const [passimglength, setPassimglength] = useState(0);
  const [passliked, setPassliked] = useState(false);
  const [passSelectedV, setPassSelectedV] = useState("");
  const [passSelectedS, setPassSelectedS] = useState("");
  const [passSelectedP, setPassSelectedP] = useState("");
  const [passHascart, setPasshascart] = useState(false);
  const [passstock, setPassstock] = useState(0);
  const [passcategory, setPasscategory] = useState("");
  const [passmeetup, setPassmeetup] = useState(false);
  const [passdelivery, setPassdelivery] = useState(false);
  const [passHasComment, setPassHasComment] = useState(false);

  const [spin, setSpin] = useState(false);
  const [shownotif, setShownotif] = useState(false);

  let formatterCompact = Intl.NumberFormat("en", { notation: "compact" });
  const [toggleMsg, setToggleMsg] = useState(false);

  return (
    <div>
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
        className="spinnerCont"
        style={
          spin
            ? { zIndex: "12", display: "block" }
            : { zIndex: "12", display: "none" }
        }
      >
        <Spinner />
      </div>
      <div className="shopMainCont">
        {showHeart ? (
          <div className="heartCont">
            <svg
              id="color"
              enable-background="new 0 0 24 24"
              height="512"
              viewBox="0 0 24 24"
              width="512"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="m11.466 22.776c.141.144.333.224.534.224s.393-.08.534-.224l9.594-9.721c4.001-4.053 1.158-11.055-4.532-11.055-3.417 0-4.985 2.511-5.596 2.98-.614-.471-2.172-2.98-5.596-2.98-5.672 0-8.55 6.984-4.531 11.055z"
                fill="#f44336"
              />
            </svg>
          </div>
        ) : (
          <div className="heartHide">
            <svg
              id="color"
              enable-background="new 0 0 24 24"
              height="512"
              viewBox="0 0 24 24"
              width="512"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="m11.466 22.776c.141.144.333.224.534.224s.393-.08.534-.224l9.594-9.721c4.001-4.053 1.158-11.055-4.532-11.055-3.417 0-4.985 2.511-5.596 2.98-.614-.471-2.172-2.98-5.596-2.98-5.672 0-8.55 6.984-4.531 11.055z"
                fill="#f44336"
              />
            </svg>
          </div>
        )}

        <div className={added ? "addedCont addedContShow" : "addedCont"}>
          <Success
            success={success}
            added={added}
            successPrimary={successPrimary}
          />
        </div>
        <div className={failed ? "faliedCont faliedContShow" : "faliedCont"}>
          <Error
            error={error}
            errorPrimary={errorPrimary}
            failed={failed}
            setFailed={setFailed}
          />
        </div>
        <div
          className={
            preview
              ? "botPreviewWrapper botPreviewWrapperShow"
              : "botPreviewWrapper"
          }
        >
          <div className={preview ? "botPreview botPreviewShow" : "botPreview"}>
            <div className="closeMainBtnCont">
              <IconButton
                className="closeMainBtn"
                onClick={() => {
                  db.collection("productinfo")
                    .doc(passid)
                    .update({
                      preview: false,
                    })
                    .then(() => {
                      setTimeout(function () {
                        setPassid("");
                        setPassimg([]);
                        setPasstitle("");
                        setPasssold(0);
                        setPassprice([]);
                        setPassprice2([]);
                        setPassdescription("");
                        setPassdate("");
                        setPasslike(0);
                        setPassdeliverydes("");
                        setPassqty("");
                        setPassvariation([]);
                        setPasssize([]);
                        setPasslocation([]);
                        setPassweight("");
                        setPassimgselector(0);
                        setPassimglength(0);
                        setPassliked(false);
                        setPassSelectedS("");
                        setPassSelectedV("");
                        setPasshascart(false);
                        setPassstock(0);
                        setPasscategory("");
                        setPassmeetup(false);
                        setPassdelivery(false);
                        setPassHasComment(false);
                      }, 2000);
                    })
                    .then(() => {
                      setPreview(false);
                    });
                }}
              >
                <CloseRoundedIcon />
              </IconButton>
            </div>
            <div className="mainLikeBtnCont">
              <IconButton
                className="mainLikeBtn"
                onClick={() => {
                  if (passliked) {
                    db.collection("productinfo")
                      .doc(passid)
                      .update({
                        allLikes:
                          firebase.firestore.FieldValue.arrayRemove(useruid),
                      })
                      .then(() => {
                        setPassliked(!passliked);
                        if (passliked) {
                          setPasslike(passlike - 1);
                        } else {
                          setPasslike(passlike + 1);
                        }
                      });
                  } else {
                    db.collection("productinfo")
                      .doc(passid)
                      .update({
                        allLikes:
                          firebase.firestore.FieldValue.arrayUnion(useruid),
                      })
                      .then(() => {
                        setPassliked(!passliked);
                        if (passliked) {
                          setPasslike(passlike - 1);
                        } else {
                          setPasslike(passlike + 1);
                          setShowheart(true);
                          setTimeout(() => {
                            setShowheart(false);
                          }, 1500);
                        }
                      });
                  }
                }}
              >
                {passliked ? (
                  <FavoriteRoundedIcon className="likedIcon" />
                ) : (
                  <FavoriteBorderRoundedIcon className="unlikedIcon" />
                )}
              </IconButton>
              <h3 className="likeNum">{passlike}</h3>
            </div>
            {color.map((col) => (
              <div className="mainAddtocartBtnCont">
                <Button
                  variant="contained"
                  color="primary"
                  className="mainAddtocartBtn"
                  style={{ backgroundColor: "#000" }}
                  onClick={() => {
                    if (user) {
                      if (!passHascart) {
                        if (passSelectedS !== "" && passSelectedV !== "") {
                          if (passstock > 0) {
                            db.collection("cart " + useruid)
                              .doc(passid)
                              .set({
                                ID: passid,
                                category: passcategory,
                                description: passdescription,
                                title: passtitle,
                                price: +passSelectedP,
                                imgURL: passimg[passimgselector],
                                size: passSelectedS,
                                meetup: passmeetup,
                                delivery: passdelivery,
                                variation: passSelectedV,
                                qty: 1,
                                meetupLocSelector: "",
                                stock: passstock,
                                timestamp:
                                  firebase.firestore.FieldValue.serverTimestamp(),
                              })
                              .then(() => {
                                if (passdelivery === true) {
                                  db.collection("cart " + useruid)
                                    .doc(passid)
                                    .update({
                                      deliveryinfo: passdeliverydes,
                                    });
                                }
                                if (passmeetup === true) {
                                  for (
                                    let i = 0;
                                    i < passlocation.length;
                                    i++
                                  ) {
                                    db.collection("cart " + useruid)
                                      .doc(passid)
                                      .update({
                                        meetupaddress:
                                          firebase.firestore.FieldValue.arrayUnion(
                                            passlocation[i]
                                          ),
                                      });
                                  }
                                }
                              })
                              .then(() => {
                                setSuccess("Added to cart");
                                setSuccessPrimary("Successfully");
                                setAdded(true);
                                setTimeout(function () {
                                  setAdded(false);
                                }, 3000);
                              })
                              .then(() => {
                                db.collection("productinfo")
                                  .doc(passid)
                                  .update({
                                    preview: false,
                                  })
                                  .then(() => {
                                    setPreview(false);
                                    setTimeout(function () {
                                      setPassid("");
                                      setPassimg([]);
                                      setPasstitle("");
                                      setPasssold(0);
                                      setPassprice([]);
                                      setPassprice2([]);
                                      setPassdescription("");
                                      setPassdate("");
                                      setPasslike(0);
                                      setPassdeliverydes("");
                                      setPassqty("");
                                      setPassvariation([]);
                                      setPasssize([]);
                                      setPasslocation([]);
                                      setPassweight("");
                                      setPassimgselector(0);
                                      setPassimglength(0);
                                      setPassliked(false);
                                      setPassSelectedS("");
                                      setPassSelectedV("");
                                      setPasshascart(false);
                                      setPassstock(0);
                                      setPasscategory("");
                                      setPassmeetup(false);
                                      setPassdelivery(false);
                                      setPassHasComment(false);
                                    }, 2000);
                                  });
                              });
                          } else {
                            // alert("Not enough stock on ", passtitle);
                            setError("Not enough stock on " + passtitle + ".");
                            setErrorPrimary("Add failed");
                            setFailed(true);
                          }
                        } else {
                          // alert("Please select variation.");
                          setError("Please select variation.");
                          setErrorPrimary("Add failed");
                          setFailed(true);
                        }
                      } else {
                        // alert("This product already exist in your cart.");
                        setError("This product already exist in your cart.");
                        setErrorPrimary("Add failed");
                        setFailed(true);
                      }
                    } else {
                      history.push("/Signin");
                    }
                  }}
                >
                  ADD TO CART
                </Button>
              </div>
            ))}

            <div className="mainContent" id="mainScroll">
              <div className="mainTopCont">
                <div className="mainImgWrapper">
                  <IconButton
                    aria-label="search"
                    color="inherit"
                    className="mainPrevBtn"
                    onClick={() => {
                      if (passimgselector > 0) {
                        setPassimgselector(passimgselector - 1);
                      } else {
                        setPassimgselector(passimglength - 1);
                      }
                    }}
                  >
                    <ArrowBackIosRoundedIcon className="mainPrevIcon" />
                  </IconButton>
                  <div className="mainImgCont">
                    <img src={passimg[passimgselector]} alt="creatheme" />
                  </div>
                  <IconButton
                    aria-label="search"
                    color="inherit"
                    className="mainNextBtn"
                    onClick={() => {
                      if (passimgselector < passimglength - 1) {
                        setPassimgselector(passimgselector + 1);
                      } else {
                        setPassimgselector(0);
                      }
                    }}
                  >
                    <ArrowForwardIosRoundedIcon className="mainNextIcon" />
                  </IconButton>
                  <div className="numCont">
                    <p className="num">
                      {passimgselector + 1}
                      {" / "}
                      {passimglength}
                    </p>
                  </div>
                </div>
                <div className="mainImgPreview">
                  <div className="mainImgPreviewSubCont">
                    {passimg.map((val) => (
                      <div className="imgSubWrap">
                        <img src={val} alt="Creatheme" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mainInfoCont">
                  <h2>{passtitle}</h2>

                  {/* <h1> ₱ {formatter.format(passprice)}</h1> */}
                  <div className="mainPriceCont">
                    {passprice
                      .sort((a, b) => {
                        if (a.value > b.value) return 1;
                        if (a.value < b.value) return -1;
                      })
                      .map(
                        (prs, index) =>
                          index < 1 && (
                            <h3 className="price">
                              ₱ {formatter.format(prs.value)}
                            </h3>
                          )
                      )}
                    <h3>~</h3>
                    {passprice
                      .sort((a, b) => {
                        if (a.value > b.value) return -1;
                        if (a.value < b.value) return 1;
                      })
                      .map(
                        (prs, index) =>
                          index < 1 && (
                            <h3 className="price">
                              ₱ {formatter.format(prs.value)}
                            </h3>
                          )
                      )}
                  </div>

                  <p>Sold: {passsold}</p>
                  <p>
                    {passqty} {passweight}
                  </p>
                  <p>Uploaded on: {passdate}</p>
                </div>
                <div className="mainVariationCont">
                  <h3>Variations: </h3>
                  <div className="mainVariationSubCont">
                    {color.map((col) =>
                      passvariation.map((val) => (
                        <Button
                          variant="text"
                          className="mainVariations"
                          style={
                            passSelectedV === val
                              ? { backgroundColor: col.color, color: "#fff" }
                              : { backgroundColor: "#fff" }
                          }
                          onClick={() => {
                            if (passSelectedV === val) {
                              setPassSelectedV("");
                            } else {
                              setPassSelectedV(val);
                            }
                          }}
                        >
                          {val}
                        </Button>
                      ))
                    )}
                  </div>
                </div>
                <div className="mainSizeCont">
                  <h3>Sizes: </h3>
                  <div className="mainSizeSubCont">
                    {color.map((col) =>
                      passsize.map((val) => (
                        <Button
                          variant="text"
                          className="mainSizes"
                          style={
                            passSelectedS === val.value
                              ? { backgroundColor: col.color, color: "#fff" }
                              : { backgroundColor: "#fff" }
                          }
                          onClick={() => {
                            const prc = passprice.filter((pr) => {
                              return pr.id === val.id;
                            });
                            if (passSelectedS === val.value) {
                              setPassSelectedS("");
                            } else {
                              setPassSelectedS(val.value);
                              setPassSelectedP(prc[0].value);
                            }
                          }}
                        >
                          {val.value}
                        </Button>
                      ))
                    )}
                  </div>
                </div>
                <div className="mainPriceListWrap">
                  <h3>Price List: </h3>
                  <div className="mainPriceListCont">
                    <div className="sizeList">
                      {passsize
                        .sort((a, b) => {
                          if (a.id > b.id) return 1;
                          if (a.id < b.id) return -1;
                        })
                        .map((siz) => (
                          <p className="mainSizes">{siz.value} :</p>
                        ))}
                    </div>
                    <div className="priceList">
                      {passprice2
                        .sort((a, b) => {
                          if (a.id > b.id) return 1;
                          if (a.id < b.id) return -1;
                        })
                        .map((prs) => (
                          <p className="mainPrices">
                            ₱ {formatter.format(prs.value)}
                          </p>
                        ))}
                    </div>
                  </div>
                </div>

                <div className="mainDescriptionCont">
                  <div className="mainDescriptionSubCont">
                    <h3>Description: </h3>
                    <p>{passdescription}</p>
                  </div>
                </div>
                {passHasComment ? (
                  <div className="mainCommentsWrap">
                    <div className="mainCommentsCont">
                      <h2>
                        {formatterCompact.format(
                          comments.filter((val) => {
                            return val.prodID === passid;
                          }).length
                        )}{" "}
                        {comments.filter((val) => {
                          return val.prodID === passid;
                        }).length > 1
                          ? "reviews"
                          : "review"}
                      </h2>
                      {comments
                        .filter((val) => {
                          return val.prodID === passid;
                        })
                        .sort((a, b) => {
                          if (a.createdAt < b.createdAt) return 1;
                          if (a.createdAt > b.createdAt) return -1;
                        })
                        .map((com) => (
                          <div className="commentCont">
                            <div className="commentSubCont">
                              <Avatar
                                src={com.userImg}
                                className="commentAvatar"
                              />
                              <div className="comNameCont">
                                <p>
                                  {com.fname} {com.lname}
                                </p>
                              </div>
                              {com.rate !== 0 && (
                                <div className="rateCont">
                                  {/* <Typography component="legend">Rating</Typography> */}
                                  <Rating
                                    name="read-only"
                                    value={com.rate}
                                    style={{ fontSize: "smaller" }}
                                    readOnly
                                  />
                                </div>
                              )}
                            </div>
                            <div className="commentsText">
                              <p>{com.comment}</p>
                            </div>

                            {com.allImages !== "" && (
                              <div className="mainCommentImgCont">
                                {com.allImages.map((img) => (
                                  <div className="mainCommentImg">
                                    <img src={img} alt="creatheme" />
                                  </div>
                                ))}
                              </div>
                            )}
                            <div className="mainDateVarCont">
                              <p
                                style={{ fontSize: "smaller", opacity: "0.7" }}
                              >
                                {com.createdAt.toDate().toDateString()}
                                {" | "}
                                {com.prodSize} {com.prodVariation}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ) : (
                  <div>No reviews yet</div>
                )}
              </div>
            </div>
          </div>
        </div>
        <Nav
          shownotif={shownotif}
          setShownotif={setShownotif}
          setToggleMsg={setToggleMsg}
        />
        <div
          className="shopCont"
          style={
            spin
              ? { pointerEvents: "none" }
              : failed
              ? { pointerEvents: "none" }
              : { pointerEvents: "auto" }
          }
          onClick={() => {
            setShownotif(false);
          }}
        >
          <div className="breadCrumbs">
            <Breadcrumbs aria-label="breadcrumb">
              <Link
                underline="hover"
                sx={{ display: "flex", alignItems: "center" }}
                color="inherit"
                href="/"
              >
                <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                HOME
              </Link>
              <Typography
                sx={{ display: "flex", alignItems: "center" }}
                color="text.primary"
              >
                <LocalMallIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                SHOP
              </Typography>
            </Breadcrumbs>
          </div>
          {products.length > 0 && (
            <div className="shopSubCont">
              <div className="shopTopCont">
                <div
                  className={focused ? "searchCont searchContF" : "searchCont"}
                >
                  <TextField
                    id="outlined-basic"
                    placeholder="Search"
                    variant="outlined"
                    className="shopSearchbar"
                    onChange={(e) => {
                      setSearchcontent(e.target.value);
                      if (e.target.value !== "") {
                        setSearchvalue(true);
                      } else {
                        setSearchvalue(false);
                      }
                      console.log(searchvalue);
                    }}
                    onFocus={() => {
                      setFocused(true);
                    }}
                    onBlur={() => {
                      setFocused(false);
                    }}
                  />
                </div>

                <div className="shopTopMidCont"></div>
                <div className="shopTopRightCont">
                  <FormControl variant="outlined" className="filterCategory">
                    <InputLabel id="demo-simple-select-outlined-label">
                      Category
                    </InputLabel>
                    <Select
                      value={catvalue}
                      onChange={(e) => {
                        setCatvalue(e.target.value);
                      }}
                      label="Category"
                    >
                      <MenuItem value="">
                        <em>All</em>
                      </MenuItem>
                      {category.map((cat) => (
                        <MenuItem value={cat.category}>{cat.category}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </div>
              {products
                .filter((val) => {
                  if (searchcontent === "") {
                    if (catvalue === "") {
                      return val;
                    } else if (
                      val.prodcategory.toLowerCase() === catvalue.toLowerCase()
                    ) {
                      if (searchcontent === "") {
                        return val;
                      } else if (
                        val.prodtitle
                          .toLowerCase()
                          .includes(searchcontent.toLowerCase()) ||
                        val.Alltags.some((tag) => {
                          return tag
                            .toLowerCase()
                            .includes(searchcontent.toLowerCase());
                        }) ||
                        val.Allsizes.some((size) => {
                          return size.value
                            .toLowerCase()
                            .includes(searchcontent.toLowerCase());
                        }) ||
                        val.Allvariations.some((vars) => {
                          return vars
                            .toLowerCase()
                            .includes(searchcontent.toLowerCase());
                        }) ||
                        val.Allprices.some((prs) => {
                          return prs.value
                            .toLowerCase()
                            .includes(searchcontent.toLowerCase());
                        }) ||
                        val.prodcategory
                          .toLowerCase()
                          .includes(searchcontent.toLowerCase())
                      ) {
                        return val;
                      }
                    }
                  } else {
                    if (catvalue === "") {
                      if (
                        val.prodtitle
                          .toLowerCase()
                          .includes(searchcontent.toLowerCase()) ||
                        val.Alltags.some((tag) => {
                          return tag
                            .toLowerCase()
                            .includes(searchcontent.toLowerCase());
                        }) ||
                        val.Allsizes.some((size) => {
                          return size.value
                            .toLowerCase()
                            .includes(searchcontent.toLowerCase());
                        }) ||
                        val.Allvariations.some((vars) => {
                          return vars
                            .toLowerCase()
                            .includes(searchcontent.toLowerCase());
                        }) ||
                        val.Allprices.some((prs) => {
                          return prs.value
                            .toLowerCase()
                            .includes(searchcontent.toLowerCase());
                        }) ||
                        val.prodcategory
                          .toLowerCase()
                          .includes(searchcontent.toLowerCase())
                      ) {
                        return val;
                      }
                    } else {
                      if (
                        val.prodcategory.toLowerCase() ===
                        catvalue.toLowerCase()
                      ) {
                        if (
                          val.prodtitle
                            .toLowerCase()
                            .includes(searchcontent.toLowerCase()) ||
                          val.Alltags.some((tag) => {
                            return tag
                              .toLowerCase()
                              .includes(searchcontent.toLowerCase());
                          }) ||
                          val.Allsizes.some((size) => {
                            return size.value
                              .toLowerCase()
                              .includes(searchcontent.toLowerCase());
                          }) ||
                          val.Allvariations.some((vars) => {
                            return vars
                              .toLowerCase()
                              .includes(searchcontent.toLowerCase());
                          }) ||
                          val.Allprices.some((prs) => {
                            return prs.value
                              .toLowerCase()
                              .includes(searchcontent.toLowerCase());
                          }) ||
                          val.prodcategory
                            .toLowerCase()
                            .includes(searchcontent.toLowerCase())
                        ) {
                          return val;
                        }
                      }
                    }
                  }
                })
                .map((prod) => (
                  <div className="prodWrap">
                    <div className="productCard" key={prod.id}>
                      <div className="topBurger">
                        <IconButton
                          className="topBurgerBtn"
                          onClick={() => {
                            setSpin(true);
                            db.collection("productinfo")
                              .doc(prod.id)
                              .update({
                                preview: true,
                              })
                              .then(() => {
                                setPassid(prod.id);
                                setPassimg(prod.allImages);
                                setPasstitle(prod.prodtitle);
                                setPasssold(prod.sold);
                                setPassprice(prod.Allprices);
                                setPassprice2(prod.Allprices);
                                setPassdescription(prod.proddescription);
                                setPassdate(prod.dateupload);
                                setPasslike(prod.allLikes.length);
                                setPassdeliverydes(
                                  prod.proddeliverydescription
                                );
                                setPassqty(prod.qty);
                                setPassvariation(prod.Allvariations);
                                setPasssize(prod.Allsizes);
                                setPasslocation(prod.Alladdresses);
                                setPassweight(prod.weight);
                                setPassimgselector(prod.imgselector);
                                setPassimglength(prod.allImages.length);
                                setPassstock(prod.stock);
                                setPasscategory(prod.prodcategory);
                                setPassmeetup(prod.meetup);
                                setPassdelivery(prod.delivery);
                                setPassliked(
                                  prod.allLikes.some((val) => {
                                    return (val = useruid);
                                  })
                                );
                                setPasshascart(
                                  cartprodID.some((val) => {
                                    return prod.id === val.id;
                                  })
                                );
                                setPassHasComment(
                                  comments.some((val) => {
                                    return val.prodID === prod.id;
                                  })
                                );
                              })
                              .then(() => {
                                setSpin(false);
                                setPreview(true);
                              });
                          }}
                        >
                          {prod.preview ? (
                            <div className="openMain">
                              <VisibilityIcon />
                            </div>
                          ) : (
                            <div className="closeMain">
                              <VisibilityIcon />
                            </div>
                          )}
                        </IconButton>
                      </div>
                      <div className="prodTopCont">
                        <div className="imgWrapper">
                          <IconButton
                            aria-label="search"
                            color="inherit"
                            className="prevBtn"
                            onClick={() => {
                              if (prod.imgSelector === true) {
                                db.collection("productinfo")
                                  .doc(prod.id)
                                  .update({
                                    imgSelector: false,
                                  });
                              } else {
                                db.collection("productinfo")
                                  .doc(prod.id)
                                  .update({
                                    imgSelector: true,
                                  });
                              }
                              if (prod.imgselector > 0) {
                                db.collection("productinfo")
                                  .doc(prod.id)
                                  .update({
                                    imgselector: prod.imgselector - 1,
                                  });
                              } else {
                                db.collection("productinfo")
                                  .doc(prod.id)
                                  .update({
                                    imgselector: prod.allImages.length - 1,
                                  });
                              }
                            }}
                          >
                            <ArrowBackIosRoundedIcon />
                          </IconButton>
                          {prod.imgSelector ? (
                            <div
                              className="prodImageCont"
                              style={
                                prod.imgSelector
                                  ? { transform: "scale(1)" }
                                  : { transform: "scale(0)" }
                              }
                            >
                              <img
                                src={prod.allImages[prod.imgselector]}
                                alt={prod.title}
                              />
                            </div>
                          ) : (
                            <div
                              className="prodImageCont2"
                              style={
                                prod.imgSelector
                                  ? { transform: "scale(0)" }
                                  : { transform: "scale(1)" }
                              }
                              onClick={() => {
                                setPreview(true);
                              }}
                            >
                              <img
                                src={prod.allImages[prod.imgselector]}
                                alt={prod.title}
                              />
                            </div>
                          )}

                          <IconButton
                            aria-label="search"
                            color="inherit"
                            className="nextBtn"
                            onClick={() => {
                              if (prod.imgSelector === true) {
                                db.collection("productinfo")
                                  .doc(prod.id)
                                  .update({
                                    imgSelector: false,
                                  });
                              } else {
                                db.collection("productinfo")
                                  .doc(prod.id)
                                  .update({
                                    imgSelector: true,
                                  });
                              }
                              if (
                                prod.imgselector <
                                prod.allImages.length - 1
                              ) {
                                db.collection("productinfo")
                                  .doc(prod.id)
                                  .update({
                                    imgselector: prod.imgselector + 1,
                                  });
                              } else {
                                db.collection("productinfo")
                                  .doc(prod.id)
                                  .update({
                                    imgselector: 0,
                                  });
                              }
                            }}
                          >
                            <ArrowForwardIosRoundedIcon />
                          </IconButton>
                        </div>

                        <div className="imgDisplayCont">
                          {prod.allImages.map((img) => (
                            <div className="allImageCont">
                              <img src={img} alt={prod.title} />
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="prodTitleCont">
                        <h3 className="title">{truncate(prod.prodtitle)}</h3>
                        {/* <h3 className="price"> */}
                        {prod.Allprices.sort((a, b) => {
                          if (a.value > b.value) return 1;
                          if (a.value < b.value) return -1;
                        }).map(
                          (prs, index) =>
                            index < 1 && (
                              <h3
                                className="price"
                                style={{ fontSize: "15px" }}
                              >
                                ₱ {formatter.format(prs.value)}
                              </h3>
                            )
                        )}
                        <h3 style={{ fontSize: "15px" }}>~</h3>
                        {prod.Allprices.sort((a, b) => {
                          if (a.value > b.value) return -1;
                          if (a.value < b.value) return 1;
                        }).map(
                          (prs, index) =>
                            index < 1 && (
                              <h3
                                className="price2"
                                style={{ fontSize: "15px" }}
                              >
                                ₱ {formatter.format(prs.value)}
                              </h3>
                            )
                        )}
                        {/* </h3> */}
                      </div>
                      <div className="variantCont">
                        {prod.Allvariations.map((av) => (
                          <Button
                            variant="outlined"
                            className="variants"
                            style={
                              prod.selectedVariant === av
                                ? { backgroundColor: y, color: "#fff" }
                                : { backgroundColor: "#fff" }
                            }
                            onClick={() => {
                              if (prod.selectedVariant === av) {
                                db.collection("productinfo")
                                  .doc(prod.id)
                                  .update({
                                    selectedVariant: "",
                                  });
                              } else {
                                db.collection("productinfo")
                                  .doc(prod.id)
                                  .update({
                                    selectedVariant: av,
                                  });
                              }
                            }}
                          >
                            {av}
                          </Button>
                        ))}
                      </div>

                      <div className="sizesCont">
                        {prod.Allsizes.map((as) => (
                          <Button
                            variant="outlined"
                            className="sizes"
                            style={
                              prod.selectedSize === as.value
                                ? { backgroundColor: y, color: "#fff" }
                                : { backgroundColor: "#fff" }
                            }
                            onClick={() => {
                              const prc = prod.Allprices.filter((val) => {
                                return val.id === as.id;
                              });
                              console.log("value: ", prc[0].value);
                              if (prod.selectedSize === as.value) {
                                db.collection("productinfo")
                                  .doc(prod.id)
                                  .update({
                                    selectedSize: "",
                                    selectedPrice: "",
                                  });
                              } else {
                                db.collection("productinfo")
                                  .doc(prod.id)
                                  .update({
                                    selectedSize: as.value,
                                    selectedPrice: prc[0].value,
                                  });
                              }
                            }}
                          >
                            {as.value}
                          </Button>
                        ))}
                      </div>

                      <div className="dateCont">
                        <p>Uploaded on: {prod.dateupload}</p>
                      </div>

                      <div className="soldCont">
                        <p>Sold:</p>
                        <p>{prod.sold}</p>
                      </div>

                      <div className="likeBtnCont">
                        {user ? (
                          <IconButton
                            aria-label="search"
                            color="inherit"
                            className="likeBtn"
                            onClick={() => {
                              const liked = prod.allLikes.some((item) => {
                                return item === useruid;
                              });
                              if (liked === true) {
                                db.collection("productinfo")
                                  .doc(prod.id)
                                  .update({
                                    allLikes:
                                      firebase.firestore.FieldValue.arrayRemove(
                                        useruid
                                      ),
                                  });
                              } else {
                                setShowheart(true);
                                setTimeout(() => {
                                  setShowheart(false);
                                }, 1500);
                                db.collection("productinfo")
                                  .doc(prod.id)
                                  .update({
                                    allLikes:
                                      firebase.firestore.FieldValue.arrayUnion(
                                        useruid
                                      ),
                                  });
                              }
                            }}
                          >
                            {
                              (liked = prod.allLikes.some((item) => {
                                return item === useruid;
                              }))
                            }
                            {liked ? (
                              <FavoriteRoundedIcon />
                            ) : (
                              <FavoriteBorderRoundedIcon className="bordered" />
                            )}
                          </IconButton>
                        ) : (
                          <IconButton
                            aria-label="search"
                            color="inherit"
                            className="likeBtn"
                            onClick={() => {
                              history.push("/Signin");
                            }}
                          >
                            {
                              (liked = prod.allLikes.some((item) => {
                                return item === useruid;
                              }))
                            }
                            {liked ? (
                              <FavoriteRoundedIcon />
                            ) : (
                              <FavoriteBorderRoundedIcon className="bordered" />
                            )}
                          </IconButton>
                        )}

                        <p>{formatter.format(prod.allLikes.length)}</p>
                      </div>
                      {prod.totalrate > 0 ? (
                        <div className="ratingCont">
                          <div className="ratingSubCont">
                            <Typography component="legend">Rating</Typography>
                            <Rating
                              name="read-only"
                              value={
                                ((prod.totalrate / (prod.rating * 5)) * 10) / 2
                              }
                              readOnly
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="noRate">
                          <p>No ratings yet.</p>
                        </div>
                      )}

                      {prod.rating > 0 && (
                        <div className="reviewNum">
                          <p>
                            {formatterCompact.format(prod.rating)}{" "}
                            {prod.rating > 1 ? "reviews" : "review"}
                          </p>
                        </div>
                      )}

                      {color.map((col) => (
                        <div className="addToCartBtnCont">
                          <Button
                            variant="contained"
                            color="primary"
                            className="addToCartBtn"
                            style={{
                              backgroundColor: col.color,
                              borderRadius: 0,
                            }}
                            onClick={() => {
                              const hasCart = cartprodID.some((carts) => {
                                return prod.id === carts.id;
                              });
                              if (useruid !== null && user !== null) {
                                if (hasCart) {
                                  setError(
                                    "This product already exist in your cart."
                                  );
                                  setErrorPrimary("Add failed");
                                  setFailed(true);
                                  db.collection("productinfo")
                                    .doc(prod.id)
                                    .update({
                                      selectedSize: "",
                                      selectedVariant: "",
                                    });
                                } else {
                                  if (
                                    prod.selectedVariant !== "" &&
                                    prod.selectedSize !== ""
                                  ) {
                                    if (prod.stock > 0) {
                                      db.collection("cart " + useruid)
                                        .doc(prod.id)
                                        .set({
                                          ID: prod.id,
                                          category: prod.prodcategory,
                                          description: prod.proddescription,
                                          title: prod.prodtitle,
                                          price: +prod.selectedPrice,
                                          imgURL:
                                            prod.allImages[prod.imgselector],
                                          size: prod.selectedSize,
                                          meetup: prod.meetup,
                                          delivery: prod.delivery,
                                          variation: prod.selectedVariant,
                                          qty: 1,
                                          meetupLocSelector: "",
                                          stock: prod.stock,
                                          timestamp:
                                            firebase.firestore.FieldValue.serverTimestamp(),
                                        })
                                        .then(() => {
                                          if (prod.delivery === true) {
                                            db.collection("cart " + useruid)
                                              .doc(prod.id)
                                              .update({
                                                deliveryinfo:
                                                  prod.proddeliverydescription,
                                              });
                                          }
                                          if (prod.meetup === true) {
                                            for (
                                              let i = 0;
                                              i < prod.Alladdresses.length;
                                              i++
                                            ) {
                                              db.collection("cart " + useruid)
                                                .doc(prod.id)
                                                .update({
                                                  meetupaddress:
                                                    firebase.firestore.FieldValue.arrayUnion(
                                                      prod.Alladdresses[i]
                                                    ),
                                                });
                                            }
                                          }
                                        })
                                        .then(() => {
                                          db.collection("productinfo")
                                            .doc(prod.id)
                                            .update({
                                              selectedVariant: "",
                                              selectedSize: "",
                                            });
                                        })
                                        .then(() => {
                                          setSuccess("Added to cart");
                                          setSuccessPrimary("Successfully");
                                          setAdded(true);
                                          setTimeout(function () {
                                            setAdded(false);
                                          }, 3000);
                                        });
                                    } else {
                                      // alert("Product is out of stock");
                                      setError("Product is out of stock");
                                      setErrorPrimary("Add failed");
                                      setFailed(true);
                                    }
                                  } else {
                                    // alert("Please Select variation");
                                    setError("Please Select variation.");
                                    setErrorPrimary("Add failed");
                                    setFailed(true);
                                  }
                                }
                              } else {
                                history.push("/Signin");
                              }
                            }}
                          >
                            Add to cart
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          )}
          {products.length < 1 && (
            <div className="noprod">No products to show.</div>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Shop;
