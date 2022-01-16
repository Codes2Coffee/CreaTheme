import React, { useState, useEffect } from "react";
import "./Likes.scss";
import { firestore, auth } from "../../firebase/config";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";
import firebase from "firebase";
import IconButton from "@material-ui/core/IconButton";
import ArrowForwardIosRoundedIcon from "@material-ui/icons/ArrowForwardIosRounded";
import ArrowBackIosRoundedIcon from "@material-ui/icons/ArrowBackIosRounded";
import FavoriteBorderRoundedIcon from "@material-ui/icons/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@material-ui/icons/FavoriteRounded";
import Aos from "aos";
import ArrowForwardRoundedIcon from "@material-ui/icons//ArrowForwardRounded";
import Success from "../../components/PopupMessages/Successmessage";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { BiMenuAltLeft } from "react-icons/bi";
import Spinner from "../../components/Spinner/Spinner";
import Error from "../PopupMessages/Errormessage";
import Avatar from "@mui/material/Avatar";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";

function Likes() {
  const db = firestore;
  const history = useHistory();
  const formatter = new Intl.NumberFormat("en");
  const [variant, setVariant] = useState("");
  const [size, setSize] = useState("");

  const [user, setUser] = useState(null);
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

  const [products, setProducts] = useState([]);
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

  function truncate(input) {
    if (input.length > 15) {
      return input.substring(0, 15) + "...";
    }
    return input;
  }

  const [cartprodID, setCartprodID] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const db = firestore;
      db.collection("cart " + useruid).onSnapshot((snapshot) => {
        const newCartProduct = snapshot.docs.map((doc) => ({
          id: doc.id,
        }));
        setCartprodID(newCartProduct);
      });
    };
    fetchData();
  }, [useruid]);

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

  var y = "";
  color.map((cols) => (y = cols.color));
  let liked;

  let hasLiked = false;
  products.map((item) =>
    item.allLikes.map((val) => {
      if (val === useruid) {
        hasLiked = true;
      }
      return val;
    })
  );
  console.log(hasLiked);

  const [success, setSuccess] = useState("");
  const [successPrimary, setSuccessPrimary] = useState("");

  const [added, setAdded] = useState(false);
  const [preview, setPreview] = useState(false);
  //passingData
  const [passimg, setPassimg] = useState([]);
  const [passtitle, setPasstitle] = useState("");
  const [passprice, setPassprice] = useState("");
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
  const [passHascart, setPasshascart] = useState(false);
  const [passstock, setPassstock] = useState(0);
  const [passcategory, setPasscategory] = useState("");
  const [passmeetup, setPassmeetup] = useState(false);
  const [passdelivery, setPassdelivery] = useState(false);
  const [passHasComment, setPassHasComment] = useState(false);

  const [spin, setSpin] = useState(false);

  const [failed, setFailed] = useState(false);
  const [error, setError] = useState("");
  const [errorPrimary, setErrorPrimary] = useState("");
  let formatterCompact = Intl.NumberFormat("en", { notation: "compact" });

  return (
    <div>
      <div
        className="spinnerCont2"
        style={
          spin
            ? { zIndex: "12", display: "block" }
            : { zIndex: "12", display: "none" }
        }
      >
        <Spinner />
      </div>
      <div className={added ? "addedCont addedContShow" : "addedCont"}>
        <Success
          success={success}
          added={added}
          successPrimary={successPrimary}
        />
      </div>
      <div
        className={
          failed ? "faliedContLikes faliedContLikesShow" : "faliedContLikes"
        }
      >
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
            ? "botPreviewWrapper2 botPreviewWrapperShow2"
            : "botPreviewWrapper2"
        }
      >
        <div
          className={preview ? "botPreview2 botPreviewShow2" : "botPreview2"}
        >
          <div className="closeMainBtnCont">
            <IconButton
              className="closeMainBtn"
              onClick={async () => {
                await db
                  .collection("productinfo")
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
                      setPassprice("");
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
            <h3>{passlike}</h3>
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
                              price: +passprice,
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
                                for (let i = 0; i < passlocation.length; i++) {
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
                                    setPassprice("");
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
                          setError("Not enough stock on ", passtitle + ".");
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
                      // alert("This product already exist in your cart!");
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
                <h1> ₱ {formatter.format(passprice)}</h1>
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
                          passSelectedS === val
                            ? { backgroundColor: col.color, color: "#fff" }
                            : { backgroundColor: "#fff" }
                        }
                        onClick={() => {
                          if (passSelectedS === val) {
                            setPassSelectedS("");
                          } else {
                            setPassSelectedS(val);
                          }
                        }}
                      >
                        {val}
                      </Button>
                    ))
                  )}
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
                            <p style={{ fontSize: "smaller", opacity: "0.7" }}>
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
                <div>No reviews yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div
        className="likesSubCont"
        style={failed ? { pointerEvents: "none" } : { pointerEvents: "auto" }}
      >
        {hasLiked && <h2>Liked products</h2>}

        {hasLiked ? (
          products
            .filter((val) => {
              return val.allLikes.some((items) => {
                return items === useruid;
              });
            })
            .map((prod) => (
              <div className="prodWrap">
                <div className="productCard" key={prod.id}>
                  <div className="topBurger" style={{ display: "none" }}>
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
                            setPassprice(prod.prodprice);
                            setPassdescription(prod.proddescription);
                            setPassdate(prod.dateupload);
                            setPasslike(prod.allLikes.length);
                            setPassdeliverydes(prod.proddeliverydescription);
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
                          <BiMenuAltLeft />
                        </div>
                      ) : (
                        <div className="closeMain">
                          <BiMenuAltLeft />
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
                            db.collection("productinfo").doc(prod.id).update({
                              imgSelector: false,
                            });
                          } else {
                            db.collection("productinfo").doc(prod.id).update({
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
                            db.collection("productinfo").doc(prod.id).update({
                              imgSelector: false,
                            });
                          } else {
                            db.collection("productinfo").doc(prod.id).update({
                              imgSelector: true,
                            });
                          }
                          if (prod.imgselector < prod.allImages.length - 1) {
                            db.collection("productinfo")
                              .doc(prod.id)
                              .update({
                                imgselector: prod.imgselector + 1,
                              });
                          } else {
                            db.collection("productinfo").doc(prod.id).update({
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
                    {/* <h3 className="price">
                      ₱ {formatter.format(prod.prodprice)}
                    </h3> */}
                    <div className="likePriceCont">
                      {prod.Allprices.sort((a, b) => {
                        if (a.value > b.value) return 1;
                        if (a.value < b.value) return -1;
                      }).map(
                        (prs, index) =>
                          index < 1 && (
                            <h3 className="price" style={{ fontSize: "15px" }}>
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
                            <h3 className="price" style={{ fontSize: "15px" }}>
                              ₱ {formatter.format(prs.value)}
                            </h3>
                          )
                      )}
                    </div>
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
                            db.collection("productinfo").doc(prod.id).update({
                              selectedVariant: "",
                            });
                          } else {
                            db.collection("productinfo").doc(prod.id).update({
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
                          const prc = prod.Allprices.filter((prs) => {
                            return prs.id === as.id;
                          });
                          if (prod.selectedSize === as.value) {
                            db.collection("productinfo").doc(prod.id).update({
                              selectedSize: "",
                            });
                          } else {
                            db.collection("productinfo").doc(prod.id).update({
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
                      <Typography component="legend">Rating</Typography>
                      <Rating
                        name="read-only"
                        value={((prod.totalrate / (prod.rating * 5)) * 10) / 2}
                        readOnly
                      />
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
                              // alert("This product already exist in your cart!");
                              setError(
                                "This product already exist in your cart."
                              );
                              setErrorPrimary("Add failed");
                              setFailed(true);
                              db.collection("productinfo").doc(prod.id).update({
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
                                      price: +prod.prodprice,
                                      imgURL: prod.allImages[prod.imgselector],
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
                                  setError("Product is out of stock.");
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
            ))
        ) : (
          <div>You haven't liked any products yet.</div>
        )}
      </div>
    </div>
  );
}

export default Likes;
