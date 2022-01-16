import React, { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import phil, { barangays } from "phil-reg-prov-mun-brgy";
import { useHistory } from "react-router";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
} from "@material-ui/core";
import "./DeliveryAddress.scss";
import { auth, firestore } from "../../firebase/config";
import Aos from "aos";
import CircularProgress from "@material-ui/core/CircularProgress";
import Error from "../PopupMessages/Errormessage";

function DeliveryAddress() {
  const [region, setRegion] = useState("");
  const [selectedProvince, setSelectedProvince] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [selectedCity, setSelectedCity] = useState([]);
  const [selectedBrgy, setSBrgy] = useState([]);
  const [city, setCity] = useState([]);
  const [barangay, setBarangay] = useState([]);
  const [fullname, setFullname] = useState("");
  const [pnumber, setPnumber] = useState("");
  const [dAddress, setDaddress] = useState("");
  const history = useHistory();
  const db = firestore;
  const [submitting, setSubmitting] = useState(false);
  const [failed, setFailed] = useState(false);
  const [error, setError] = useState("");
  const [errorPrimary, setErrorPrimary] = useState("");

  const [color, setColor] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const db = firestore;
      const data = await db.collection("webinfo").get();
      setColor(data.docs.map((doc) => doc.data()));
    };
    fetchData();
  }, []);
  const [red, setRed] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const db = firestore;
      db.collection("redirectCheck").onSnapshot((snapshot) => {
        const newCheck = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setRed(newCheck);
      });
    };
    fetchData();
  }, []);

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

  return (
    <div>
      <div
        className={failed ? "faliedContDel faliedContDelShow" : "faliedContDel"}
      >
        <Error
          error={error}
          errorPrimary={errorPrimary}
          failed={failed}
          setFailed={setFailed}
        />
      </div>
      <div
        className="deliveryAdSubCont"
        style={failed ? { pointerEvents: "none" } : { pointerEvents: "auto" }}
      >
        <TextField
          required
          name="Fullname"
          label="Fullname"
          variant="outlined"
          className="infoText"
          value={fullname}
          onChange={(e) => {
            setFullname(e.target.value);
          }}
        />
        <TextField
          required
          name="number"
          label="Phone number"
          value={pnumber}
          variant="outlined"
          className="infoText"
          onChange={(e) => {
            setPnumber(e.target.value);
          }}
        />
        <FormControl variant="outlined" className="infoText" required>
          <InputLabel id="demo-simple-select-outlined-label">Region</InputLabel>
          <Select
            required
            value={region || ""}
            label="Regions"
            onChange={(e) => {
              const value = e.target.value;
              setRegion(value);

              if (value) {
                return setProvinces(
                  phil.provinces.filter((c) => value.reg_code === c.reg_code)
                );
              }
            }}
          >
            <MenuItem value="">
              <em>Select Region</em>
            </MenuItem>

            {phil.regions
              .sort((a, b) => {
                if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
                if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
              })
              .map((p, i) => (
                <MenuItem key={i} value={p}>
                  {p.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        <FormControl variant="outlined" className="infoText" required>
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
                  phil.city_mun.filter((b) => value.prov_code === b.prov_code)
                );
              }
            }}
          >
            <MenuItem value="">
              <em>Select Province</em>
            </MenuItem>

            {provinces
              .sort((a, b) => {
                if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
                if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
              })
              .map((p, i) => (
                <MenuItem key={i} value={p}>
                  {p.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        <FormControl variant="outlined" className="infoText" required>
          <InputLabel id="demo-simple-select-outlined-label">
            City/Municipality
          </InputLabel>
          <Select
            required
            value={selectedCity}
            label="City/Municipality"
            onChange={(e) => {
              const value = e.target.value;
              setSelectedCity(value);

              if (value) {
                return setBarangay(
                  phil.barangays.filter((b) => value.mun_code === b.mun_code)
                );
              }
            }}
          >
            <MenuItem value="">
              <em>Select City/Municipality</em>
            </MenuItem>

            {city
              .sort((a, b) => {
                if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
                if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
              })
              .map((p, i) => (
                <MenuItem key={i} value={p}>
                  {p.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        <FormControl variant="outlined" className="infoText" required>
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
            }}
          >
            <MenuItem value="">
              <em>Select Barangay</em>
            </MenuItem>

            {barangay
              .sort((a, b) => {
                if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
                if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
              })
              .map((p, i) => (
                <MenuItem key={i} value={p}>
                  {p.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        <TextField
          required
          name="dAddress"
          label="Detailed Address"
          variant="outlined"
          value={dAddress}
          className="infoText"
          placeholder="Unit number, house number, building, street name"
          onChange={(e) => {
            setDaddress(e.target.value);
          }}
        />
        {color.map((col) => (
          <div className="delAdBtnCont">
            <Button
              variant="contained"
              color="primary"
              className="delAdBtn"
              disabled={submitting ? true : false}
              style={{ backgroundColor: col.color }}
              onClick={() => {
                if (
                  fullname !== "" &&
                  pnumber !== "" &&
                  region.name !== "" &&
                  selectedProvince.name !== "" &&
                  selectedCity.name !== "" &&
                  selectedBrgy.name !== "" &&
                  dAddress !== ""
                ) {
                  setSubmitting(true);
                  db.collection("users")
                    .doc(useruid)
                    .update({
                      delFullname: fullname,
                      delPhonenumber: pnumber,
                      delRegion: region.name,
                      delProvince: selectedProvince.name,
                      delCity: selectedCity.name,
                      delBrgy: selectedBrgy.name,
                      delDetailedAddress: dAddress,
                    })
                    .then(() => {
                      setFullname("");
                      setPnumber("");
                      setRegion("");
                      setSelectedProvince([]);
                      setSelectedCity([]);
                      setSBrgy([]);
                      setDaddress("");
                      setSubmitting(false);
                      if (
                        red.some((val) => {
                          return val.redirect === true;
                        }) === true
                      ) {
                        firestore
                          .collection("redirectCheck")
                          .doc("aa")
                          .update({
                            redirect: false,
                          })
                          .then(() => {
                            history.push("/cart");
                          });
                      }
                    });
                } else {
                  setError("Please Fillup all fields");
                  setErrorPrimary("Empty field");
                  setFailed(true);
                }
              }}
            >
              {submitting ? <CircularProgress /> : "Save"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DeliveryAddress;
