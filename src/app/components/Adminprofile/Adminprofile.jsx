import React, { useEffect, useState } from "react";
import "./Adminprofile.scss";
import { useHistory } from "react-router-dom";
import phil from "phil-reg-prov-mun-brgy";
import { useFormik, Link } from "formik";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { firestore, storage } from "../../firebase/config";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
  Avatar,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";

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

function Adminprofile() {
  const [avatar, setAvatar] = useState();
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSCity] = useState([]);
  const [selectedBrgy, setSBrgy] = useState([]);
  const [city, setCity] = useState([]);
  const [barangay, setBarangay] = useState([]);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [bio, setBio] = useState("");

  const [admin, setAdmin] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const db = firestore;
      db.collection("admin").onSnapshot((snapshot) => {
        const newAdmin = snapshot.docs.map((doc) => doc.data());
        setAdmin(newAdmin);
      });
    };
    fetchData();
  }, []);

  const [imgSubmit, setImgSubmit] = useState(false);
  const handleUpload = (e) => {
    setImgSubmit(true);
    // setAvatar(URL.createObjectURL(e.target.files[0]));
    const img = e.target.files[0];
    const imgu = URL.createObjectURL(e.target.files[0]);
    const uploadTask = storage.ref(`adminprofile/${img.name}`).put(img);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        // setProgressnum2(progress);
      },
      (error) => {
        console.log(error);
      },
      async () => {
        try {
          let imgURL = "";
          if (imgu) {
            const res = await fetch(imgu);
            const blob = await res.blob();

            const imgRef = storage.ref().child(`adminprofile/${img.name}`);
            await imgRef.put(blob);

            imgURL = await imgRef.getDownloadURL();
          }

          await firestore
            .collection("admin")
            .doc("4U6Ln0cxG3r6EZvKVarw")
            .update({
              imgURL,
            })
            .then(() => {
              setImgSubmit(false);
            });
        } catch (err) {
          console.log(err.message);
        }
      }
    );
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmits = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await firestore
        .collection("admin")
        .doc("4U6Ln0cxG3r6EZvKVarw")
        .update({
          lastname: lastname,
          firstname: firstname,
          info: bio,
          province: selectedProvince.name,
          city: selectedCity.name,
          brgy: selectedBrgy.name,
        })
        .then(() => {
          setFirstname("");
          setLastname("");
          setBio("");
          setSBrgy([]);
          setSelectedProvince("");
          setSCity([]);
          setIsSubmitting(false);
        });
    } catch (err) {
      console.log(err.message);
    }
  };
  const classes = useStyles();

  const [edit, setEdit] = useState(false);
  const [editIG, setEditIG] = useState(false);
  const [editYT, setEditYT] = useState(false);
  const [editTT, setEditTT] = useState(false);
  const [editTik, setEditTik] = useState(false);
  const [editMail, setEditMail] = useState(false);

  const hasFB = admin.some((val) => {
    return val.facebook !== "";
  });
  const hasIG = admin.some((val) => {
    return val.instagram !== "";
  });
  const hasTT = admin.some((val) => {
    return val.twitter !== "";
  });
  const hasTik = admin.some((val) => {
    return val.tiktok !== "";
  });
  const hasYT = admin.some((val) => {
    return val.youtube !== "";
  });
  const hasMail = admin.some((val) => {
    return val.mail !== "";
  });

  const [fblink, setFblink] = useState("");
  const [iglink, setIglink] = useState("");
  const [ytlink, setYtlink] = useState("");
  const [ttlink, setTtlink] = useState("");
  const [tiklink, setTiklink] = useState("");
  const [maillink, setMaillink] = useState("");

  return (
    <div>
      <div className="aProfileSubCont">
        <div className="setSubcontainer">
          <div className="rightCon2">
            <h1>Edit profile</h1>
            <div className="editCon1">
              <h2>Profile photo</h2>
              <div className="avatarCont">
                <div className="avatar">
                  {imgSubmit && <CircularProgress className="imgLoader" />}

                  {admin.map((val) => (
                    <Avatar src={val.imgURL} />
                  ))}
                </div>
                <div className="con1Right">
                  <p>Upload your avatar</p>
                  <div className="upBtnCon">
                    <input
                      accept="image/*"
                      className={classes.input}
                      id="contained-button-file"
                      multiple
                      type="file"
                      onChange={handleUpload}
                    />
                    <label htmlFor="contained-button-file">
                      <Button
                        variant="contained"
                        color="primary"
                        component="span"
                      >
                        Upload
                      </Button>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="formCont">
              <form>
                <div className="publicP">
                  <h2>Seller profile</h2>

                  <div className="txtCon">
                    <TextField
                      required
                      name="Firstname"
                      label="First name"
                      variant="outlined"
                      onChange={(e) => {
                        setFirstname(e.target.value);
                      }}
                      value={firstname}
                    />
                  </div>
                  <div className="txtCon">
                    <TextField
                      required
                      name="Lastname"
                      label="Last name"
                      variant="outlined"
                      onChange={(e) => {
                        setLastname(e.target.value);
                      }}
                      value={lastname}
                    />
                  </div>
                  <div className="txtCon">
                    <TextField
                      required
                      name="info"
                      label="Background/Introduction"
                      multiline
                      rows={4}
                      variant="outlined"
                      onChange={(e) => {
                        setBio(e.target.value);
                      }}
                      value={bio}
                    />
                  </div>
                </div>

                <div className="locationP">
                  <h3>Location</h3>
                  <FormControl
                    variant="outlined"
                    className={classes.formControl}
                  >
                    <InputLabel id="demo-simple-select-outlined-label">
                      Province
                    </InputLabel>
                    <Select
                      required
                      value={selectedProvince}
                      label="Province"
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

                  <FormControl
                    variant="outlined"
                    className={classes.formControl}
                  >
                    <InputLabel id="demo-simple-select-outlined-label">
                      City/Municipality
                    </InputLabel>
                    <Select
                      required
                      value={selectedCity}
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

                  <FormControl
                    variant="outlined"
                    className={classes.formControl}
                  >
                    <InputLabel id="demo-simple-select-outlined-label">
                      Barangay
                    </InputLabel>
                    <Select
                      required
                      value={selectedBrgy}
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
                <div className="btnCon">
                  <Button
                    variant="contained"
                    color="primary"
                    className="saveBtn"
                    type="submit"
                    disabled={isSubmitting ? true : false}
                    onClick={handleSubmits}
                  >
                    {isSubmitting ? <CircularProgress /> : " Save changes"}
                  </Button>
                </div>
              </form>
            </div>
            <div className="setSocialCont">
              <h2>Link Social media</h2>
              <div className="setSocialSubCont">
                <div className="fbCont">
                  <div className="fbSocialLinkCont">
                    <img
                      alt="svgImg"
                      src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4Igp3aWR0aD0iMzAiIGhlaWdodD0iMzAiCnZpZXdCb3g9IjAgMCA0OCA0OCIKc3R5bGU9IiBmaWxsOiMwMDAwMDA7Ij48cGF0aCBmaWxsPSIjMDM5YmU1IiBkPSJNMjQgNUExOSAxOSAwIDEgMCAyNCA0M0ExOSAxOSAwIDEgMCAyNCA1WiI+PC9wYXRoPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0yNi41NzIsMjkuMDM2aDQuOTE3bDAuNzcyLTQuOTk1aC01LjY5di0yLjczYzAtMi4wNzUsMC42NzgtMy45MTUsMi42MTktMy45MTVoMy4xMTl2LTQuMzU5Yy0wLjU0OC0wLjA3NC0xLjcwNy0wLjIzNi0zLjg5Ny0wLjIzNmMtNC41NzMsMC03LjI1NCwyLjQxNS03LjI1NCw3LjkxN3YzLjMyM2gtNC43MDF2NC45OTVoNC43MDF2MTMuNzI5QzIyLjA4OSw0Mi45MDUsMjMuMDMyLDQzLDI0LDQzYzAuODc1LDAsMS43MjktMC4wOCwyLjU3Mi0wLjE5NFYyOS4wMzZ6Ij48L3BhdGg+PC9zdmc+"
                    />
                    <p>Link</p>
                    {edit
                      ? admin.map((val) => (
                          <TextField
                            variant="outlined"
                            value={fblink || val.facebook}
                            onChange={(e) => {
                              setFblink(e.target.value);
                            }}
                          />
                        ))
                      : admin.map((val) => <p>{val.facebook}</p>)}
                  </div>

                  <div className="fbSocialEditBtnCont">
                    <IconButton
                      color="inherit"
                      className="editsaveBtn"
                      onClick={() => {
                        if (!edit) {
                          setEdit(true);
                        } else {
                          if (fblink.trim() === "") {
                            setEdit(false);
                          } else {
                            firestore
                              .collection("admin")
                              .doc("4U6Ln0cxG3r6EZvKVarw")
                              .update({
                                facebook: fblink.trim(),
                              })
                              .then(() => {
                                setEdit(false);
                              });
                          }
                        }
                      }}
                    >
                      {edit ? (
                        fblink !== "" ? (
                          <SaveRoundedIcon />
                        ) : (
                          <ClearRoundedIcon />
                        )
                      ) : hasFB ? (
                        <EditRoundedIcon />
                      ) : (
                        <AddRoundedIcon />
                      )}
                    </IconButton>
                    <Button
                      variant="contained"
                      className="clearFBbtn"
                      style={{
                        backgroundColor: "#00DF89",
                        color: "#fff",
                        height: "30px",
                        width: "40px",
                        marginLeft: "20px",
                      }}
                      onClick={() => {
                        firestore
                          .collection("admin")
                          .doc("4U6Ln0cxG3r6EZvKVarw")
                          .update({
                            facebook: "",
                          })
                          .then(() => {
                            setEdit(false);
                          });
                      }}
                    >
                      Clear
                    </Button>
                  </div>
                </div>

                <div className="igCont">
                  <div className="igSocialLinkCont">
                    <img
                      alt="svgImg"
                      src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4Igp3aWR0aD0iMzAiIGhlaWdodD0iMzAiCnZpZXdCb3g9IjAgMCA0OCA0OCIKc3R5bGU9IiBmaWxsOiMwMDAwMDA7Ij48cGF0aCBmaWxsPSIjMzA0ZmZlIiBkPSJNNDEuNjcsMTMuNDhjLTAuNCwwLjI2LTAuOTcsMC41LTEuMjEsMC43N2MtMC4wOSwwLjA5LTAuMTQsMC4xOS0wLjEyLDAuMjl2MS4wM2wtMC4zLDEuMDFsLTAuMywxbC0wLjMzLDEuMSBsLTAuNjgsMi4yNWwtMC42NiwyLjIybC0wLjUsMS42N2MwLDAuMjYtMC4wMSwwLjUyLTAuMDMsMC43N2MtMC4wNywwLjk2LTAuMjcsMS44OC0wLjU5LDIuNzRjLTAuMTksMC41My0wLjQyLDEuMDQtMC43LDEuNTIgYy0wLjEsMC4xOS0wLjIyLDAuMzgtMC4zNCwwLjU2Yy0wLjQsMC42My0wLjg4LDEuMjEtMS40MSwxLjcyYy0wLjQxLDAuNDEtMC44NiwwLjc5LTEuMzUsMS4xMWMwLDAsMCwwLTAuMDEsMCBjLTAuMDgsMC4wNy0wLjE3LDAuMTMtMC4yNywwLjE4Yy0wLjMxLDAuMjEtMC42NCwwLjM5LTAuOTgsMC41NWMtMC4yMywwLjEyLTAuNDYsMC4yMi0wLjcsMC4zMWMtMC4wNSwwLjAzLTAuMTEsMC4wNS0wLjE2LDAuMDcgYy0wLjU3LDAuMjctMS4yMywwLjQ1LTEuODksMC41NGMtMC4wNCwwLjAxLTAuMDcsMC4wMS0wLjExLDAuMDJjLTAuNCwwLjA3LTAuNzksMC4xMy0xLjE5LDAuMTZjLTAuMTgsMC4wMi0wLjM3LDAuMDMtMC41NSwwLjAzIGwtMC43MS0wLjA0bC0zLjQyLTAuMThjMC0wLjAxLTAuMDEsMC0wLjAxLDBsLTEuNzItMC4wOWMtMC4xMywwLTAuMjcsMC0wLjQtMC4wMWMtMC41NC0wLjAyLTEuMDYtMC4wOC0xLjU4LTAuMTkgYy0wLjAxLDAtMC4wMSwwLTAuMDEsMGMtMC45NS0wLjE4LTEuODYtMC41LTIuNzEtMC45M2MtMC40Ny0wLjI0LTAuOTMtMC41MS0xLjM2LTAuODJjLTAuMTgtMC4xMy0wLjM1LTAuMjctMC41Mi0wLjQyIGMtMC40OC0wLjQtMC45MS0wLjgzLTEuMzEtMS4yN2MtMC4wNi0wLjA2LTAuMTEtMC4xMi0wLjE2LTAuMThjLTAuMDYtMC4wNi0wLjEyLTAuMTMtMC4xNy0wLjE5Yy0wLjM4LTAuNDgtMC43LTAuOTctMC45Ni0xLjQ5IGMtMC4yNC0wLjQ2LTAuNDMtMC45NS0wLjU4LTEuNDljLTAuMDYtMC4xOS0wLjExLTAuMzctMC4xNS0wLjU3Yy0wLjAxLTAuMDEtMC4wMi0wLjAzLTAuMDItMC4wNWMtMC4xLTAuNDEtMC4xOS0wLjg0LTAuMjQtMS4yNyBjLTAuMDYtMC4zMy0wLjA5LTAuNjYtMC4wOS0xYy0wLjAyLTAuMTMtMC4wMi0wLjI3LTAuMDItMC40bDEuOTEtMi45NWwxLjg3LTIuODhsMC44NS0xLjMxbDAuNzctMS4xOGwwLjI2LTAuNDF2LTEuMDMgYzAuMDItMC4yMywwLjAzLTAuNDcsMC4wMi0wLjY5Yy0wLjAxLTAuNy0wLjE1LTEuMzgtMC4zOC0yLjAzYy0wLjIyLTAuNjktMC41My0xLjM0LTAuODUtMS45NGMtMC4zOC0wLjY5LTAuNzgtMS4zMS0xLjExLTEuODcgQzE0LDcuNCwxMy42Niw2LjczLDEzLjc1LDYuMjZDMTQuNDcsNi4wOSwxNS4yMyw2LDE2LDZoMTZjNC4xOCwwLDcuNzgsMi42LDkuMjcsNi4yNkM0MS40MywxMi42NSw0MS41NywxMy4wNiw0MS42NywxMy40OHoiPjwvcGF0aD48cGF0aCBmaWxsPSIjNDkyOGY0IiBkPSJNNDIsMTZ2MC4yN2wtMS4zOCwwLjhsLTAuODgsMC41MWwtMC45NywwLjU2bC0xLjk0LDEuMTNsLTEuOSwxLjFsLTEuOTQsMS4xMmwtMC43NywwLjQ1IGMwLDAuNDgtMC4xMiwwLjkyLTAuMzQsMS4zMmMtMC4zMSwwLjU4LTAuODMsMS4wNi0xLjQ5LDEuNDdjLTAuNjcsMC40MS0xLjQ5LDAuNzQtMi40MSwwLjk4YzAsMCwwLTAuMDEtMC4wMSwwIGMtMy41NiwwLjkyLTguNDIsMC41LTEwLjc4LTEuMjZjLTAuNjYtMC40OS0xLjEyLTEuMDktMS4zMi0xLjc4Yy0wLjA2LTAuMjMtMC4wOS0wLjQ4LTAuMDktMC43M3YtNy4xOSBjMC4wMS0wLjE1LTAuMDktMC4zLTAuMjctMC40NWMtMC41NC0wLjQzLTEuODEtMC44NC0zLjIzLTEuMjVjLTEuMTEtMC4zMS0yLjMtMC42Mi0zLjMtMC45MmMtMC43OS0wLjI0LTEuNDYtMC40OC0xLjg2LTAuNzEgYzAuMTgtMC4zNSwwLjM5LTAuNywwLjYxLTEuMDNjMS40LTIuMDUsMy41NC0zLjU2LDYuMDItNC4xM0MxNC40Nyw2LjA5LDE1LjIzLDYsMTYsNmgxMC44YzUuMzcsMC45NCwxMC4zMiwzLjEzLDE0LjQ3LDYuMjYgYzAuMTYsMC4zOSwwLjMsMC44LDAuNCwxLjIyYzAuMTgsMC42NiwwLjI5LDEuMzQsMC4zMiwyLjA1QzQyLDE1LjY4LDQyLDE1Ljg0LDQyLDE2eiI+PC9wYXRoPjxwYXRoIGZpbGw9IiM2MjAwZWEiIGQ9Ik00MiwxNnY0LjQxbC0wLjIyLDAuNjhsLTAuNzUsMi4zM2wtMC43OCwyLjRsLTAuNDEsMS4yOGwtMC4zOCwxLjE5bC0wLjM3LDEuMTNsLTAuMzYsMS4xMmwtMC4xOSwwLjU5IGwtMC4yNSwwLjc4YzAsMC43Ni0wLjAyLDEuNDMtMC4wNywyYy0wLjAxLDAuMDYtMC4wMiwwLjEyLTAuMDIsMC4xOGMtMC4wNiwwLjUzLTAuMTQsMC45OC0wLjI3LDEuMzYgYy0wLjAxLDAuMDYtMC4wMywwLjEyLTAuMDUsMC4xN2MtMC4yNiwwLjcyLTAuNjUsMS4xOC0xLjIzLDEuNDhjLTAuMTQsMC4wOC0wLjMsMC4xNC0wLjQ3LDAuMmMtMC41MywwLjE4LTEuMiwwLjI3LTIuMDIsMC4zMiBjLTAuNiwwLjA0LTEuMjksMC4wNS0yLjA3LDAuMDVIMzEuNGwtMS4xOS0wLjA1TDMwLDM3LjYxbC0yLjE3LTAuMDlsLTIuMi0wLjA5bC03LjI1LTAuM2wtMS44OC0wLjA4aC0wLjI2IGMtMC43OC0wLjAxLTEuNDUtMC4wNi0yLjAzLTAuMTRjLTAuODQtMC4xMy0xLjQ5LTAuMzUtMS45OC0wLjY4Yy0wLjctMC40NS0xLjExLTEuMTEtMS4zNS0yLjAzYy0wLjA2LTAuMjItMC4xMS0wLjQ1LTAuMTQtMC43IGMtMC4xLTAuNTgtMC4xNS0xLjI1LTAuMTgtMmMwLTAuMTUsMC0wLjMtMC4wMS0wLjQ2Yy0wLjAxLTAuMDEsMC0wLjAxLDAtMC4wMXYtMC41OGMtMC4wMS0wLjI5LTAuMDEtMC41OS0wLjAxLTAuOWwwLjA1LTEuNjEgbDAuMDMtMS4xNWwwLjA0LTEuMzR2LTAuMTlsMC4wNy0yLjQ2bDAuMDctMi40NmwwLjA3LTIuMzFsMC4wNi0yLjI3bDAuMDItMC42YzAtMC4zMS0xLjA1LTAuNDktMi4yMi0wLjY0IGMtMC45My0wLjEyLTEuOTUtMC4yMy0yLjU2LTAuMzdjMC4wNS0wLjIzLDAuMS0wLjQ2LDAuMTYtMC42OGMwLjE4LTAuNzIsMC40NS0xLjQsMC43OS0yLjA1YzAuMTgtMC4zNSwwLjM5LTAuNywwLjYxLTEuMDMgYzIuMTYtMC45NSw0LjQxLTEuNjksNi43Ni0yLjE3YzIuMDYtMC40Myw0LjIxLTAuNjYsNi40My0wLjY2YzcuMzYsMCwxNC4xNiwyLjQ5LDE5LjU0LDYuNjljMC41MiwwLjQsMS4wMywwLjgzLDEuNTMsMS4yOCBDNDIsMTUuNjgsNDIsMTUuODQsNDIsMTZ6Ij48L3BhdGg+PHBhdGggZmlsbD0iIzY3M2FiNyIgZD0iTTQyLDE4LjM3djQuNTRsLTAuNTUsMS4wNmwtMS4wNSwyLjA1bC0wLjU2LDEuMDhsLTAuNTEsMC45OWwtMC4yMiwwLjQzYzAsMC4zMSwwLDAuNjEtMC4wMiwwLjkgYzAsMC40My0wLjAyLDAuODQtMC4wNSwxLjIyYy0wLjA0LDAuNDUtMC4xLDAuODYtMC4xNiwxLjI0Yy0wLjE1LDAuNzktMC4zNiwxLjQ3LTAuNjYsMi4wM2MtMC4wNCwwLjA3LTAuMDgsMC4xNC0wLjEyLDAuMiBjLTAuMTEsMC4xOC0wLjI0LDAuMzUtMC4zOCwwLjUxYy0wLjE4LDAuMjItMC4zOCwwLjQxLTAuNjEsMC41N2MtMC4zNCwwLjI2LTAuNzQsMC40Ny0xLjIsMC42M2MtMC41NywwLjIxLTEuMjMsMC4zNS0yLjAxLDAuNDMgYy0wLjUxLDAuMDUtMS4wNywwLjA4LTEuNjgsMC4wOGwtMC40MiwwLjAybC0yLjA4LDAuMTJoLTAuMDFMMjcuNSwzNi42bC0yLjI1LDAuMTNsLTMuMSwwLjE4bC0zLjc3LDAuMjJsLTAuNTUsMC4wMyBjLTAuNTEsMC0wLjk5LTAuMDMtMS40NS0wLjA5Yy0wLjA1LTAuMDEtMC4wOS0wLjAyLTAuMTQtMC4wMmMtMC42OC0wLjExLTEuMy0wLjI5LTEuODYtMC41NGMtMC42OC0wLjMtMS4yNy0wLjctMS43Ny0xLjE4IGMtMC40NC0wLjQzLTAuODItMC45Mi0xLjEzLTEuNDdjLTAuMDctMC4xMy0wLjE0LTAuMjUtMC4yLTAuMzljLTAuMy0wLjU5LTAuNTQtMS4yNS0wLjcyLTEuOTdjLTAuMDMtMC4xMi0wLjA2LTAuMjUtMC4wOC0wLjM4IGMtMC4wNi0wLjIzLTAuMTEtMC40Ny0wLjE0LTAuNzJjLTAuMTEtMC42NC0wLjE3LTEuMzItMC4yLTIuMDN2LTAuMDFjLTAuMDEtMC4yOS0wLjAyLTAuNTctMC4wMi0wLjg3bC0wLjQ5LTEuMTdsLTAuMDctMC4xOCBMOS41LDI1Ljk5TDguNzUsMjQuMmwtMC4xMi0wLjI5bC0wLjcyLTEuNzNsLTAuOC0xLjkzYzAsMCwwLDAtMC4wMSwwTDYuMjksMTguM0w2LDE3LjU5VjE2YzAtMC42MywwLjA2LTEuMjUsMC4xNy0xLjg1IGMwLjA1LTAuMjMsMC4xLTAuNDYsMC4xNi0wLjY4YzAuODUtMC40OSwxLjc0LTAuOTQsMi42NS0xLjM0YzIuMDgtMC45Myw0LjMxLTEuNjIsNi42Mi0yLjA0YzEuNzItMC4zMSwzLjUxLTAuNDgsNS4zMi0wLjQ4IGM3LjMxLDAsMTMuOTQsMi42NSwxOS4xMiw2Ljk3YzAuMiwwLjE2LDAuMzksMC4zMiwwLjU4LDAuNDlDNDEuMDksMTcuNDgsNDEuNTUsMTcuOTEsNDIsMTguMzd6Ij48L3BhdGg+PHBhdGggZmlsbD0iIzhlMjRhYSIgZD0iTTQyLDIxLjM1djUuMTRsLTAuNTcsMS4xOWwtMS4wOCwyLjI1bC0wLjAxLDAuMDNjMCwwLjQzLTAuMDIsMC44Mi0wLjA1LDEuMTdjLTAuMSwxLjE1LTAuMzgsMS44OC0wLjg0LDIuMzMgYy0wLjMzLDAuMzQtMC43NCwwLjUzLTEuMjUsMC42M2MtMC4wMywwLjAxLTAuMDcsMC4wMS0wLjEsMC4wMmMtMC4xNiwwLjAzLTAuMzMsMC4wNS0wLjUxLDAuMDVjLTAuNjIsMC4wNi0xLjM1LDAuMDItMi4xOS0wLjA0IGMtMC4wOSwwLTAuMTktMC4wMS0wLjI5LTAuMDJjLTAuNjEtMC4wNC0xLjI2LTAuMDgtMS45OC0wLjExYy0wLjM5LTAuMDEtMC44LTAuMDItMS4yMi0wLjAyaC0wLjAybC0xLjAxLDAuMDhoLTAuMDFsLTIuMjcsMC4xNiBsLTIuNTksMC4ybC0wLjM4LDAuMDNsLTMuMDMsMC4yMmwtMS41NywwLjEybC0xLjU1LDAuMTFjLTAuMjcsMC0wLjUzLDAtMC43OS0wLjAxYzAsMC0wLjAxLTAuMDEtMC4wMSwwIGMtMS4xMy0wLjAyLTIuMTQtMC4wOS0zLjA0LTAuMjZjLTAuODMtMC4xNC0xLjU2LTAuMzYtMi4xOC0wLjY5Yy0wLjY0LTAuMzEtMS4xNy0wLjc1LTEuNi0xLjMxYy0wLjQxLTAuNTUtMC43MS0xLjI0LTAuOS0yLjA3IGMwLTAuMDEsMC0wLjAxLDAtMC4wMWMtMC4xNC0wLjY3LTAuMjItMS40NS0wLjIyLTIuMzNsLTAuMTUtMC4yN0w5LjcsMjYuMzVsLTAuMTMtMC4yMkw5LjUsMjUuOTlsLTAuOTMtMS42NWwtMC40Ni0wLjgzIGwtMC41OC0xLjAzbC0xLTEuNzlMNiwxOS43NXYtMy42OGMwLjg4LTAuNTgsMS43OS0xLjA5LDIuNzMtMS41NWMxLjE0LTAuNTgsMi4zMi0xLjA3LDMuNTUtMS40N2MxLjM0LTAuNDQsMi43NC0wLjc5LDQuMTctMS4wMiBjMS40NS0wLjI0LDIuOTQtMC4zNiw0LjQ3LTAuMzZjNi44LDAsMTMuMDQsMi40MywxNy44NSw2LjQ3YzAuMjIsMC4xNywwLjQzLDAuMzYsMC42NCwwLjU0YzAuODQsMC43NSwxLjY0LDEuNTYsMi4zNywyLjQxIEM0MS44NiwyMS4xOCw0MS45NCwyMS4yNiw0MiwyMS4zNXoiPjwvcGF0aD48cGF0aCBmaWxsPSIjYzIxODViIiBkPSJNNDIsMjQuNzF2Ny4yM2MtMC4yNC0wLjE0LTAuNTctMC4zMS0wLjk4LTAuNDljLTAuMjItMC4xMS0wLjQ3LTAuMjItMC43My0wLjMyIGMtMC4zOC0wLjE3LTAuNzktMC4zMy0xLjI1LTAuNDljLTAuMS0wLjA0LTAuMi0wLjA3LTAuMzEtMC4xYy0wLjE4LTAuMDctMC4zNy0wLjEzLTAuNTYtMC4xOWMtMC41OS0wLjE4LTEuMjQtMC4zNS0xLjkyLTAuNSBjLTAuMjYtMC4wNS0wLjUzLTAuMS0wLjgtMC4xNGMtMC44Ny0wLjE1LTEuOC0wLjI0LTIuNzctMC4yNWMtMC4wOC0wLjAxLTAuMTctMC4wMS0wLjI1LTAuMDFsLTIuNTcsMC4wMmwtMy41LDAuMDJoLTAuMDEgbC03LjQ5LDAuMDZjLTIuMzgsMC0zLjg0LDAuNTctNC43MiwwLjhjMCwwLTAuMDEsMC0wLjAxLDAuMDFjLTAuOTMsMC4yNC0xLjIyLDAuMDktMS4zLTEuNTRjLTAuMDItMC40NS0wLjAzLTEuMDMtMC4wMy0xLjc0IGwtMC41Ni0wLjQzbC0wLjk4LTAuNzRsLTAuNi0wLjQ2bC0wLjEyLTAuMDlMOC44OCwyNC4xbC0wLjI1LTAuMTlsLTAuNTItMC40bC0wLjk2LTAuNzJMNiwyMS45MXYtMy40IGMwLjEtMC4wOCwwLjE5LTAuMTUsMC4yOS0wLjIxYzEuNDUtMSwzLTEuODUsNC42NC0yLjU0YzEuNDYtMC42MiwzLTEuMTEsNC41OC0xLjQ2YzAuNDMtMC4wOSwwLjg3LTAuMTgsMS4zMi0wLjI0IGMxLjMzLTAuMjMsMi43LTAuMzQsNC4wOS0wLjM0YzYuMDEsMCwxMS41MywyLjA5LDE1LjkxLDUuNTVjMC42NiwwLjUyLDEuMywxLjA3LDEuOSwxLjY2YzAuODIsMC43OCwxLjU5LDEuNjEsMi4zLDIuNDkgYzAuMTQsMC4xOCwwLjI4LDAuMzYsMC40MiwwLjU1QzQxLjY0LDI0LjIxLDQxLjgyLDI0LjQ2LDQyLDI0LjcxeiI+PC9wYXRoPjxwYXRoIGZpbGw9IiNkODFiNjAiIGQ9Ik00MiwyOC43MlYzMmMwLDAuNjUtMC4wNiwxLjI5LTAuMTgsMS45MWMtMC4xOCwwLjkyLTAuNDksMS44LTAuOTEsMi42MmMtMC4yMiwwLjA1LTAuNDcsMC4wNS0wLjc1LDAuMDEgYy0wLjYzLTAuMTEtMS4zNy0wLjQ0LTIuMTctMC44N2MtMC4wNC0wLjAxLTAuMDgtMC4wMy0wLjExLTAuMDVjLTAuMjUtMC4xMy0wLjUxLTAuMjctMC43Ny0wLjQzYy0wLjUzLTAuMjktMS4wOS0wLjYxLTEuNjUtMC45MSBjLTAuMTItMC4wNi0wLjI0LTAuMTItMC4zNS0wLjE4Yy0wLjY0LTAuMzMtMS4zLTAuNjMtMS45Ni0wLjg2YzAsMCwwLDAtMC4wMSwwYy0wLjE0LTAuMDUtMC4yOS0wLjEtMC40NC0wLjE0IGMtMC41Ny0wLjE2LTEuMTUtMC4yNi0xLjcxLTAuMjZsLTEuMS0wLjMybC00Ljg3LTEuNDFjMCwwLDAsMC0wLjAxLDBsLTIuOTktMC44N2gtMC4wMWwtMS4zLTAuMzhjLTMuNzYsMC02LjA3LDEuNi03LjE5LDAuOTkgYy0wLjQ0LTAuMjMtMC43LTAuODEtMC43OS0xLjk1Yy0wLjAzLTAuMzItMC4wNC0wLjY4LTAuMDQtMS4xbC0xLjE3LTAuNTdsLTAuMDUtMC4wMmgtMC4wMWwtMC44NC0wLjQyTDkuNywyNi4zNWwtMC4wNy0wLjAzIGwtMC4xNy0wLjA5TDcuNSwyNS4yOEw2LDI0LjU1di0zLjQzYzAuMTctMC4xNSwwLjM1LTAuMjksMC41My0wLjQzYzAuMTktMC4xNSwwLjM4LTAuMjksMC41Ny0wLjQ0YzAuMDEsMCwwLjAxLDAsMC4wMSwwIGMxLjE4LTAuODUsMi40My0xLjYsMy43Ni0yLjIyYzEuNTUtMC43NCwzLjItMS4zMSw0LjkxLTEuNjhjMC4yNS0wLjA2LDAuNTEtMC4xMiwwLjc3LTAuMTZjMS40Mi0wLjI3LDIuODgtMC40MSw0LjM3LTAuNDEgYzUuMjcsMCwxMC4xMSwxLjcxLDE0LjAxLDQuNTljMS4xMywwLjg0LDIuMTgsMS43NywzLjE0LDIuNzhjMC43OSwwLjgzLDEuNTIsMS43MywyLjE4LDIuNjdjMC4wNSwwLjA3LDAuMSwwLjE0LDAuMTUsMC4yIGMwLjM3LDAuNTQsMC43MSwxLjA5LDEuMDMsMS42NkM0MS42NCwyOC4wMiw0MS44MiwyOC4zNyw0MiwyOC43MnoiPjwvcGF0aD48cGF0aCBmaWxsPSIjZjUwMDU3IiBkPSJNNDEuODIsMzMuOTFjLTAuMTgsMC45Mi0wLjQ5LDEuOC0wLjkxLDIuNjJjLTAuMTksMC4zNy0wLjQsMC43Mi0wLjYzLDEuMDZjLTAuMTQsMC4yMS0wLjI5LDAuNDEtMC40NCwwLjYgYy0wLjM2LTAuMTQtMC44OS0wLjM0LTEuNTQtMC41NmMwLDAsMCwwLDAtMC4wMWMtMC40OS0wLjE3LTEuMDUtMC4zNS0xLjY1LTAuNTJjLTAuMTctMC4wNS0wLjM0LTAuMS0wLjUyLTAuMTUgYy0wLjcxLTAuMTktMS40NS0wLjM2LTIuMTctMC40NmMtMC42LTAuMS0xLjE5LTAuMTYtMS43NC0wLjE2bC0wLjQ2LTAuMTNoLTAuMDFsLTIuNDItMC43bC0xLjQ5LTAuNDNsLTEuNjYtMC40OGgtMC4wMWwtMC41NC0wLjE1IGwtNi41My0xLjg4bC0xLjg4LTAuNTRsLTEuNC0wLjMzbC0yLjI4LTAuNTRsLTAuMjgtMC4wN2MwLDAsMCwwLTAuMDEsMGwtMi4yOS0wLjUzYzAtMC4wMSwwLTAuMDEsMC0wLjAxbC0wLjQxLTAuMDlsLTAuMjEtMC4wNSBsLTEuNjctMC4zOWwtMC4xOS0wLjA1bC0xLjQyLTEuMTdMNiwyNy45di00LjA4YzAuMzctMC4zNiwwLjc1LTAuNywxLjE1LTEuMDNjMC4xMi0wLjExLDAuMjUtMC4yMSwwLjM4LTAuMzEgYzAuMTItMC4xLDAuMjUtMC4yLDAuMzgtMC4zYzAuOTEtMC42OSwxLjg3LTEuMzEsMi44OS0xLjg0YzEuMy0wLjcsMi42OC0xLjI2LDQuMTMtMS42NmMwLjI4LTAuMDksMC41Ni0wLjE3LDAuODUtMC4yMyBjMS42NC0wLjQxLDMuMzYtMC42Miw1LjE0LTAuNjJjNC40NywwLDguNjMsMS4zNSwxMi4wNywzLjY2YzEuNzEsMS4xNSwzLjI1LDIuNTMsNC41NSw0LjFjMC42NiwwLjc5LDEuMjYsMS42MiwxLjc5LDIuNSBjMC4wNSwwLjA3LDAuMDksMC4xMywwLjEzLDAuMmMwLjMyLDAuNTMsMC42MiwxLjA4LDAuODksMS42NGMwLjI1LDAuNSwwLjQ3LDEsMC42NywxLjUyQzQxLjM0LDMyLjI1LDQxLjYsMzMuMDcsNDEuODIsMzMuOTF6Ij48L3BhdGg+PHBhdGggZmlsbD0iI2ZmMTc0NCIgZD0iTTQwLjI4LDM3LjU5Yy0wLjE0LDAuMjEtMC4yOSwwLjQxLTAuNDQsMC42Yy0wLjQ0LDAuNTUtMC45MiwxLjA1LTEuNDYsMS40OWMtMC40NywwLjM5LTAuOTcsMC43NC0xLjUsMS4wNCBjLTAuMi0wLjA1LTAuNC0wLjExLTAuNjEtMC4xOWMtMC42Ni0wLjIzLTEuMzUtMC42MS0xLjk5LTEuMDFjLTAuOTYtMC42MS0xLjc5LTEuMjctMi4xNi0xLjU3Yy0wLjE0LTAuMTItMC4yMS0wLjE4LTAuMjEtMC4xOCBsLTEuNy0wLjE1TDMwLDM3LjZsLTIuMi0wLjE5bC0yLjI4LTAuMmwtMy4zNy0wLjNsLTUuMzQtMC40N2wtMC4wMi0wLjAxbC0xLjg4LTAuOTFsLTEuOS0wLjkybC0xLjUzLTAuNzRsLTAuMzMtMC4xNmwtMC40MS0wLjIgbC0xLjQyLTAuNjlMNy40MywzMS45bC0wLjU5LTAuMjlMNiwzMS4zNXYtNC40N2MwLjQ3LTAuNTYsMC45Ny0xLjA5LDEuNS0xLjZjMC4zNC0wLjMyLDAuNy0wLjY0LDEuMDctMC45NCBjMC4wNi0wLjA1LDAuMTItMC4xLDAuMTgtMC4xNGMwLjA0LTAuMDUsMC4wOS0wLjA4LDAuMTMtMC4xYzAuNTktMC40OCwxLjIxLTAuOTEsMS44NS0xLjNjMC43NC0wLjQ3LDEuNTItMC44OSwyLjMzLTEuMjQgYzAuODctMC4zOSwxLjc4LTAuNzIsMi43Mi0wLjk3YzEuNjMtMC40NiwzLjM2LTAuNyw1LjE0LTAuN2M0LjA4LDAsNy44NSwxLjI0LDEwLjk2LDMuMzdjMS45OSwxLjM2LDMuNzEsMy4wOCw1LjA3LDUuMDcgYzAuNDUsMC42NCwwLjg1LDEuMzIsMS4yMiwyLjAyYzAuMTMsMC4yNiwwLjI2LDAuNTIsMC4zNywwLjc4YzAuMTIsMC4yNSwwLjIzLDAuNSwwLjM0LDAuNzVjMC4yMSwwLjUyLDAuNCwxLjA0LDAuNTcsMS41OCBjMC4zMiwxLDAuNTYsMi4wMiwwLjcxLDMuMDhDNDAuMjEsMzYuODksNDAuMjUsMzcuMjQsNDAuMjgsMzcuNTl6Ij48L3BhdGg+PHBhdGggZmlsbD0iI2ZmNTcyMiIgZD0iTTM4LjM5LDM5LjQyYzAsMC4wOCwwLDAuMTctMC4wMSwwLjI2Yy0wLjQ3LDAuMzktMC45NywwLjc0LTEuNSwxLjA0Yy0wLjIyLDAuMTItMC40NCwwLjI0LTAuNjcsMC4zNCBjLTAuMjMsMC4xMS0wLjQ2LDAuMjEtMC43LDAuM2MtMC4zNC0wLjE4LTAuOC0wLjQtMS4yOS0wLjYxYy0wLjY5LTAuMzEtMS40NC0wLjU5LTIuMDItMC42OGMtMC4xNC0wLjAzLTAuMjctMC4wNC0wLjM5LTAuMDQgbC0xLjY0LTAuMjFoLTAuMDJsLTIuMDQtMC4yN2wtMi4wNi0wLjI3bC0wLjk2LTAuMTJsLTcuNTYtMC45OGMtMC40OSwwLTEuMDEtMC4wMy0xLjU1LTAuMWMtMC42Ni0wLjA2LTEuMzUtMC4xNi0yLjA0LTAuMyBjLTAuNjgtMC4xMi0xLjM3LTAuMjgtMi4wMy0wLjQ1Yy0wLjY5LTAuMTYtMS4zNy0wLjM1LTItMC41M2MtMC43My0wLjIyLTEuNDEtMC40My0xLjk4LTAuNjJjLTAuNDctMC4xNS0wLjg3LTAuMjktMS4xOC0wLjQgYy0wLjE4LTAuNDMtMC4zMy0wLjg4LTAuNDQtMS4zNEM2LjEsMzMuNjYsNiwzMi44NCw2LDMydi0xLjY3YzAuMzItMC41MywwLjY3LTEuMDUsMS4wNi0xLjU0YzAuNzEtMC45NCwxLjUyLTEuOCwyLjQtMi41NiBjMC4wMy0wLjA0LDAuMDctMC4wNywwLjEtMC4wOWwwLjAxLTAuMDFjMC4zMS0wLjI4LDAuNjMtMC41MywwLjk3LTAuNzdjMC4wNC0wLjA0LDAuMDgtMC4wNywwLjEyLTAuMSBjMC4xNi0wLjEyLDAuMzMtMC4yNCwwLjUxLTAuMzVjMS40My0wLjk3LDMuMDEtMS43Myw0LjctMi4yNGMxLjYtMC40OCwzLjI5LTAuNzMsNS4wNS0wLjczYzMuNDksMCw2Ljc1LDEuMDMsOS40NywyLjc5IGMyLjAxLDEuMjksMy43NCwyLjk5LDUuMDYsNC45OGMwLjE2LDAuMjMsMC4zMSwwLjQ2LDAuNDYsMC43YzAuNjksMS4xNywxLjI2LDIuNDMsMS42OCwzLjc1YzAuMDUsMC4xNSwwLjA5LDAuMywwLjEzLDAuNDYgYzAuMDgsMC4yNywwLjE1LDAuNTUsMC4yMSwwLjgzYzAuMDIsMC4wNywwLjA0LDAuMTQsMC4wNiwwLjIyYzAuMTQsMC42MywwLjI0LDEuMjksMC4zMSwxLjk1YzAsMC4wMSwwLDAuMDEsMCwwLjAxIEMzOC4zNiwzOC4yMiwzOC4zOSwzOC44MiwzOC4zOSwzOS40MnoiPjwvcGF0aD48cGF0aCBmaWxsPSIjZmY2ZjAwIiBkPSJNMzYuMzMsMzkuNDJjMCwwLjM1LTAuMDIsMC43My0wLjA2LDEuMTFjLTAuMDIsMC4xOC0wLjA0LDAuMzYtMC4wNiwwLjUzYy0wLjIzLDAuMTEtMC40NiwwLjIxLTAuNywwLjMgYy0wLjQ1LDAuMTctMC45MSwwLjMxLTEuMzgsMC40MWMtMC4zMiwwLjA3LTAuNjUsMC4xMy0wLjk4LDAuMTZoLTAuMDFjLTAuMzEtMC4xOS0wLjY3LTAuNDItMS4wNC0wLjY4IGMtMC42Ny0wLjQ3LTEuMzctMS0xLjkzLTEuNDNjLTAuMDEtMC4wMS0wLjAxLTAuMDEtMC4wMi0wLjAyYy0wLjU5LTAuNDUtMS4wMS0wLjc5LTEuMDEtMC43OWwtMS4wNiwwLjA0bC0yLjA0LDAuMDdsLTAuOTUsMC4wNCBsLTMuODIsMC4xNGwtMy4yMywwLjEyYy0wLjIxLDAuMDEtMC40NiwwLjAxLTAuNzcsMGgtMC4wMWMtMC40Mi0wLjAxLTAuOTItMC4wNC0xLjQ3LTAuMDljLTAuNjQtMC4wNS0xLjM0LTAuMTEtMi4wNS0wLjE4IGMtMC42OS0wLjA4LTEuMzktMC4xNi0yLjA2LTAuMjRjLTAuNzQtMC4wOC0xLjQ0LTAuMTctMi4wNC0wLjI1Yy0wLjQ3LTAuMDYtMC44OC0wLjExLTEuMjEtMC4xNWMtMC4yOC0wLjMyLTAuNTMtMC42NS0wLjc3LTEuMDEgYy0wLjM2LTAuNTQtMC42Ny0xLjExLTAuOTEtMS43MmMtMC4xOC0wLjQzLTAuMzMtMC44OC0wLjQ0LTEuMzRjMC4yOS0wLjg5LDAuNjctMS43MywxLjEyLTIuNTRjMC4zNi0wLjY2LDAuNzgtMS4yOSwxLjI0LTEuODkgYzAuNDUtMC41OSwwLjk0LTEuMTQsMS40Ny0xLjY0di0wLjAxYzAuMTUtMC4xNSwwLjMtMC4yOSwwLjQ1LTAuNDJjMC4yOC0wLjI2LDAuNTctMC41LDAuODctMC43M2gwLjAxIGMwLjAxLTAuMDIsMC4wMi0wLjAyLDAuMDMtMC4wM2MwLjI0LTAuMTksMC40OS0wLjM2LDAuNzQtMC41M2MxLjQ4LTEuMDEsMy4xNS0xLjc2LDQuOTUtMi4yYzEuMTktMC4yOSwyLjQ0LTAuNDUsMy43My0wLjQ1IGMyLjU0LDAsNC45NCwwLjYxLDcuMDUsMS43MWgwLjAxYzEuODEsMC45MywzLjQxLDIuMjEsNC43LDMuNzVjMC43MSwwLjgyLDEuMzIsMS43MiwxLjgyLDIuNjdjMC4zNSwwLjY0LDAuNjUsMS4zMSwwLjksMS45OSBjMC4wMiwwLjA2LDAuMDQsMC4xMSwwLjA2LDAuMTZjMC4xNywwLjUsMC4zMiwxLjAyLDAuNDUsMS41NGMwLjA5LDAuMzcsMC4xNiwwLjc1LDAuMjIsMS4xM2MwLjAyLDAuMTIsMC4wNCwwLjIzLDAuMDUsMC4zNSBDMzYuMjgsMzcuOTksMzYuMzMsMzguNywzNi4zMywzOS40MnoiPjwvcGF0aD48cGF0aCBmaWxsPSIjZmY5ODAwIiBkPSJNMzQuMjgsMzkuNDJ2MC4xYzAsMC4zNC0wLjAzLDAuNzctMC4wNiwxLjIzYy0wLjAzLDAuMzQtMC4wNiwwLjY5LTAuMDksMS4wMmMtMC4zMiwwLjA3LTAuNjUsMC4xMy0wLjk4LDAuMTYgaC0wLjAxQzMyLjc2LDQxLjk4LDMyLjM5LDQyLDMyLDQyaC0xLjc1bC0wLjM4LTAuMTFsLTEuOTctMC42bC0yLTAuNmwtNC42My0xLjM5bC0yLTAuNmMwLDAtMC44MywwLjMzLTIsMC43MmgtMC4wMSBjLTAuNDUsMC4xNS0wLjk0LDAuMzEtMS40NiwwLjQ3Yy0wLjY1LDAuMTktMS4zNCwwLjM4LTIuMDIsMC41M2MtMC43LDAuMTYtMS4zOSwwLjI4LTIuMDEsMC4zM2MtMC4xOSwwLjAyLTAuMzgsMC4wMy0wLjU1LDAuMDMgYy0wLjU2LTAuMzEtMS4xLTAuNjgtMS41OS0xLjA5Yy0wLjQzLTAuMzYtMC44My0wLjc1LTEuMi0xLjE4Yy0wLjI4LTAuMzItMC41My0wLjY1LTAuNzctMS4wMWMwLjA3LTAuNDUsMC4xNS0wLjg5LDAuMjctMS4zMiBjMC4zLTEuMTksMC43Ny0yLjMzLDEuMzktMy4zN2MwLjM0LTAuNTksMC43Mi0xLjE2LDEuMTYtMS42OWMwLjAxLTAuMDMsMC4wNC0wLjA2LDAuMDctMC4wOGMtMC4wMS0wLjAxLDAtMC4wMSwwLTAuMDEgYzAuMTMtMC4xNywwLjI3LTAuMzMsMC40MS0wLjQ4YzAtMC4wMSwwLTAuMDEsMC0wLjAxYzAuNDEtMC40NCwwLjgzLTAuODYsMS4yOS0xLjI1YzAuMTYtMC4xMywwLjMxLTAuMjYsMC40OC0wLjM5IGMwLjAzLTAuMDMsMC4wNi0wLjA1LDAuMS0wLjA4YzIuMjUtMS43Miw1LjA2LTIuNzYsOC4wOS0yLjc2YzMuNDQsMCw2LjU3LDEuMjksOC45NCwzLjQxYzEuMTQsMS4wMywyLjExLDIuMjYsMi44NCwzLjYzIGMwLjA2LDAuMSwwLjEyLDAuMjEsMC4xNywwLjMyYzAuMDksMC4xOCwwLjE4LDAuMzcsMC4yNiwwLjU3YzAuMzMsMC43MiwwLjU5LDEuNDgsMC43NywyLjI2YzAuMDIsMC4wOCwwLjA0LDAuMTYsMC4wNiwwLjI0IGMwLjA4LDAuMzcsMC4xNSwwLjc1LDAuMiwxLjEzQzM0LjI0LDM4LjIxLDM0LjI4LDM4LjgxLDM0LjI4LDM5LjQyeiI+PC9wYXRoPjxwYXRoIGZpbGw9IiNmZmMxMDciIGQ9Ik0zMi4yMiwzOS40MmMwLDAuMi0wLjAxLDAuNDItMC4wMiwwLjY1Yy0wLjAyLDAuMzctMC4wNSwwLjc3LTAuMSwxLjE4Yy0wLjAyLDAuMjUtMC4wNiwwLjUtMC4xLDAuNzVoLTUuNDggbC0xLjA2LTAuMTdsLTQuMTQtMC42NmwtMC41OS0wLjA5bC0xLjM1LTAuMjJjLTAuNTksMC0xLjg3LDAuMjYtMy4yMiwwLjUxYy0wLjcxLDAuMTMtMS40MywwLjI3LTIuMDgsMC4zNiBjLTAuMDgsMC4wMS0wLjE2LDAuMDItMC4yMywwLjAzaC0wLjAxYy0wLjctMC4xNS0xLjM4LTAuMzgtMi4wMi0wLjY4Yy0wLjItMC4wOS0wLjQtMC4xOS0wLjYtMC4zYy0wLjU2LTAuMzEtMS4xLTAuNjgtMS41OS0xLjA5IGMtMC4wMS0wLjEyLTAuMDItMC4yMi0wLjAyLTAuMjdjMC0wLjI2LDAuMDEtMC41MSwwLjAzLTAuNzZjMC4wNC0wLjY0LDAuMTMtMS4yNiwwLjI3LTEuODZjMC4yMi0wLjkxLDAuNTQtMS43OSwwLjk3LTIuNiBjMC4wOC0wLjE3LDAuMTctMC4zNCwwLjI3LTAuNWMwLjA0LTAuMDgsMC4wOS0wLjE1LDAuMTMtMC4yM2MwLjE4LTAuMjksMC4zOC0wLjU3LDAuNTgtMC44NWMwLjQyLTAuNTUsMC44OS0xLjA3LDEuMzktMS41NCBjMC4wMSwwLDAuMDEsMCwwLjAxLDBjMC4wNC0wLjA0LDAuMDgtMC4wOCwwLjEyLTAuMTFjMC4wNS0wLjA0LDAuMDktMC4wOSwwLjE0LTAuMTJjMC4yLTAuMTgsMC40LTAuMzQsMC42MS0wLjQ5IGMwLTAuMDEsMC4wMS0wLjAxLDAuMDEtMC4wMWMxLjg5LTEuNDEsNC4yMy0yLjI0LDYuNzgtMi4yNGMxLjk4LDAsMy44MiwwLjUsNS40MywxLjM4aDAuMDFjMS4zOCwwLjc2LDIuNTgsMS43OSwzLjUzLDMuMDMgYzAuMzcsMC40OCwwLjcsMC45OSwwLjk4LDEuNTNoMC4wMWMwLjA1LDAuMSwwLjEsMC4yLDAuMTUsMC4zYzAuMywwLjU5LDAuNTQsMS4yMSwwLjcyLDEuODVoMC4wMWMwLjAxLDAuMDUsMC4wMywwLjEsMC4wNCwwLjE1IGMwLjEyLDAuNDMsMC4yMiwwLjg3LDAuMjksMS4zMmMwLjAxLDAuMDksMC4wMiwwLjE5LDAuMDMsMC4yOEMzMi4xOSwzOC40MywzMi4yMiwzOC45MiwzMi4yMiwzOS40MnoiPjwvcGF0aD48cGF0aCBmaWxsPSIjZmZkNTRmIiBkPSJNMzAuMTcsMzkuMzFjMCwwLjE2LDAsMC4zMy0wLjAyLDAuNDl2MC4wMWMwLDAuMDEsMCwwLjAxLDAsMC4wMWMtMC4wMiwwLjcyLTAuMTIsMS40My0wLjI4LDIuMDcgYzAsMC4wNC0wLjAxLDAuMDctMC4wMywwLjExaC00LjY3bC0zLjg1LTAuODNsLTAuNTEtMC4xMWwtMC4wOCwwLjAybC00LjI3LDAuODhMMTYuMjcsNDJIMTZjLTAuNjQsMC0xLjI3LTAuMDYtMS44OC0wLjE4IGMtMC4wOS0wLjAyLTAuMTgtMC4wNC0wLjI3LTAuMDZoLTAuMDFjLTAuNy0wLjE1LTEuMzgtMC4zOC0yLjAyLTAuNjhjLTAuMDItMC4xMS0wLjA0LTAuMjItMC4wNS0wLjMzIGMtMC4wNy0wLjQzLTAuMS0wLjg4LTAuMS0xLjMzYzAtMC4xNywwLTAuMzQsMC4wMS0wLjUxYzAuMDMtMC41NCwwLjExLTEuMDcsMC4yMy0xLjU4YzAuMDgtMC4zOCwwLjE5LTAuNzUsMC4zMi0xLjEgYzAuMTEtMC4zMSwwLjI0LTAuNjEsMC4zOC0wLjljMC4xMi0wLjI1LDAuMjYtMC40OSwwLjQtMC43M2MwLjE0LTAuMjMsMC4yOS0wLjQ1LDAuNDUtMC42N2MwLjQtMC41NSwwLjg3LTEuMDYsMS4zOS0xLjUxIGMwLjMtMC4yNiwwLjYzLTAuNTEsMC45Ny0wLjczYzEuNDYtMC45NiwzLjIxLTEuNTIsNS4xLTEuNTJjMC4zNywwLDAuNzMsMC4wMiwxLjA4LDAuMDdoMC4wMmMxLjA3LDAuMTIsMi4wNywwLjQyLDIuOTksMC44NyBjMC4wMSwwLDAuMDEsMCwwLjAxLDBjMS40NSwwLjcxLDIuNjgsMS43OCwzLjU4LDMuMWMwLjE1LDAuMjIsMC4zLDAuNDYsMC40MywwLjdjMC4xMSwwLjE5LDAuMjEsMC4zOSwwLjMsMC41OSBjMC4xNCwwLjMxLDAuMjcsMC42NCwwLjM4LDAuOTdoMC4wMWMwLjExLDAuMzcsMC4yMSwwLjc0LDAuMjgsMS4xM3YwLjAxQzMwLjExLDM4LjE2LDMwLjE3LDM4LjczLDMwLjE3LDM5LjMxeiI+PC9wYXRoPjxwYXRoIGZpbGw9IiNmZmUwODIiIGQ9Ik0yOC4xMSwzOS41MnYwLjAzYzAsMC41OS0wLjA3LDEuMTctMC4yMSwxLjc0Yy0wLjA1LDAuMjQtMC4xMiwwLjQ4LTAuMjEsMC43MWgtNC40OGwtMi4yOS0wLjYzTDE4LjYzLDQySDE2IGMtMC42NCwwLTEuMjctMC4wNi0xLjg4LTAuMThjLTAuMDItMC4wMy0wLjAzLTAuMDYtMC4wNC0wLjA5Yy0wLjE0LTAuNDMtMC4yNS0wLjg2LTAuMy0xLjMxYy0wLjA0LTAuMjktMC4wNi0wLjU5LTAuMDYtMC45IGMwLTAuMTIsMC0wLjI1LDAuMDItMC4zN2MwLjAxLTAuNDcsMC4wOC0wLjkzLDAuMi0xLjM3YzAuMDYtMC4zLDAuMTUtMC41OSwwLjI3LTAuODdjMC4wNC0wLjE0LDAuMS0wLjI3LDAuMTctMC40IGMwLjE1LTAuMzQsMC4zMy0wLjY3LDAuNTMtMC45OWMwLjIyLTAuMzIsMC40Ni0wLjYyLDAuNzMtMC45YzAuMzItMC4zNiwwLjY4LTAuNjksMS4wOS0wLjk2YzAuNy0wLjUxLDEuNS0wLjg5LDIuMzctMS4xIGMwLjU4LTAuMTYsMS4xOS0wLjI0LDEuODItMC4yNGMyLDAsMy43OSwwLjgsNS4wOSwyLjA5YzAuMDUsMC4wNSwwLjExLDAuMTEsMC4xNiwwLjE4aDAuMDFjMC4xNCwwLjE1LDAuMjcsMC4zLDAuNCwwLjQ3IGMwLjM3LDAuNDcsMC42OCwwLjk4LDAuOTIsMS41NGMwLjEyLDAuMjYsMC4yMiwwLjUzLDAuMywwLjgxYzAuMDEsMC4wNCwwLjAyLDAuMDcsMC4wMywwLjExYzAuMTQsMC40OSwwLjIzLDEsMC4yNSwxLjUzIEMyOC4xLDM5LjIsMjguMTEsMzkuMzYsMjguMTEsMzkuNTJ6Ij48L3BhdGg+PHBhdGggZmlsbD0iI2ZmZWNiMyIgZD0iTTI2LjA2LDM5LjUyYzAsMC40MS0wLjA1LDAuOC0wLjE2LDEuMTdjLTAuMSwwLjQtMC4yNSwwLjc4LTAuNDQsMS4xNGMtMC4wMywwLjA2LTAuMSwwLjE3LTAuMSwwLjE3aC04Ljg4IGMtMC4wMS0wLjAxLTAuMDItMC4wMy0wLjAyLTAuMDRjLTAuMTItMC4xOS0wLjIyLTAuMzgtMC4zLTAuNTljLTAuMi0wLjQ2LTAuMzItMC45Ni0wLjM2LTEuNDhjLTAuMDItMC4xMi0wLjAyLTAuMjUtMC4wMi0wLjM3IGMwLTAuMDYsMC0wLjEzLDAuMDEtMC4xOWMwLjAxLTAuNDQsMC4wNy0wLjg2LDAuMTktMS4yNWMwLjEtMC4zNiwwLjIzLTAuNjksMC40LTEuMDFjMCwwLDAuMDEtMC4wMSwwLjAxLTAuMDIgYzAuMTItMC4yMSwwLjI1LTAuNDIsMC40LTAuNjJjMC40OS0wLjY2LDEuMTQtMS4yLDEuODktMS41NWMwLjAxLDAsMC4wMSwwLDAuMDEsMGMwLjI0LTAuMTIsMC40OS0wLjIyLDAuNzUtMC4yOWMwLDAsMCwwLDAuMDEsMCBjMC40Ni0wLjE0LDAuOTYtMC4yMSwxLjQ3LTAuMjFjMC41OSwwLDEuMTYsMC4wOSwxLjY4LDAuMjhjMC4xOSwwLjA1LDAuMzcsMC4xMywwLjU1LDAuMjJjMCwwLDAsMCwwLjAxLDAgYzAuODYsMC40MSwxLjU5LDEuMDUsMi4wOSwxLjg1YzAuMSwwLjE1LDAuMTksMC4zMSwwLjI3LDAuNDhjMC4wNCwwLjA3LDAuMDgsMC4xNSwwLjExLDAuMjJjMC4yMywwLjUyLDAuMzcsMS4wOSwwLjQxLDEuNjkgYzAuMDEsMC4wNSwwLjAxLDAuMSwwLjAxLDAuMTZDMjYuMDYsMzkuMzYsMjYuMDYsMzkuNDQsMjYuMDYsMzkuNTJ6Ij48L3BhdGg+PGc+PHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3Ryb2tlLXdpZHRoPSIyIiBkPSJNMzAsMTFIMThjLTMuOSwwLTcsMy4xLTcsN3YxMmMwLDMuOSwzLjEsNyw3LDdoMTJjMy45LDAsNy0zLjEsNy03VjE4QzM3LDE0LjEsMzMuOSwxMSwzMCwxMXoiPjwvcGF0aD48Y2lyY2xlIGN4PSIzMSIgY3k9IjE2IiByPSIxIiBmaWxsPSIjZmZmIj48L2NpcmNsZT48L2c+PGc+PGNpcmNsZSBjeD0iMjQiIGN5PSIyNCIgcj0iNiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3Ryb2tlLXdpZHRoPSIyIj48L2NpcmNsZT48L2c+PC9zdmc+"
                    />
                    <p>Link</p>
                    {editIG
                      ? admin.map((val) => (
                          <TextField
                            variant="outlined"
                            value={iglink || val.instagram}
                            onChange={(e) => {
                              setIglink(e.target.value);
                            }}
                          />
                        ))
                      : admin.map((val) => <p>{val.instagram}</p>)}
                  </div>

                  <div className="igSocialEditBtnCont">
                    <IconButton
                      color="inherit"
                      className="igEditsaveBtn"
                      onClick={() => {
                        if (!editIG) {
                          setEditIG(true);
                        } else {
                          if (iglink.trim() === "") {
                            setEditIG(false);
                          } else {
                            firestore
                              .collection("admin")
                              .doc("4U6Ln0cxG3r6EZvKVarw")
                              .update({
                                instagram: iglink.trim(),
                              })
                              .then(() => {
                                setEditIG(false);
                              });
                          }
                        }
                      }}
                    >
                      {editIG ? (
                        iglink !== "" ? (
                          <SaveRoundedIcon />
                        ) : (
                          <ClearRoundedIcon />
                        )
                      ) : hasIG ? (
                        <EditRoundedIcon />
                      ) : (
                        <AddRoundedIcon />
                      )}
                    </IconButton>
                    <Button
                      variant="contained"
                      className="clearIGbtn"
                      style={{
                        backgroundColor: "#00DF89",
                        color: "#fff",
                        height: "30px",
                        width: "40px",
                        marginLeft: "20px",
                      }}
                      onClick={() => {
                        firestore
                          .collection("admin")
                          .doc("4U6Ln0cxG3r6EZvKVarw")
                          .update({
                            instagram: "",
                          })
                          .then(() => {
                            setEditIG(false);
                          });
                      }}
                    >
                      Clear
                    </Button>
                  </div>
                </div>
                <div className="ttCont">
                  <div className="ttSocialLinkCont">
                    <img
                      alt="svgImg"
                      src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4Igp3aWR0aD0iMzAiIGhlaWdodD0iMzAiCnZpZXdCb3g9IjAgMCA0OCA0OCIKc3R5bGU9IiBmaWxsOiMwMDAwMDA7Ij48cGF0aCBmaWxsPSIjMDNBOUY0IiBkPSJNNDIsMTIuNDI5Yy0xLjMyMywwLjU4Ni0yLjc0NiwwLjk3Ny00LjI0NywxLjE2MmMxLjUyNi0wLjkwNiwyLjctMi4zNTEsMy4yNTEtNC4wNThjLTEuNDI4LDAuODM3LTMuMDEsMS40NTItNC42OTMsMS43NzZDMzQuOTY3LDkuODg0LDMzLjA1LDksMzAuOTI2LDljLTQuMDgsMC03LjM4NywzLjI3OC03LjM4Nyw3LjMyYzAsMC41NzIsMC4wNjcsMS4xMjksMC4xOTMsMS42N2MtNi4xMzgtMC4zMDgtMTEuNTgyLTMuMjI2LTE1LjIyNC03LjY1NGMtMC42NCwxLjA4Mi0xLDIuMzQ5LTEsMy42ODZjMCwyLjU0MSwxLjMwMSw0Ljc3OCwzLjI4NSw2LjA5NmMtMS4yMTEtMC4wMzctMi4zNTEtMC4zNzQtMy4zNDktMC45MTRjMCwwLjAyMiwwLDAuMDU1LDAsMC4wODZjMCwzLjU1MSwyLjU0Nyw2LjUwOCw1LjkyMyw3LjE4MWMtMC42MTcsMC4xNjktMS4yNjksMC4yNjMtMS45NDEsMC4yNjNjLTAuNDc3LDAtMC45NDItMC4wNTQtMS4zOTItMC4xMzVjMC45NCwyLjkwMiwzLjY2Nyw1LjAyMyw2Ljg5OCw1LjA4NmMtMi41MjgsMS45Ni01LjcxMiwzLjEzNC05LjE3NCwzLjEzNGMtMC41OTgsMC0xLjE4My0wLjAzNC0xLjc2MS0wLjEwNEM5LjI2OCwzNi43ODYsMTMuMTUyLDM4LDE3LjMyMSwzOGMxMy41ODUsMCwyMS4wMTctMTEuMTU2LDIxLjAxNy0yMC44MzRjMC0wLjMxNy0wLjAxLTAuNjMzLTAuMDI1LTAuOTQ1QzM5Ljc2MywxNS4xOTcsNDEuMDEzLDEzLjkwNSw0MiwxMi40MjkiPjwvcGF0aD48L3N2Zz4="
                    />
                    <p>Link</p>
                    {editTT
                      ? admin.map((val) => (
                          <TextField
                            variant="outlined"
                            value={ttlink || val.twitter}
                            onChange={(e) => {
                              setTtlink(e.target.value);
                            }}
                          />
                        ))
                      : admin.map((val) => <p>{val.twitter}</p>)}
                  </div>

                  <div className="ttSocialEditBtnCont">
                    <IconButton
                      color="inherit"
                      className="ttEditsaveBtn"
                      onClick={() => {
                        if (!editTT) {
                          setEditTT(true);
                        } else {
                          if (ttlink.trim() === "") {
                            setEditTT(false);
                          } else {
                            firestore
                              .collection("admin")
                              .doc("4U6Ln0cxG3r6EZvKVarw")
                              .update({
                                twitter: ttlink.trim(),
                              })
                              .then(() => {
                                setEditTT(false);
                              });
                          }
                        }
                      }}
                    >
                      {editTT ? (
                        ttlink !== "" ? (
                          <SaveRoundedIcon />
                        ) : (
                          <ClearRoundedIcon />
                        )
                      ) : hasTT ? (
                        <EditRoundedIcon />
                      ) : (
                        <AddRoundedIcon />
                      )}
                    </IconButton>
                    <Button
                      variant="contained"
                      className="clearTTbtn"
                      style={{
                        backgroundColor: "#00DF89",
                        color: "#fff",
                        height: "30px",
                        width: "40px",
                        marginLeft: "20px",
                      }}
                      onClick={() => {
                        firestore
                          .collection("admin")
                          .doc("4U6Ln0cxG3r6EZvKVarw")
                          .update({
                            twitter: "",
                          })
                          .then(() => {
                            setEditTT(false);
                          });
                      }}
                    >
                      Clear
                    </Button>
                  </div>
                </div>
                <div className="ytCont">
                  <div className="ytSocialLinkCont">
                    <img
                      alt="svgImg"
                      src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4Igp3aWR0aD0iMzAiIGhlaWdodD0iMzAiCnZpZXdCb3g9IjAgMCA0OCA0OCIKc3R5bGU9IiBmaWxsOiMwMDAwMDA7Ij48cGF0aCBmaWxsPSIjRkYzRDAwIiBkPSJNNDMuMiwzMy45Yy0wLjQsMi4xLTIuMSwzLjctNC4yLDRjLTMuMywwLjUtOC44LDEuMS0xNSwxLjFjLTYuMSwwLTExLjYtMC42LTE1LTEuMWMtMi4xLTAuMy0zLjgtMS45LTQuMi00QzQuNCwzMS42LDQsMjguMiw0LDI0YzAtNC4yLDAuNC03LjYsMC44LTkuOWMwLjQtMi4xLDIuMS0zLjcsNC4yLTRDMTIuMyw5LjYsMTcuOCw5LDI0LDljNi4yLDAsMTEuNiwwLjYsMTUsMS4xYzIuMSwwLjMsMy44LDEuOSw0LjIsNGMwLjQsMi4zLDAuOSw1LjcsMC45LDkuOUM0NCwyOC4yLDQzLjYsMzEuNiw0My4yLDMzLjl6Ij48L3BhdGg+PHBhdGggZmlsbD0iI0ZGRiIgZD0iTTIwIDMxTDIwIDE3IDMyIDI0eiI+PC9wYXRoPjwvc3ZnPg=="
                    />
                    <p>Link</p>
                    {editYT
                      ? admin.map((val) => (
                          <TextField
                            variant="outlined"
                            value={ytlink || val.youtube}
                            onChange={(e) => {
                              setYtlink(e.target.value);
                            }}
                          />
                        ))
                      : admin.map((val) => <p>{val.youtube}</p>)}
                  </div>

                  <div className="ytSocialEditBtnCont">
                    <IconButton
                      color="inherit"
                      className="ytEditsaveBtn"
                      onClick={() => {
                        if (!editYT) {
                          setEditYT(true);
                        } else {
                          if (ytlink.trim() === "") {
                            setEditYT(false);
                          } else {
                            firestore
                              .collection("admin")
                              .doc("4U6Ln0cxG3r6EZvKVarw")
                              .update({
                                youtube: ytlink.trim(),
                              })
                              .then(() => {
                                setEditYT(false);
                              });
                          }
                        }
                      }}
                    >
                      {editYT ? (
                        ytlink !== "" ? (
                          <SaveRoundedIcon />
                        ) : (
                          <ClearRoundedIcon />
                        )
                      ) : hasYT ? (
                        <EditRoundedIcon />
                      ) : (
                        <AddRoundedIcon />
                      )}
                    </IconButton>
                    <Button
                      variant="contained"
                      className="clearYTbtn"
                      style={{
                        backgroundColor: "#00DF89",
                        color: "#fff",
                        height: "30px",
                        width: "40px",
                        marginLeft: "20px",
                      }}
                      onClick={() => {
                        firestore
                          .collection("admin")
                          .doc("4U6Ln0cxG3r6EZvKVarw")
                          .update({
                            youtube: "",
                          })
                          .then(() => {
                            setEditYT(false);
                          });
                      }}
                    >
                      Clear
                    </Button>
                  </div>
                </div>
                <div className="tikCont">
                  <div className="tikSocialLinkCont">
                    <img
                      alt="svgImg"
                      src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4Igp3aWR0aD0iMzAiIGhlaWdodD0iMzAiCnZpZXdCb3g9IjAgMCA0OCA0OCIKc3R5bGU9IiBmaWxsOiMwMDAwMDA7Ij48cGF0aCBmaWxsPSIjMjEyMTIxIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMC45MDQsNmgyNi4xOTFDMzkuODA0LDYsNDIsOC4xOTYsNDIsMTAuOTA0djI2LjE5MSBDNDIsMzkuODA0LDM5LjgwNCw0MiwzNy4wOTYsNDJIMTAuOTA0QzguMTk2LDQyLDYsMzkuODA0LDYsMzcuMDk2VjEwLjkwNEM2LDguMTk2LDguMTk2LDYsMTAuOTA0LDZ6IiBjbGlwLXJ1bGU9ImV2ZW5vZGQiPjwvcGF0aD48cGF0aCBmaWxsPSIjZWM0MDdhIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0yOS4yMDgsMjAuNjA3YzEuNTc2LDEuMTI2LDMuNTA3LDEuNzg4LDUuNTkyLDEuNzg4di00LjAxMSBjLTAuMzk1LDAtMC43ODgtMC4wNDEtMS4xNzQtMC4xMjN2My4xNTdjLTIuMDg1LDAtNC4wMTUtMC42NjMtNS41OTItMS43ODh2OC4xODRjMCw0LjA5NC0zLjMyMSw3LjQxMy03LjQxNyw3LjQxMyBjLTEuNTI4LDAtMi45NDktMC40NjItNC4xMjktMS4yNTRjMS4zNDcsMS4zNzYsMy4yMjUsMi4yMyw1LjMwMywyLjIzYzQuMDk2LDAsNy40MTctMy4zMTksNy40MTctNy40MTNMMjkuMjA4LDIwLjYwN0wyOS4yMDgsMjAuNjA3IHogTTMwLjY1NywxNi41NjFjLTAuODA1LTAuODc5LTEuMzM0LTIuMDE2LTEuNDQ5LTMuMjczdi0wLjUxNmgtMS4xMTNDMjguMzc1LDE0LjM2OSwyOS4zMzEsMTUuNzM0LDMwLjY1NywxNi41NjFMMzAuNjU3LDE2LjU2MXogTTE5LjA3OSwzMC44MzJjLTAuNDUtMC41OS0wLjY5My0xLjMxMS0wLjY5Mi0yLjA1M2MwLTEuODczLDEuNTE5LTMuMzkxLDMuMzkzLTMuMzkxYzAuMzQ5LDAsMC42OTYsMC4wNTMsMS4wMjksMC4xNTl2LTQuMSBjLTAuMzg5LTAuMDUzLTAuNzgxLTAuMDc2LTEuMTc0LTAuMDY4djMuMTkxYy0wLjMzMy0wLjEwNi0wLjY4LTAuMTU5LTEuMDMtMC4xNTljLTEuODc0LDAtMy4zOTMsMS41MTgtMy4zOTMsMy4zOTEgQzE3LjIxMywyOS4xMjcsMTcuOTcyLDMwLjI3NCwxOS4wNzksMzAuODMyeiIgY2xpcC1ydWxlPSJldmVub2RkIj48L3BhdGg+PHBhdGggZmlsbD0iI2ZmZiIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMjguMDM0LDE5LjYzYzEuNTc2LDEuMTI2LDMuNTA3LDEuNzg4LDUuNTkyLDEuNzg4di0zLjE1NyBjLTEuMTY0LTAuMjQ4LTIuMTk0LTAuODU2LTIuOTY5LTEuNzAxYy0xLjMyNi0wLjgyNy0yLjI4MS0yLjE5MS0yLjU2MS0zLjc4OGgtMi45MjN2MTYuMDE4Yy0wLjAwNywxLjg2Ny0xLjUyMywzLjM3OS0zLjM5MywzLjM3OSBjLTEuMTAyLDAtMi4wODEtMC41MjUtMi43MDEtMS4zMzhjLTEuMTA3LTAuNTU4LTEuODY2LTEuNzA1LTEuODY2LTMuMDI5YzAtMS44NzMsMS41MTktMy4zOTEsMy4zOTMtMy4zOTEgYzAuMzU5LDAsMC43MDUsMC4wNTYsMS4wMywwLjE1OVYyMS4zOGMtNC4wMjQsMC4wODMtNy4yNiwzLjM2OS03LjI2LDcuNDExYzAsMi4wMTgsMC44MDYsMy44NDcsMi4xMTQsNS4xODMgYzEuMTgsMC43OTIsMi42MDEsMS4yNTQsNC4xMjksMS4yNTRjNC4wOTYsMCw3LjQxNy0zLjMxOSw3LjQxNy03LjQxM0wyOC4wMzQsMTkuNjNMMjguMDM0LDE5LjYzeiIgY2xpcC1ydWxlPSJldmVub2RkIj48L3BhdGg+PHBhdGggZmlsbD0iIzgxZDRmYSIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMzMuNjI2LDE4LjI2MnYtMC44NTRjLTEuMDUsMC4wMDItMi4wNzgtMC4yOTItMi45NjktMC44NDggQzMxLjQ0NSwxNy40MjMsMzIuNDgzLDE4LjAxOCwzMy42MjYsMTguMjYyeiBNMjguMDk1LDEyLjc3MmMtMC4wMjctMC4xNTMtMC4wNDctMC4zMDYtMC4wNjEtMC40NjF2LTAuNTE2aC00LjAzNnYxNi4wMTkgYy0wLjAwNiwxLjg2Ny0xLjUyMywzLjM3OS0zLjM5MywzLjM3OWMtMC41NDksMC0xLjA2Ny0wLjEzLTEuNTI2LTAuMzYyYzAuNjIsMC44MTMsMS41OTksMS4zMzgsMi43MDEsMS4zMzggYzEuODcsMCwzLjM4Ni0xLjUxMiwzLjM5My0zLjM3OVYxMi43NzJIMjguMDk1eiBNMjEuNjM1LDIxLjM4di0wLjkwOWMtMC4zMzctMC4wNDYtMC42NzctMC4wNjktMS4wMTgtMC4wNjkgYy00LjA5NywwLTcuNDE3LDMuMzE5LTcuNDE3LDcuNDEzYzAsMi41NjcsMS4zMDUsNC44MjksMy4yODgsNi4xNTljLTEuMzA4LTEuMzM2LTIuMTE0LTMuMTY1LTIuMTE0LTUuMTgzIEMxNC4zNzQsMjQuNzQ5LDE3LjYxMSwyMS40NjMsMjEuNjM1LDIxLjM4eiIgY2xpcC1ydWxlPSJldmVub2RkIj48L3BhdGg+PC9zdmc+"
                    />
                    <p>Link</p>
                    {editTik
                      ? admin.map((val) => (
                          <TextField
                            variant="outlined"
                            value={tiklink || val.tiktok}
                            onChange={(e) => {
                              setTiklink(e.target.value);
                            }}
                          />
                        ))
                      : admin.map((val) => <p>{val.tiktok}</p>)}
                  </div>

                  <div className="tikSocialEditBtnCont">
                    <IconButton
                      color="inherit"
                      className="tikEditsaveBtn"
                      onClick={() => {
                        if (!editTik) {
                          setEditTik(true);
                        } else {
                          if (tiklink.trim() === "") {
                            setEditTik(false);
                          } else {
                            firestore
                              .collection("admin")
                              .doc("4U6Ln0cxG3r6EZvKVarw")
                              .update({
                                tiktok: tiklink.trim(),
                              })
                              .then(() => {
                                setEditTik(false);
                              });
                          }
                        }
                      }}
                    >
                      {editTik ? (
                        tiklink !== "" ? (
                          <SaveRoundedIcon />
                        ) : (
                          <ClearRoundedIcon />
                        )
                      ) : hasTik ? (
                        <EditRoundedIcon />
                      ) : (
                        <AddRoundedIcon />
                      )}
                    </IconButton>
                    <Button
                      variant="contained"
                      className="clearTikbtn"
                      style={{
                        backgroundColor: "#00DF89",
                        color: "#fff",
                        height: "30px",
                        width: "40px",
                        marginLeft: "20px",
                      }}
                      onClick={() => {
                        firestore
                          .collection("admin")
                          .doc("4U6Ln0cxG3r6EZvKVarw")
                          .update({
                            tiktok: "",
                          })
                          .then(() => {
                            setEditTik(false);
                          });
                      }}
                    >
                      Clear
                    </Button>
                  </div>
                </div>
                <div className="mailCont">
                  <div className="mailSocialLinkCont">
                    <img
                      alt="svgImg"
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABmJLR0QA/wD/AP+gvaeTAAACSklEQVRIie3T3U9SYRzA8e9zwJeTMxUU1MyyDWdp823YNDO6yJVX2R/R2rrwz6hL11Vb/0NsZVubrTlstGVDLavNwkzMARKIIiByOF049JhvqLi1xveOh+f5fTiHcyBXrv8tof1wr/vlFZGSBoSgIpuIqrIoVDH45N2t9zvgB92v65Op9QlAziaqKVag1zU/dvR+A5DSq41Xyx7WNZXKQux98qgJAXVNpXJDp/FRem0TjoQS0YZ2I9beKvJlXdbQfFmHtbeKhnYjkVAiugOemVpyjzz7SV6+Dlt/LaazRcdGy6tP0XOnlgJZz6jdw8zUkjv9nV67MbaSxDk0j6XVgPVmJbNflvk6FiClqIcChQBLqwFLS9m2Gdp/Uf/3IVWFaVeQoDdOy3UzhspCxt/4iCwnMkLlYj1ttkqKivMYG/bi96zuuk/adRUILEQZtc8Rjyr09NdQ11hyIFpjOY3t7jmS6yoO+9yeKOxyxdrW4gofhhc4f6mEix3lGMwyH98usp5Qtg/Jk2jqqqD6QjHfJ4NMj4c2bt0+7QvDxvkfn8MEfXFab5jp6a/BNeIn5IsBUFpRSJvNDJLAOTTP0mL8oJGZwenCgTVG7R4ud5no7DvDtOs3APVtRhbcK3xy+lGSmT+EGcMASlJlwuHDOxeh+ZoJgWDS4eOXe+UwYw4Pp/POrrIc8AAQjSSPMuJo8HHAdHu+TifdFiwIn7imMTZhKSVeALETZKMpVX2+9Rs03e981YGUGgBhyq6p+hVVDD513h7L7txcuf6l/gCTRM/Et6dmRQAAAABJRU5ErkJggg=="
                    />
                    <p>Link</p>
                    {editMail
                      ? admin.map((val) => (
                          <TextField
                            variant="outlined"
                            value={maillink || val.mail}
                            onChange={(e) => {
                              setMaillink(e.target.value);
                            }}
                          />
                        ))
                      : admin.map((val) => <p>{val.mail}</p>)}
                  </div>

                  <div className="mailSocialEditBtnCont">
                    <IconButton
                      color="inherit"
                      className="mailEditsaveBtn"
                      onClick={() => {
                        if (!editMail) {
                          setEditMail(true);
                        } else {
                          if (maillink.trim() === "") {
                            setEditMail(false);
                          } else {
                            firestore
                              .collection("admin")
                              .doc("4U6Ln0cxG3r6EZvKVarw")
                              .update({
                                mail: maillink.trim(),
                              })
                              .then(() => {
                                setEditMail(false);
                              });
                          }
                        }
                      }}
                    >
                      {editMail ? (
                        maillink !== "" ? (
                          <SaveRoundedIcon />
                        ) : (
                          <ClearRoundedIcon />
                        )
                      ) : hasMail ? (
                        <EditRoundedIcon />
                      ) : (
                        <AddRoundedIcon />
                      )}
                    </IconButton>
                    <Button
                      variant="contained"
                      className="clearMailbtn"
                      style={{
                        backgroundColor: "#00DF89",
                        color: "#fff",
                        height: "30px",
                        width: "40px",
                        marginLeft: "20px",
                      }}
                      onClick={() => {
                        firestore
                          .collection("admin")
                          .doc("4U6Ln0cxG3r6EZvKVarw")
                          .update({
                            mail: "",
                          })
                          .then(() => {
                            setEditMail(false);
                          });
                      }}
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Adminprofile;
