import React, { useState, useEffect } from "react";
import "./user.scss";
import { Button } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import TextField from "@material-ui/core/TextField";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import { firestore } from "../../firebase/config";
import Avatar from "@material-ui/core/Avatar";
import Radio from "@material-ui/core/Radio";
import BlockRoundedIcon from "@mui/icons-material/BlockRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import Confirm from "../../components/PopupMessages/Confirmation";

var x = 0;
const db = firestore;
const formatter = new Intl.NumberFormat("en");

function User() {
  const [user, setUser] = useState([]);

  // const [row2, setRow2]=useState([]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const db = firestore;
  //     const data = await db.collection("users").get();
  //     setUser(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  //   };
  //   fetchData();
  // }, []);

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

  const [searchcontent, setSearchcontent] = useState("");
  const [searchvalue, setSearchvalue] = useState(false);
  const [selectedValue, setSelectedValue] = React.useState("a");
  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  console.log(selectedValue);

  const [focused, setFocused] = useState(false);

  const [confirmMsg, setConfirmMsg] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [userGet, setUserget] = useState("");
  const [accessGet, setAccessget] = useState("");

  const action = () => {
    if (accessGet === "allowed") {
      db.collection("users")
        .doc(userGet)
        .update({
          access: "blocked",
        })
        .then(() => {
          setConfirm(false);
          setUserget("");
          setAccessget("");
        });
    } else {
      db.collection("users")
        .doc(userGet)
        .update({
          access: "allowed",
        })
        .then(() => {
          setConfirm(false);
          setUserget("");
          setAccessget("");
        });
    }
  };
  const cancel = () => {
    setConfirm(false);
  };

  return (
    <div>
      <Confirm
        confirm={confirm}
        confirmMsg={confirmMsg}
        action={action}
        cancel={cancel}
      />
      <div className="userTopCont">
        <div className="userTitleCont">
          <h3 className="userTitle">Users</h3>
        </div>
      </div>
      <div className="userTableCont">
        <div className="userNumCont">
          <div className={focused ? "searchCont searchContF" : "searchCont"}>
            <TextField
              id="outlined-basic"
              placeholder="Search"
              variant="outlined"
              className="searchBar"
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

          <div className="radioBtns">
            <div className="rCont">
              <div className="r">
                <p>Asc</p>
                <Radio
                  checked={selectedValue === "a"}
                  onChange={handleChange}
                  value="a"
                  name="radio-button-demo"
                  style={{ color: "#00AB55" }}
                  // inputProps={{ "aria-label": "A" }}
                />
              </div>

              <div className="r">
                <p>Desc</p>
                <Radio
                  checked={selectedValue === "b"}
                  onChange={handleChange}
                  value="b"
                  name="radio-button-demo"
                  style={{ color: "#00AB55" }}
                  // inputProps={{ "aria-label": "B" }}
                />
              </div>
            </div>
          </div>

          <h2>{formatter.format(user.length)} users</h2>
        </div>
        <div className="userMapCont">
          <div className="columnSmall">
            <h3>Profile</h3>
            {user
              .filter((val) => {
                if (searchcontent === "") {
                  return val;
                } else if (
                  val.lastname
                    .toLowerCase()
                    .includes(searchcontent.toLowerCase()) ||
                  val.firstname
                    .toLowerCase()
                    .includes(searchcontent.toLowerCase()) ||
                  val.email
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
                    .includes(searchcontent.toLowerCase())
                ) {
                  return val;
                }
              })
              .map((use) => (
                <div className="insideUser" key={use.email}>
                  <Avatar
                    className="useAvatar"
                    alt={use.firstname}
                    src={use.imgURL}
                  />
                </div>
              ))}
          </div>
          <div className="columnL">
            <h3>Lastname</h3>
            {user
              .filter((val) => {
                if (searchcontent === "") {
                  return val;
                } else if (
                  val.lastname
                    .toLowerCase()
                    .includes(searchcontent.toLowerCase()) ||
                  val.firstname
                    .toLowerCase()
                    .includes(searchcontent.toLowerCase()) ||
                  val.email
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
                    .includes(searchcontent.toLowerCase())
                ) {
                  return val;
                }
              })
              .map((use) => (
                <div className="insideUser" key={use.email}>
                  {use.lastname}
                </div>
              ))}
          </div>
          <div className="columnL">
            <h3>Firstname</h3>
            {user
              .filter((val) => {
                if (searchcontent === "") {
                  return val;
                } else if (
                  val.lastname
                    .toLowerCase()
                    .includes(searchcontent.toLowerCase()) ||
                  val.firstname
                    .toLowerCase()
                    .includes(searchcontent.toLowerCase()) ||
                  val.email
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
                    .includes(searchcontent.toLowerCase())
                ) {
                  return val;
                }
              })
              .map((use) => (
                <div className="insideUser" key={use.email}>
                  {use.firstname}
                </div>
              ))}
          </div>
          <div className="column">
            <h3>Email</h3>
            {user
              .filter((val) => {
                if (searchcontent === "") {
                  return val;
                } else if (
                  val.lastname
                    .toLowerCase()
                    .includes(searchcontent.toLowerCase()) ||
                  val.firstname
                    .toLowerCase()
                    .includes(searchcontent.toLowerCase()) ||
                  val.email
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
                    .includes(searchcontent.toLowerCase())
                ) {
                  return val;
                }
              })
              .map((use) => (
                <div className="insideUser" key={use.email}>
                  {use.email}
                </div>
              ))}
          </div>
          <div className="columnWide">
            <h3>Address</h3>
            {user
              .sort((a, b) => {
                if (selectedValue === "a") {
                  if (a.lastname.toLowerCase() < b.lastname.toLowerCase())
                    return -1;
                  if (a.lastname.toLowerCase() > b.lastname.toLowerCase())
                    return 1;
                } else if (selectedValue === "b") {
                  if (a.lastname.toLowerCase() < b.lastname.toLowerCase())
                    return 1;
                  if (a.lastname.toLowerCase() > b.lastname.toLowerCase())
                    return -1;
                }

                return 0;
              })
              .filter((val) => {
                if (searchcontent === "") {
                  return val;
                } else if (
                  val.lastname
                    .toLowerCase()
                    .includes(searchcontent.toLowerCase()) ||
                  val.firstname
                    .toLowerCase()
                    .includes(searchcontent.toLowerCase()) ||
                  val.email
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
                    .includes(searchcontent.toLowerCase())
                ) {
                  return val;
                }
              })
              .map((use) => (
                <div className="insideUser" key={use.email}>
                  {use.brgy}
                  {", "}
                  {use.city}
                  {", "}
                  {use.province}
                </div>
              ))}
          </div>
          <div className="columnSmall">
            <h3>Action</h3>
            {user
              .filter((val) => {
                if (searchcontent === "") {
                  return val;
                } else if (
                  val.lastname
                    .toLowerCase()
                    .includes(searchcontent.toLowerCase()) ||
                  val.firstname
                    .toLowerCase()
                    .includes(searchcontent.toLowerCase()) ||
                  val.email
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
                    .includes(searchcontent.toLowerCase())
                ) {
                  return val;
                }
              })
              .map((use) => (
                <div className="insideUser" key={use.email}>
                  <IconButton
                    aria-label="search"
                    color="inherit"
                    className="deleteUserBtn"
                    onClick={() => {
                      setUserget(use.id);
                      setAccessget(use.access);
                      setConfirm(true);
                      if (use.access === "allowed") {
                        setConfirmMsg(
                          "Are you sure you want to block " +
                            use.firstname +
                            "?"
                        );
                      } else {
                        setConfirmMsg(
                          "Are you sure you want to unblock " +
                            use.firstname +
                            "?"
                        );
                      }
                    }}
                  >
                    {use.access === "allowed" ? (
                      <BlockRoundedIcon />
                    ) : (
                      <CheckCircleRoundedIcon />
                    )}
                  </IconButton>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default User;
