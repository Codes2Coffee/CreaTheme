// todo price and sizes edit to array
import React, { useState, useEffect } from "react";
import "./Home.scss";
import Nav from "../../components/nav/Nav";
import catimg1 from "../../images/orna2.jpg";
import catimg2 from "../../images/orna5.jpg";
import catimg3 from "../../images/orna8.jpg";
import featimg1 from "../../images/fruit5.jpg";
import featimg2 from "../../images/frt4.png";
import featimg3 from "../../images/fruit7.png";
import featimg4 from "../../images/fruit6.jpg";
import freshimg1 from "../../images/vege1.jpg";
import freshimg2 from "../../images/kintsay.jpg";
import freshimg3 from "../../images/pipino.jpg";
import freshimg4 from "../../images/lime.jpg";
import freshimg5 from "../../images/plant1.jpg";
import freshimg6 from "../../images/plant2.jpg";
import freshimg7 from "../../images/plant3.jpg";
import freshimg8 from "../../images/plant4.jpg";
import { Link } from "react-router-dom";
import { BsStarFill } from "react-icons/bs";
import { BsStarHalf } from "react-icons/bs";
import { BsStar } from "react-icons/bs";
import Aos from "aos";
import "aos/dist/aos.css";
// import Popover from "@material-ui/core/Popover";
import { auth, firestore } from "../../firebase/config";
import Illu from "../../components/illustrations/Illustration";
import Foot from "../../components/Footer/Footer";
import IconButton from "@material-ui/core/IconButton";
import ArrowForwardIosRoundedIcon from "@material-ui/icons/ArrowForwardIosRounded";
import ArrowBackIosRoundedIcon from "@material-ui/icons/ArrowBackIosRounded";
import Button from "@material-ui/core/Button";
import firebase from "firebase";
import { useHistory } from "react-router-dom";
import ArrowForwardRoundedIcon from "@material-ui/icons//ArrowForwardRounded";
import FavoriteBorderRoundedIcon from "@material-ui/icons/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@material-ui/icons/FavoriteRounded";
import Success from "../../components/PopupMessages/Successmessage";
import Error from "../../components/PopupMessages/Errormessage";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import Messenger from "../Message/Message";
import ModeCommentRoundedIcon from "@mui/icons-material/ModeCommentRounded";

