import React, { useState, useEffect } from "react";
import "./Cart.scss";
import Nav from "../../components/nav/Nav";
import { firestore, auth } from "../../firebase/config";
import Aos from "aos";
import Checkbox from "@material-ui/core/Checkbox";
import AddRoundedIcon from "@material-ui/icons/AddRounded";
import RemoveRoundedIcon from "@material-ui/icons/RemoveRounded";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import Button from "@material-ui/core/Button";
import Radio from "@material-ui/core/Radio";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Del from "../../components/DeliveryAddress/Deladdress";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import HomeIcon from "@mui/icons-material/Home";
import LocalMallIcon from "@material-ui/icons/LocalMall";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import firebase from "firebase";
import { useHistory } from "react-router-dom";
import Success from "../../components/PopupMessages/Successmessage";
import Error from "../../components/PopupMessages/Errormessage";
import Messenger from "../Message/Message";
import ModeCommentRoundedIcon from "@mui/icons-material/ModeCommentRounded";

function Cart() {
  const [user, setUser] = useState(null);
  const [useruid, setUseruid] = useState(null);
  const formatter = new Intl.NumberFormat("en");
  const db = firestore;
  const history = useHistory();
  const [toggleMsg, setToggleMsg] = useState(false);
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
  }, []);

  const [color, setColor] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const db = firestore;
      const data = await db.collection("webinfo").get();
      setColor(data.docs.map((doc) => doc.data()));
    };
    fetchData();
  }, []);

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

  const [orders, setOrders] = useState([]);
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

  let num = 0;
  cartProducts.map((items) =>
    items.marked ? (num = num + items.qty * items.price) : (num = num + 0)
  );

  console.log("subtotal: ", num);

  const [selectedValue, setSelectedValue] = useState("");
  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const [location, setLocation] = useState("");

  const [success, setSuccess] = useState("");
  const [successPrimary, setSuccessPrimary] = useState("");
  const [added, setAdded] = useState(false);

  const [failed, setFailed] = useState(false);
  const [error, setError] = useState("");
  const [errorPrimary, setErrorPrimary] = useState("");
  const [shownotif, setShownotif] = useState(false);

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
        className={
          failed ? "faliedContCart faliedContCartShow" : "faliedContCart"
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
        className="cartCont"
        style={failed ? { pointerEvents: "none" } : { pointerEvents: "auto" }}
      >
        <div className={added ? "sentCont sentContShow" : "sentCont"}>
          <Success
            success={success}
            successPrimary={successPrimary}
            added={added}
          />
        </div>
        <div className="breadCont">
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
            <Link
              underline="hover"
              sx={{ display: "flex", alignItems: "center" }}
              color="inherit"
              href="/shop"
            >
              <LocalMallIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              SHOP
            </Link>
            <Typography
              sx={{ display: "flex", alignItems: "center" }}
              color="text.primary"
            >
              <ShoppingCartIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              CART
            </Typography>
          </Breadcrumbs>
        </div>
        {cartProducts.length > 0 ? (
          <div
            className="cartSubCont"
            onClick={() => {
              setShownotif(false);
            }}
          >
            {cartProducts.map((items) => (
              <div className="cprodCard">
                <div className="toTop">
                  <div className="cpLeftCont">
                    <div className="checkBoxCont">
                      {color.map((col) => (
                        <Checkbox
                          checked={items.marked}
                          color="primary"
                          inputProps={{ "aria-label": "secondary checkbox" }}
                          className="cpCheckBox"
                          style={{ color: col.color }}
                          onChange={(e) => {
                            db.collection("cart " + useruid)
                              .doc(items.id)
                              .update({
                                marked: e.target.checked,
                              });
                          }}
                        />
                      ))}
                    </div>
                    <div className="cpImgCont">
                      <img src={items.imgURL} alt="cart-product" />
                    </div>
                    <div className="cpInfoCont">
                      <h3 className="cpTitle">{items.title}</h3>
                      <p>Variations:</p>
                      <p>
                        {items.variation} {items.size}
                      </p>
                      <h2>₱ {formatter.format(items.price)}</h2>
                    </div>
                  </div>
                  {color.map((col) => (
                    <div className="dealCont">
                      {items.meetup ? (
                        <div className="meetupWrapper">
                          <div className="meetupCont">
                            <Radio
                              checked={items.dselector === "a"}
                              onChange={() => {
                                db.collection("cart " + useruid)
                                  .doc(items.id)
                                  .update({
                                    dselector: "a",
                                  });
                              }}
                              value="a"
                              className="meetupRadio"
                              name="radio-button-demo"
                              style={{ color: col.color }}
                            />{" "}
                            <h4>Meet-up</h4>
                          </div>
                          {items.dselector === "a" ? (
                            <div className="locPrev">
                              <FormControl
                                variant="outlined"
                                className="locationSelect"
                              >
                                <InputLabel id="demo-simple-select-outlined-label">
                                  Locations
                                </InputLabel>
                                <Select
                                  labelId="demo-simple-select-outlined-label"
                                  id="demo-simple-select-outlined"
                                  value={items.meetupLocSelector}
                                  defaultValue={""}
                                  onChange={(e) => {
                                    db.collection("cart " + useruid)
                                      .doc(items.id)
                                      .update({
                                        meetupLocSelector: e.target.value,
                                      });
                                  }}
                                  label="Location"
                                >
                                  <MenuItem value={""}>
                                    Select Location
                                  </MenuItem>
                                  {items.meetupaddress.map((loc) => (
                                    <MenuItem value={loc}>{loc}</MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </div>
                          ) : (
                            <div></div>
                          )}
                        </div>
                      ) : (
                        <div></div>
                      )}
                      {items.delivery ? (
                        <div className="deliveryWrapper">
                          <div className="deliveryCont">
                            <Radio
                              checked={items.dselector === "b"}
                              onChange={() => {
                                db.collection("cart " + useruid)
                                  .doc(items.id)
                                  .update({
                                    dselector: "b",
                                  });
                              }}
                              value="b"
                              className="deliveryRadio"
                              name="radio-button-demo"
                              style={{ color: col.color }}
                            />{" "}
                            <h4>Delivery</h4>
                          </div>
                          {items.dselector === "b" ? (
                            <div className="deliveryInfoPrev">
                              <TextField
                                id="standard-multiline-static"
                                className="delInfoTxt"
                                multiline
                                rows={2}
                                defaultValue={items.deliveryinfo}
                                value={items.deliveryinfo}
                                disabled={true}
                              />
                              <div className="delWrap">
                                <div className="delCont">
                                  <Del className="delComp" />
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div></div>
                          )}
                        </div>
                      ) : (
                        <div></div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="toBottom">
                  <div className="cpMidCont">
                    <IconButton
                      aria-label="search"
                      color="inherit"
                      className="cpMinusBtn"
                      onClick={() => {
                        if (items.qty > 0) {
                          db.collection("cart " + useruid)
                            .doc(items.id)
                            .update({
                              qty: items.qty - 1,
                            })
                            .then(() => {});
                          console.log(items.qty, items.id);
                        } else {
                          db.collection("cart " + useruid)
                            .doc(items.id)
                            .update({
                              marked: false,
                            });
                        }
                      }}
                    >
                      <RemoveRoundedIcon />
                    </IconButton>
                    <div className="qtyCont">
                      <h2>{items.qty}</h2>
                    </div>
                    <IconButton
                      aria-label="search"
                      color="inherit"
                      className="cpPlusBtn"
                      onClick={() => {
                        db.collection("cart " + useruid)
                          .doc(items.id)
                          .update({
                            qty: items.qty + 1,
                          })
                          .then(() => {});
                        console.log(items.qty, items.id);
                      }}
                    >
                      <AddRoundedIcon />
                    </IconButton>
                  </div>
                  <div className="cpRightCont">
                    <IconButton
                      aria-label="search"
                      color="inherit"
                      className="cpDeleteBtn"
                      onClick={() => {
                        db.collection("cart " + useruid)
                          .doc(items.id)
                          .delete();
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                  <div className="cpEndCont">
                    <p>
                      ₱ {formatter.format(items.price)} x {items.qty}
                    </p>
                    <p>₱ {formatter.format(items.price * items.qty)}</p>
                  </div>
                </div>
              </div>
            ))}
            <div className="subTotalCont">
              <h1>Subtotal: ₱ {formatter.format(num)}</h1>
            </div>
            {color.map((col) => (
              <div className="orderBtnCont">
                <Button
                  variant="contained"
                  color="primary"
                  className="orderBtn"
                  style={{ backgroundColor: col.color }}
                  disabled={num === 0 ? true : false}
                  onClick={() => {
                    console.log(num);

                    cartProducts
                      .filter((val) => {
                        return val.marked === true;
                      })
                      .map((items) => {
                        if (num > 0) {
                          if (items.qty > 0) {
                            if (items.dselector === "a") {
                              if (items.meetupLocSelector !== "") {
                                if (items.stock > items.qty) {
                                  db.collection("orders")
                                    .doc()
                                    .set({
                                      ID: items.id,
                                      userID: useruid,
                                      imgURL: items.imgURL,
                                      category: items.category,
                                      title: items.title,
                                      variation: items.variation,
                                      size: items.size,
                                      qty: items.qty,
                                      price: items.price * items.qty,
                                      dealmethod: "meetup",
                                      meetupLocation: items.meetupLocSelector,
                                      ordererFirstname: user.firstname,
                                      ordererLastname: user.lastname,
                                      ordererEmail: user.email,
                                      status: "pending",
                                      timestamp:
                                        firebase.firestore.FieldValue.serverTimestamp(),
                                    })
                                    .then(() => {
                                      db.collection("cart " + useruid)
                                        .doc(items.id)
                                        .delete();
                                    })
                                    .then(() => {
                                      setSuccessPrimary("Sent");
                                      setSuccess(
                                        "Your order has been sent to seller"
                                      );
                                      setAdded("true");
                                      setTimeout(function () {
                                        setAdded(false);
                                      }, 3000);
                                    });
                                } else {
                                  // alert("Not enough stock on " + items.title);
                                  setError(
                                    "Not enough stock on " + items.title + "."
                                  );
                                  setErrorPrimary("Order failed");
                                  setFailed(true);
                                }
                              } else {
                                // alert("Please select meetup location");
                                setError("Please select meetup location");
                                setErrorPrimary("Order failed");
                                setFailed(true);
                              }
                            } else if (items.dselector === "b") {
                              if (user.delFullname !== "") {
                                if (items.stock > items.qty) {
                                  db.collection("orders")
                                    .doc()
                                    .set({
                                      ID: items.id,
                                      userID: useruid,
                                      imgURL: items.imgURL,
                                      category: items.category,
                                      title: items.title,
                                      variation: items.variation,
                                      size: items.size,
                                      qty: items.qty,
                                      price: items.price * items.qty,
                                      dealmethod: "delivery",
                                      fullname: user.delFullname,
                                      phonenumber: user.delPhonenumber,
                                      brgy: user.delBrgy,
                                      city: user.delCity,
                                      province: user.delProvince,
                                      region: user.delRegion,
                                      detailedAddress: user.delDetailedAddress,
                                      ordererFirstname: user.firstname,
                                      ordererLastname: user.lastname,
                                      ordererEmail: user.email,
                                      status: "pending",
                                      timestamp:
                                        firebase.firestore.FieldValue.serverTimestamp(),
                                    })
                                    .then(() => {
                                      db.collection("cart " + useruid)
                                        .doc(items.id)
                                        .delete();
                                    })
                                    .then(() => {
                                      setSuccessPrimary("Sent");
                                      setSuccess(
                                        "Your order has been sent to seller"
                                      );
                                      setAdded("true");
                                      setTimeout(function () {
                                        setAdded(false);
                                      }, 3000);
                                    });
                                } else {
                                  // alert("Not enough stock on " + items.title);
                                  setError(
                                    "Not enough stock on " + items.title + "."
                                  );
                                  setErrorPrimary("Order failed");
                                  setFailed(true);
                                }
                              } else {
                                // alert("Please set-up your delivery Address");
                                setError("Please set-up your delivery Address");
                                setErrorPrimary("Order failed");
                                setFailed(true);
                              }
                            }
                          } else {
                            // alert("Add quantity to marked products");
                            setError("Add quantity to marked products");
                            setErrorPrimary("Order failed");
                            setFailed(true);
                          }
                        } else if (num === 0) {
                          // alert("Please select items to order");
                          setError("Please select items to order");
                          setErrorPrimary("Order failed");
                          setFailed(true);
                        }
                      });
                  }}
                >
                  {num > 0 ? "Proceed to order" : "Select item"}
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="cartEmpty"
            onClick={() => {
              setShownotif(false);
            }}
          >
            <h2>Cart is Empty go to shop to add some</h2>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
