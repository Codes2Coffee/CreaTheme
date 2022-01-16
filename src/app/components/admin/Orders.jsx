import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSpring, animated } from "react-spring";
import "./Orders.scss";
import { firestore } from "../../firebase/config";
import Button from "@material-ui/core/Button";
import styled from "styled-components";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";

import DateTimePicker from "@mui/lab/DateTimePicker";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import Stack from "@mui/material/Stack";
import firebase from "firebase";

function Orders() {
  const [orders, setOrders] = useState([]);
  const formatter = new Intl.NumberFormat("en");

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
  const db = firestore;
  const [buttonSelector, setButtonSelector] = useState("pending");
  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal((prev) => !prev);
  };

  const Background = styled.div`
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
  `;

  const ModalWrapper = styled.div`
    width: 800px;
    height: 500px;
    box-shadow: 0 5px 16px rgba(0, 0, 0, 0.2);
    background: #fff;
    color: #000;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 10;
    border-radius: 10px;
  `;

  const ModalContent = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 500px;
    h2 {
      margin-bottom: 50px;
    }
  `;

  const CloseModalBtn = styled(CloseRoundedIcon)`
    cursor: pointer;
    position: absolute;
    top: 20px;
    right: 20px;
    width: 32px;
    height: 32px;
    padding: 0;
    z-index: 10;
  `;

  const modalRef = useRef();
  const animation = useSpring({
    config: {
      duration: 250,
    },
    opacity: showModal ? 1 : 0,
    transform: showModal ? "translateY(0%)" : "translateY(-100%)",
  });

  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      setShowModal(false);
    }
  };

  const keyPress = useCallback(
    (e) => {
      if (e.key === "Escape" && showModal) {
        setShowModal(false);
      }
    },
    [setShowModal, showModal]
  );

  useEffect(() => {
    document.addEventListener("keydown", keyPress);
    return () => document.removeEventListener("keydown", keyPress);
  }, [keyPress]);

  const [dealMethod, setDealMethod] = useState("");
  const [getID, setGetID] = useState("");

  const today = Date.now();
  const currentDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(today);
  console.log("cdate", currentDate);
  console.log("dateTime", Date().toLocaleString());

  const [sched, setSched] = useState("");
  console.log("sched: ", sched);

  const [date, setDate] = useState("");

  const handleChange = (newValue) => {
    const newdate = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
      hour: "numeric",
      minute: "numeric",
    }).format(newValue);
    setSched(newdate);
  };

  const handleChange2 = (newValue) => {
    const newdate = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
      hour: "numeric",
      minute: "numeric",
    }).format(newValue);
    setDate(newdate);
  };
  console.log(date);

  const [searchvalue, setSearchvalue] = useState(false);
  const [searchcontent, setSearchcontent] = useState("");

  const [getloc, setGetloc] = useState("");
  const [gettitle, setGettitle] = useState("");
  const [getuserid, setGetuserid] = useState("");

  const [focused, setFocused] = useState(false);

  return (
    <div>
      <h2 className="ordersTitle">Orders</h2>
      <div className="modalCont">
        {showModal ? (
          <Background ref={modalRef} onClick={closeModal}>
            <animated.div style={animation}>
              <ModalWrapper showModal={showModal}>
                {dealMethod === "meetup" && (
                  <ModalContent>
                    <h2>Set meet-up date and time</h2>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <Stack spacing={3}>
                        <DateTimePicker
                          label="Date&Time picker"
                          value={sched}
                          onChange={handleChange}
                          minDate={new Date()}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </Stack>
                    </LocalizationProvider>

                    <Button
                      className="setBtn"
                      variant="contained"
                      color="primary"
                      disabled={sched === "" ? true : false}
                      onClick={() => {
                        db.collection("orders")
                          .doc(getID)
                          .update({
                            status: "scheduled",
                            meetupDate: sched,
                            timestamp:
                              firebase.firestore.FieldValue.serverTimestamp(),
                          })
                          .then(() => {
                            setSched("");
                            db.collection("notify").doc().set({
                              dealmethod: dealMethod,
                              meetupDate: sched,
                              meetupLocation: getloc,
                              title: gettitle,
                              userID: getuserid,
                              notifdate: currentDate,
                              timestamp:
                                firebase.firestore.FieldValue.serverTimestamp(),
                              status: "unread",
                            });
                          });
                        setShowModal(false);
                      }}
                    >
                      Set schedule
                    </Button>
                  </ModalContent>
                )}
                {dealMethod === "delivery" && (
                  <ModalContent>
                    <h2>Set expected arrival of delivery</h2>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <Stack spacing={3}>
                        <DateTimePicker
                          label="Date&Time picker"
                          value={date}
                          minDate={new Date()}
                          onChange={handleChange2}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </Stack>
                    </LocalizationProvider>

                    <Button
                      className="setBtn"
                      variant="contained"
                      color="primary"
                      disabled={date === "" ? true : false}
                      onClick={() => {
                        db.collection("orders")
                          .doc(getID)
                          .update({
                            status: "shipped",
                            expectedDate: date,
                            timestamp:
                              firebase.firestore.FieldValue.serverTimestamp(),
                          })
                          .then(() => {
                            setDate("");
                            db.collection("notify").doc().set({
                              dealmethod: dealMethod,
                              deliveryDate: date,
                              deliveryLocation: getloc,
                              title: gettitle,
                              userID: getuserid,
                              timestamp:
                                firebase.firestore.FieldValue.serverTimestamp(),
                              status: "unread",
                            });
                          });
                        setShowModal(false);
                      }}
                    >
                      Ship
                    </Button>
                  </ModalContent>
                )}

                <CloseModalBtn
                  aria-label="Close modal"
                  onClick={() => {
                    setShowModal((prev) => !prev);
                  }}
                />
              </ModalWrapper>
            </animated.div>
          </Background>
        ) : null}
      </div>
      <div className="ordersCont">
        <div className="selectorTop"></div>
        {buttonSelector === "pending" && (
          <div
            className="selectorTop"
            style={{
              backgroundColor: "#FFDC00",
            }}
          ></div>
        )}

        {buttonSelector === "accepted" && (
          <div
            className="selectorTop"
            style={{
              transform: "translate(97px, 0px)",
              width: "90px",
              transition: "0.5s",
            }}
          ></div>
        )}
        {buttonSelector === "declined" && (
          <div
            className="selectorTop"
            style={{
              backgroundColor: "#E6191A",
            }}
          ></div>
        )}
        {buttonSelector === "completed" && (
          <div
            className="selectorTop"
            style={{
              backgroundColor: "#015CF6",
            }}
          ></div>
        )}

        {buttonSelector === "pending" && (
          <div
            className="selector"
            style={{
              transform: "translate(0px, 0px)",
              backgroundColor: "#FFDC00",
            }}
          ></div>
        )}

        {buttonSelector === "accepted" && (
          <div
            className="selector"
            style={{
              transform: "translate(97px, 0px)",
              width: "90px",
              transition: "0.5s",
            }}
          ></div>
        )}
        {buttonSelector === "declined" && (
          <div
            className="selector"
            style={{
              transform: "translate(205px, 0px)",
              width: "90px",
              transition: "0.5s",
              backgroundColor: "#E6191A",
            }}
          ></div>
        )}
        {buttonSelector === "completed" && (
          <div
            className="selector"
            style={{
              transform: "translate(312px, 0px)",
              width: "105px",
              transition: "0.5s",
              backgroundColor: "#015CF6",
            }}
          ></div>
        )}
        <div className="topWrapper">
          <div className="orderNavCont">
            <Button
              variant="text"
              style={
                buttonSelector === "pending"
                  ? { color: "white", marginRight: "20px" }
                  : { color: "black", marginRight: "20px" }
              }
              onClick={() => {
                setButtonSelector("pending");
              }}
            >
              Pending
            </Button>
            <Button
              variant="text"
              style={
                buttonSelector === "accepted"
                  ? { color: "white", marginRight: "20px" }
                  : { color: "black", marginRight: "20px" }
              }
              onClick={() => {
                setButtonSelector("accepted");
              }}
            >
              Accepted
            </Button>
            <Button
              variant="text"
              style={
                buttonSelector === "declined"
                  ? { color: "white", marginRight: "20px" }
                  : { color: "black", marginRight: "20px" }
              }
              onClick={() => {
                setButtonSelector("declined");
              }}
            >
              Declined
            </Button>
            <Button
              variant="text"
              style={
                buttonSelector === "completed"
                  ? { color: "white" }
                  : { color: "black" }
              }
              onClick={() => {
                setButtonSelector("completed");
              }}
            >
              Completed
            </Button>
          </div>
          <div className={focused ? "searchCont searchContF" : "searchCont"}>
            <TextField
              id="outlined-basic"
              placeholder="Search"
              variant="outlined"
              className="searchTxt"
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
        </div>

        {orders.length > 0 ? (
          <div className="ordersSubCont">
            {orders
              .filter((val) => {
                if (buttonSelector === "pending") {
                  if (searchcontent === "") {
                    return val.status === buttonSelector;
                  } else if (val.dealmethod === "delivery") {
                    if (
                      val.title
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.category
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.ordererFirstname
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.ordererLastname
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.ordererEmail
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.price.toString().includes(searchcontent) ||
                      val.detailedAddress
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.brgy
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.city
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.province
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.region
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.fullname
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.phonenumber.includes(searchcontent.toLowerCase()) ||
                      val.variation
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.size
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase())
                    ) {
                      return val.status === buttonSelector;
                    }
                  } else if (val.dealmethod === "meetup") {
                    if (
                      val.title
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.category
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.ordererFirstname
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.ordererLastname
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.ordererEmail
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.price.toString().includes(searchcontent) ||
                      val.meetupLocation
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.variation
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.size
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase())
                    ) {
                      return val.status === buttonSelector;
                    }
                  }
                } else if (buttonSelector === "accepted") {
                  if (searchcontent === "") {
                    return val.status === buttonSelector;
                  } else if (val.dealmethod === "delivery") {
                    if (
                      val.title
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.category
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.ordererFirstname
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.ordererLastname
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.ordererEmail
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.price.toString().includes(searchcontent) ||
                      val.detailedAddress
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.brgy
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.city
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.province
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.region
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.fullname
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.phonenumber.includes(searchcontent.toLowerCase()) ||
                      val.variation
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.size
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase())
                    ) {
                      return val.status === buttonSelector;
                    }
                  } else if (val.dealmethod === "meetup") {
                    if (
                      val.title
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.category
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.ordererFirstname
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.ordererLastname
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.ordererEmail
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.price.toString().includes(searchcontent) ||
                      val.meetupLocation
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.variation
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.size
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase())
                    ) {
                      return val.status === buttonSelector;
                    }
                  }
                } else if (buttonSelector === "declined") {
                  if (searchcontent === "") {
                    return val.status === buttonSelector;
                  } else if (val.dealmethod === "delivery") {
                    if (
                      val.title
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.category
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.ordererFirstname
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.ordererLastname
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.ordererEmail
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.price.toString().includes(searchcontent) ||
                      val.detailedAddress
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.brgy
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.city
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.province
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.region
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.fullname
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.phonenumber.includes(searchcontent.toLowerCase()) ||
                      val.variation
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.size
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase())
                    ) {
                      return val.status === buttonSelector;
                    }
                  } else if (val.dealmethod === "meetup") {
                    if (
                      val.title
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.category
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.ordererFirstname
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.ordererLastname
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.ordererEmail
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.price.toString().includes(searchcontent) ||
                      val.meetupLocation
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.variation
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.size
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase())
                    ) {
                      return val.status === buttonSelector;
                    }
                  }
                } else if (buttonSelector === "completed") {
                  if (searchcontent === "") {
                    return (
                      val.status === "scheduled" ||
                      val.status === "shipped" ||
                      val.status === "received"
                    );
                  } else if (val.dealmethod === "delivery") {
                    if (
                      val.title
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.category
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.ordererFirstname
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.ordererLastname
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.ordererEmail
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.price.toString().includes(searchcontent) ||
                      val.detailedAddress
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.brgy
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.city
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.province
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.region
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.fullname
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.phonenumber.includes(searchcontent.toLowerCase()) ||
                      val.variation
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.size
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase())
                    ) {
                      return (
                        val.status === "scheduled" ||
                        val.status === "shipped" ||
                        val.status === "received"
                      );
                    }
                  } else if (val.dealmethod === "meetup") {
                    if (
                      val.title
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.category
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.ordererFirstname
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.ordererLastname
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.ordererEmail
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.price.toString().includes(searchcontent) ||
                      val.meetupLocation
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.variation
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase()) ||
                      val.size
                        .toLowerCase()
                        .includes(searchcontent.toLowerCase())
                    ) {
                      return (
                        val.status === "scheduled" ||
                        val.status === "shipped" ||
                        val.status === "received"
                      );
                    }
                  }
                }
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
                    {items.status === "scheduled" ||
                    items.status === "shipped" ||
                    items.status === "received" ? (
                      <div className="statusCont">
                        <h4>Status: </h4>
                        {items.status === "scheduled" ||
                        items.status === "shipped" ? (
                          <h4 className="statCont" style={{ color: "#FFDC00" }}>
                            {" "}
                            {items.status}
                          </h4>
                        ) : (
                          <div></div>
                        )}
                        {items.status === "received" && (
                          <h4 className="statCont"> {items.status}</h4>
                        )}
                      </div>
                    ) : (
                      <div></div>
                    )}

                    {items.status !== "accepted" ? (
                      items.status !== "declined" ? (
                        items.status !== "pending" ? (
                          items.status !== "scheduled" &&
                          items.status !== "shipped" ? (
                            <div></div>
                          ) : (
                            <Button
                              variant="contained"
                              color="primary"
                              style={{ background: "maroon" }}
                              onClick={() => {
                                db.collection("orders").doc(items.id).update({
                                  status: "pending",
                                });
                              }}
                            >
                              Cancel
                            </Button>
                          )
                        ) : (
                          <Button
                            variant="contained"
                            color="primary"
                            style={{ background: "#00ab55" }}
                            onClick={() => {
                              db.collection("orders").doc(items.id).update({
                                status: "accepted",
                              });
                            }}
                          >
                            Accept
                          </Button>
                        )
                      ) : (
                        <Button
                          variant="contained"
                          color="primary"
                          style={{ background: "#00ab55" }}
                          onClick={() => {
                            db.collection("orders").doc(items.id).update({
                              status: "accepted",
                            });
                          }}
                        >
                          Accept
                        </Button>
                      )
                    ) : items.dealmethod === "meetup" ? (
                      <Button
                        variant="contained"
                        color="primary"
                        style={{ background: "#00ab55" }}
                        onClick={() => {
                          setDealMethod(items.dealmethod);
                          setGetID(items.id);
                          setGetloc(items.meetupLocation);
                          setGettitle(items.title);
                          setGetuserid(items.userID);
                          openModal();
                        }}
                      >
                        Schedule
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        style={{ background: "#00ab55", width: "105px" }}
                        onClick={() => {
                          setDealMethod(items.dealmethod);
                          setGetID(items.id);
                          setGetloc(
                            items.detailedAddress +
                              ", " +
                              items.brgy +
                              ", " +
                              items.city +
                              ", " +
                              items.province +
                              ", " +
                              items.region
                          );
                          setGettitle(items.title);
                          setGetuserid(items.userID);
                          openModal();
                        }}
                      >
                        Ship
                      </Button>
                    )}

                    {items.status === "pending" ? (
                      <Button
                        variant="contained"
                        color="primary"
                        style={{ background: "maroon" }}
                        onClick={() => {
                          db.collection("orders").doc(items.id).update({
                            status: "declined",
                          });
                        }}
                      >
                        Decline
                      </Button>
                    ) : (
                      items.status === "accepted" && (
                        <Button
                          variant="contained"
                          color="primary"
                          style={{ background: "maroon" }}
                          onClick={() => {
                            db.collection("orders").doc(items.id).update({
                              status: "pending",
                            });
                          }}
                        >
                          Cancel
                        </Button>
                      )
                    )}
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div>No Pending orders.</div>
        )}
      </div>
    </div>
  );
}

export default Orders;