function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState([]);
  const [useruid, setUseruid] = useState(null);
  const [variant, setVariant] = useState("");
  const [size, setSize] = useState("");
  const [showHeart, setShowheart] = useState(false);
  const history = useHistory();
  const [toggleMsg, setToggleMsg] = useState(false);
  useEffect(() => {
    Aos.init({ duration: 9000 });
    setLoading(true);
    const unsub = auth.onAuthStateChanged((u) => {
      if (!u) return setUser(null);
      u.getIdTokenResult()
        .then(({ claims }) => {
          console.log(claims);
        })
        .catch((err) => {
          console.log(err);
        });
      setUser(u);
      setUseruid(u.uid);
    });

    return unsub;
  }, []);

  const [st, setSt] = useState(false);
  const [dFoot, setDfoot] = useState(false);
  useEffect(() => {
    const onscroll = (e) => {
      if (window.scrollY > 4100) {
        return setDfoot(true);
      } else if (window.scrollY <= 4200) {
        setDfoot(false);
      } else if (window.scrollY > 2759) {
        setSt(true);
      } else if (window.scrollY <= 3117) {
        setSt(false);
      }
      console.log(window.scrollY);
    };
    window.addEventListener("scroll", onscroll);
    return () => {
      window.removeEventListener("scroll", onscroll);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const db = firestore;
      db.collection("webinfo").onSnapshot((snapshot) => {
        const newTitle = snapshot.docs.map((doc) => doc.data());
        setTitle(newTitle);
      });
    };
    fetchData();
  }, []);

  const db = firestore;
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
  const formatter = new Intl.NumberFormat("en");

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

  const [topproducts, setTopproducts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const db = firestore;
      db.collection("productinfo")
        .orderBy("sold", "desc")
        .limit(10)
        .onSnapshot((snapshot) => {
          const newProduct = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          setTopproducts(newProduct);
        });
    };
    fetchData();
  }, []);
  console.log(topproducts);
  let liked;

  function truncate(input) {
    if (input.length > 15) {
      return input.substring(0, 15) + "...";
    }
    return input;
  }

  const hasTop = topproducts.some((val) => {
    return val.sold > 0;
  });

  const [success, setSuccess] = useState("");
  const [successPrimary, setSuccessPrimary] = useState("");
  const [added, setAdded] = useState(false);

  const [failed, setFailed] = useState(false);
  const [error, setError] = useState("");
  const [errorPrimary, setErrorPrimary] = useState("");

  const [shownotif, setShownotif] = useState(false);
  let formatterCompact = Intl.NumberFormat("en", { notation: "compact" });

  return (
    <div>
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

      <div
        className={
          failed ? "faliedContHome faliedContHomeShow" : "faliedContHome"
        }
      >
        <Error
          error={error}
          errorPrimary={errorPrimary}
          failed={failed}
          setFailed={setFailed}
        />
      </div>
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
        className="home"
        style={failed ? { pointerEvents: "none" } : { pointerEvents: "fill" }}
        onClick={() => {
          setShownotif(false);
        }}
      >
        <div className="wrap1"></div>

        <div className="header">
          <div className="container">
            <div className="row">
              <div className="col2">
                {title.map((tit) => (
                  <h1
                    className="welc"
                    style={{ fontFamily: tit.font, color: tit.color1 }}
                  >
                    Welcome to
                  </h1>
                ))}

                <div className="ctitle">
                  {title.map((tit) => (
                    <h1
                      className="ag"
                      style={{ fontFamily: tit.font, color: tit.color }}
                    >
                      {tit.title}
                    </h1>
                  ))}
                </div>
                {title.map((tit) => (
                  <p
                    className="slogan"
                    style={{ fontFamily: tit.font, color: tit.color }}
                  >
                    {tit.tag + "."}
                  </p>
                ))}

                {title.map((tit) =>
                  user ? (
                    <Link
                      to="/shop"
                      className="shopbtn"
                      style={{ backgroundColor: tit.color }}
                    >
                      Shop now
                    </Link>
                  ) : (
                    <Link
                      to="/Signin"
                      className="shopbtn"
                      style={{ backgroundColor: tit.color }}
                    >
                      Shop now
                    </Link>
                  )
                )}
              </div>
              <div className="col2-b">
                {/* <img src={sideImg} alt="sideImg" /> */}
                <Illu />
              </div>
            </div>
          </div>
        </div>

        <div className="categories">
          <div className="scontainer">
            {/* <div className="row">
              <div className="col3">
                <img src={catimg1} alt="img" width="400px" />
              </div>
              <div className="col3">
                <img src={catimg2} alt="img" width="400px" />
              </div>
              <div className="col3">
                <img src={catimg3} alt="img" width="400px" />
              </div>
            </div> */}
          </div>
        </div>

        {/* <!-- Featured Products --> */}

        <div className="scontainer">
          <h2 className="title">Featured Products</h2>
          <div className="row">
            {products
              .filter((val) => {
                if (val.featured === true) {
                  return val;
                }
              })
              .map((prod) => (
                <div className="prodWrap">
                  <div className="productCard" key={prod.id}>
                    <div className="prodTopCont">
                      <div className="imgWrapper">
                        <IconButton
                          aria-label="search"
                          color="inherit"
                          className="prevBtn"
                          onClick={() => {
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
                        <div className="prodImageCont">
                          <img
                            src={prod.allImages[prod.imgselector]}
                            alt={prod.title}
                          />
                        </div>
                        <IconButton
                          aria-label="search"
                          color="inherit"
                          className="nextBtn"
                          onClick={() => {
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
                      <h3 className="ptitle">{truncate(prod.prodtitle)}</h3>
                      {/* <h3 className="price">
                        ₱ {formatter.format(prod.prodprice)}
                      </h3> */}
                      {prod.Allprices.sort((a, b) => {
                        if (a.value > b.value) return 1;
                        if (a.value < b.value) return -1;
                      }).map(
                        (prs, index) =>
                          index < 1 && (
                            <h3 className="price1" style={{ fontSize: "15px" }}>
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
                            <h3 className="price2" style={{ fontSize: "15px" }}>
                              ₱ {formatter.format(prs.value)}
                            </h3>
                          )
                      )}
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
                            const prc = prod.Allprices.filter((val) => {
                              return val.id === as.id;
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
                                // alert(
                                //   "This product already exist in your cart!"
                                // );
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
                  <div
                    className={
                      prod.showdes
                        ? "descriptionCont descriptionShow"
                        : "descriptionCont"
                    }
                  >
                    <p>Description: {prod.proddescription}</p>
                  </div>
                </div>
              ))}
          </div>

          {/* <!-- Freshly Added --> */}

          {hasTop && <h2 className="title">Top Products</h2>}

          <div className="row">
            {topproducts
              .filter((val) => {
                return val.sold > 0;
              })
              .map((prod) => (
                <div className="prodWrap">
                  <div className="productCard" key={prod.id}>
                    <div className="prodTopCont">
                      <div className="imgWrapper">
                        <IconButton
                          aria-label="search"
                          color="inherit"
                          className="prevBtn"
                          onClick={() => {
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
                        <div className="prodImageCont">
                          <img
                            src={prod.allImages[prod.imgselector]}
                            alt={prod.title}
                          />
                        </div>
                        <IconButton
                          aria-label="search"
                          color="inherit"
                          className="nextBtn"
                          onClick={() => {
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
                      <h3 className="ptitle">{prod.prodtitle}</h3>
                      {/* <h3 className="price">
                        ₱ {formatter.format(prod.prodprice)}
                      </h3> */}
                      {prod.Allprices.sort((a, b) => {
                        if (a.value > b.value) return 1;
                        if (a.value < b.value) return -1;
                      }).map(
                        (prs, index) =>
                          index < 1 && (
                            <h3 className="price1">
                              ₱ {formatter.format(prs.value)}
                            </h3>
                          )
                      )}
                      <h3>~</h3>
                      {prod.Allprices.sort((a, b) => {
                        if (a.value > b.value) return -1;
                        if (a.value < b.value) return 1;
                      }).map(
                        (prs, index) =>
                          index < 1 && (
                            <h3 className="price2">
                              ₱ {formatter.format(prs.value)}
                            </h3>
                          )
                      )}
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
                            const prc = prod.Allsizes.filter((prs) => {
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
                                // alert(
                                //   "This product already exist in your cart!"
                                // );
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
                                        price: +prod.prodprice,
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
              ))}
          </div>
        </div>

        <div className="see">
          {title.map((tit) =>
            user ? (
              <Link
                className="seeBtn"
                to="/shop"
                style={{ backgroundColor: tit.color }}
              >
                SEE MORE
              </Link>
            ) : (
              <Link
                className="seeBtn"
                to="/Signin"
                style={{ backgroundColor: tit.color }}
              >
                SEE MORE
              </Link>
            )
          )}
        </div>
        <div className="footerCont">
          <Foot />
        </div>
      </div>
    </div>
  );
}

export default Home;
