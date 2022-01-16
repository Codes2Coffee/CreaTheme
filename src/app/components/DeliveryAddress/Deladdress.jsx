import React, { useState, useEffect } from "react";
import "./Deladdress.scss";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import ArrowForwardIosRoundedIcon from "@material-ui/icons/ArrowForwardIosRounded";
import { useHistory } from "react-router-dom";
import { auth, firestore } from "../../firebase/config";
import Aos from "aos";
import "aos/dist/aos.css";

function Deladdress() {
  const [status, setStatus] = useState("init");
  const history = useHistory();
  const [user, setUser] = useState(null);
  const [useruid, setUseruid] = useState("");

  const border = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  useEffect(() => {
    Aos.init({ duration: 9000 });

    const unsub = auth.onAuthStateChanged((u) => {
      if (!u) return history.push("/Signin");

      firestore
        .collection("users")
        .doc(u.uid)
        .get()
        .then((doc) => {
          if (!doc.exists) return setUser(u);
          setUser(doc.data());
          setUseruid(u.uid);
          setStatus("ok");
        })
        .catch((err) => {
          setStatus("error");
          console.log(err);
        });
    });

    return unsub;
  }, []);

  const [useradd, setUserAdd] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const db = firestore;
      db.collection("users").onSnapshot((snapshot) => {
        const newUser = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setUserAdd(newUser);
      });
    };
    fetchData();
  }, []);

  return (
    <div>
      {useradd
        .filter((val) => {
          return useruid === val.id;
        })
        .map((val) => (
          <div className="DeladdressSubCont">
            <div
              className="deliveryLocCont"
              onClick={() => {
                console.log("loc: ", window.location.pathname);
                if (window.location.pathname === "/cart") {
                  firestore
                    .collection("redirectCheck")
                    .doc("aa")
                    .set({
                      redirect: true,
                    })
                    .then(() => {
                      history.push("/profile/deliveryAddress");
                    });
                } else {
                  firestore
                    .collection("redirectCheck")
                    .doc("aa")
                    .set({
                      redirect: false,
                    })
                    .then(() => {
                      history.push("/profile/deliveryAddress");
                    });
                }
              }}
            >
              {user.delFullname !== "" ? (
                <div className="hasDeladdressCont">
                  <LocationOnIcon className="locIcon" />
                  <div className="line1">
                    <p>{val.delFullname + " | "}</p>
                    <p>{val.delPhonenumber}</p>
                  </div>
                  <p>{val.delDetailedAddress}</p>
                  <div className="line2">
                    <p>{val.delBrgy + ", "}</p>
                    <p>{val.delCity + ", "}</p>
                    <p>{val.delProvince + ", "}</p>
                    <p>{val.delRegion}</p>
                  </div>
                </div>
              ) : (
                <div>Setup your delivery Address</div>
              )}
              <div className="bottomBorder">
                {border.map(() => (
                  <div className="bottomLines">
                    <div className="red"></div>
                    <div className="blue"></div>
                  </div>
                ))}
              </div>
              <ArrowForwardIosRoundedIcon className="arrowIcon" />
            </div>
          </div>
        ))}
    </div>
  );
}

export default Deladdress;
