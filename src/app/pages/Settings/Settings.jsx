import React, { useEffect, useState } from "react";
import Nav from "../../components/nav/Nav";
import { Link, useHistory } from "react-router-dom";
import phil from "phil-reg-prov-mun-brgy";
import { useFormik } from "formik";
import {
  Avatar,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { auth, firestore, storage } from "../../firebase/config";
import "../Settings/Settings.scss";
import TextField from "@material-ui/core/TextField";
import { useSelector } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import MLink from "@mui/material/Link";
import HomeIcon from "@mui/icons-material/Home";
import SettingsRoundedIcon from "@material-ui/icons/SettingsRounded";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import Aos from "aos";
import firebase from "firebase";
import Messenger from "../Message/Message";

const initValue = {
  Firstname: "",
  Lastname: "",
  Bio: "",
  Gender: "",
};

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

function Settings() {
  const [avatar, setAvatar] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSCity] = useState([]);
  const [selectedBrgy, setSBrgy] = useState([]);
  const [city, setCity] = useState([]);
  const [barangay, setBarangay] = useState([]);
  const history = useHistory();
  const { data, status } = useSelector((state) => state.user);

  const [shownotif, setShownotif] = useState(false);

  const [userinfo, setUserinfo] = useState([]);
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
          setUserinfo(doc.data());
          // setUseruid(u.uid);
        })
        .catch((err) => {
          console.log(err);
        });
    });

    return unsub;
  }, []);

  const [check, setCheck] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const db = firestore;
      const data = await db.collection("statusheck").get();
      setCheck(data.docs.map((doc) => doc.data()));
    };
    fetchData();
  }, []);

  console.log(userinfo);

  const { handleSubmit, handleChange, values, isSubmitting } = useFormik({
    initialValues: data
      ? {
          Firstname: data.firstname,
          Lastname: data.lastname,
          Bio: data.bio,
        }
      : initValue,

    onSubmit: async (values, { setSubmitting, isSubmitting }) => {
      // const canvas = avatar.getImage().toDataURl();
      setSubmitting(true);
      try {
        let imgURL = "";
        if (avatar) {
          const res = await fetch(avatar);
          const blob = await res.blob();

          const imgRef = storage.ref().child(`profile/${user.uid}`);
          await imgRef.put(blob);

          imgURL = await imgRef.getDownloadURL();
        }
        let status = "";
        const stats = check.some((val) => {
          return val.status === "new";
        });
        if (stats === true) {
          await firestore
            .collection("users")
            .doc(user.uid)
            .set({
              imgURL,

              lastname: values.Lastname,
              firstname: values.Firstname,
              bio: values.Bio,

              province: selectedProvince.name,
              city: selectedCity.name,
              brgy: selectedBrgy.name,
              email: auth.currentUser.email,
              delFullname: "",
              delPhonenumber: "",
              delRegion: "",
              delProvince: "",
              delCity: "",
              delBrgy: "",
              delDetailedAddress: "",
              access: "allowed",
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            })
            .then(() => {
              firestore.collection("statusheck").doc("check").update({
                status: "logged",
              });
            });
        } else {
          await firestore.collection("users").doc(user.uid).update({
            imgURL,
            lastname: values.Lastname,
            firstname: values.Firstname,
            bio: values.Bio,
            province: selectedProvince.name,
            city: selectedCity.name,
            brgy: selectedBrgy.name,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          });
        }
      } catch (err) {
        console.log(err.message);
      }
      history.push("/");
    },
  });

  const classes = useStyles();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      if (!u) return history.push("/Signin");
      u.getIdTokenResult()
        .then(({ claims }) => {
          console.log(claims.role);
        })
        .catch((err) => {
          console.log(err);
        });
      setUser(u);
    });

    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const [toggleMsg, setToggleMsg] = useState(false);

  // if (status === "loading") return <h4>loading</h4>;
  // if (isSubmitting) return <Loading label="Loading" />;
  return (
    <div>
      <Nav
        shownotif={shownotif}
        setShownotif={setShownotif}
        setToggleMsg={setToggleMsg}
      />
      <Messenger toggleMsg={toggleMsg} setToggleMsg={setToggleMsg} />
      <div
        className="settingsCon"
        onClick={() => {
          setShownotif(false);
        }}
      >
        <div className="breadCont">
          <Breadcrumbs aria-label="breadcrumb">
            {check.map((val) =>
              val.status !== "new" ? (
                <MLink
                  underline="hover"
                  sx={{ display: "flex", alignItems: "center" }}
                  color="inherit"
                  href="/"
                >
                  <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                  HOME
                </MLink>
              ) : (
                <MLink
                  underline="hover"
                  sx={{ display: "flex", alignItems: "center" }}
                  color="inherit"
                  href="/settings"
                >
                  <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                  HOME
                </MLink>
              )
            )}

            <Typography
              sx={{ display: "flex", alignItems: "center" }}
              color="text.primary"
            >
              <SettingsRoundedIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              SETTINGS
            </Typography>
            <Typography
              sx={{ display: "flex", alignItems: "center" }}
              color="text.primary"
            >
              <EditRoundedIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              EDIT PROFILE
            </Typography>
          </Breadcrumbs>
        </div>
        <div className="setSubcontainer">
          <div className="sideNav">
            {color.map((col) => (
              <Link
                className="editpBtn"
                to=""
                style={{
                  color: col.color,
                  borderLeft: "2px solid",
                  borderLeftColor: col.color,
                }}
              >
                Edit profile
              </Link>
            ))}

            {/* <Link className="cpassBtn" to="">
            Change password
          </Link> */}
          </div>
          <div className="rightCon">
            <h1>Edit profile</h1>
            <h2>Profile photo</h2>
            <div className="editCon1">
              {/* {userinfo.map((val) => ( */}
              <div className="avatar">
                <Avatar src={avatar || userinfo.imgURL} />
              </div>
              {/* ))} */}
              <div className="con1Right">
                <p>Upload your avatar</p>
                <div className="upBtnCon">
                  <input
                    accept="image/*"
                    className={classes.input}
                    id="contained-button-filezz"
                    multiple
                    type="file"
                    onChange={(e) => {
                      setAvatar(URL.createObjectURL(e.target.files[0]));
                    }}
                  />
                  <label htmlFor="contained-button-filezz">
                    {color.map((col) => (
                      <Button
                        variant="contained"
                        color="primary"
                        component="span"
                        style={{ backgroundColor: col.color }}
                      >
                        Upload
                      </Button>
                    ))}
                  </label>
                </div>
              </div>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="publicP">
                <h2>Public profile</h2>

                <div className="txtCon">
                  <TextField
                    required
                    name="Firstname"
                    label="First name"
                    variant="outlined"
                    onChange={handleChange}
                    value={values.Firstname}
                    defaultValue={values.Firstname}
                  />
                </div>
                <div className="txtCon">
                  <TextField
                    required
                    name="Lastname"
                    label="Last name"
                    variant="outlined"
                    onChange={handleChange}
                    value={values.Lastname}
                  />
                </div>
                <div className="txtCon">
                  <TextField
                    required
                    name="Bio"
                    label={"Bio"}
                    multiline
                    rows={4}
                    variant="outlined"
                    onChange={handleChange}
                    value={values.Bio}
                  />
                </div>
              </div>

              <div className="locationP">
                <h3>Location</h3>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel id="demo-simple-select-outlined-label">
                    Province
                  </InputLabel>
                  <Select
                    required
                    value={selectedProvince || ""}
                    label={
                      selectedProvince !== "" && data
                        ? data.province
                        : "Province"
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      setSelectedProvince(value);

                      if (value) {
                        return setCity(
                          phil.city_mun.filter(
                            (c) => value.prov_code === c.prov_code
                          )
                        );
                      }
                    }}
                  >
                    <MenuItem value="">
                      <em>Select Province</em>
                    </MenuItem>

                    {phil.provinces
                      .sort((a, b) => {
                        if (a.name.toLowerCase() < b.name.toLowerCase())
                          return -1;
                        if (a.name.toLowerCase() > b.name.toLowerCase())
                          return 1;
                      })
                      .map((p, i) => (
                        <MenuItem key={i} value={p}>
                          {p.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>

                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel id="demo-simple-select-outlined-label">
                    City/Municipality
                  </InputLabel>
                  <Select
                    required
                    value={selectedCity || (data ? data.city : "")}
                    label="City/Municipality"
                    onChange={(e) => {
                      const value = e.target.value;
                      setSCity(value);

                      if (value) {
                        return setBarangay(
                          phil.barangays.filter(
                            (b) => value.mun_code === b.mun_code
                          )
                        );
                      }
                    }}
                  >
                    <MenuItem value="">
                      <em>Select City/Municipality</em>
                    </MenuItem>

                    {city
                      .sort((a, b) => {
                        if (a.name.toLowerCase() < b.name.toLowerCase())
                          return -1;
                        if (a.name.toLowerCase() > b.name.toLowerCase())
                          return 1;
                      })
                      .map((p, i) => (
                        <MenuItem key={i} value={p}>
                          {p.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>

                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel id="demo-simple-select-outlined-label">
                    Barangay
                  </InputLabel>
                  <Select
                    required
                    value={selectedBrgy || (data ? data.brgy : "")}
                    label="Barangay"
                    onChange={(e) => {
                      const value = e.target.value;
                      setSBrgy(value);

                      // if (value) {
                      //   return setBarangay(
                      //     phil.barangays.filter(
                      //       (b) => value.mun_code === b.mun_code
                      //     )
                      //   );
                      // }
                    }}
                  >
                    <MenuItem value="">
                      <em>Select Barangay</em>
                    </MenuItem>
                    {barangay
                      .sort((a, b) => {
                        if (a.name.toLowerCase() < b.name.toLowerCase())
                          return -1;
                        if (a.name.toLowerCase() > b.name.toLowerCase())
                          return 1;
                      })
                      .map((p, i) => (
                        <MenuItem key={i} value={p}>
                          {p.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </div>
              {color.map((col) => (
                <div className="btnCon">
                  <button
                    className="saveBtn"
                    type="submit"
                    disabled={isSubmitting}
                    style={{ backgroundColor: col.color }}
                  >
                    {isSubmitting ? <CircularProgress /> : " Save changes"}
                  </button>
                </div>
              ))}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
