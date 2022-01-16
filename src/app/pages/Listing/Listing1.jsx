import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import "./Listing1.scss";
import Button from "@material-ui/core/Button";
import { v4 as uuid } from "uuid";
import DeleteIcon from "@material-ui/icons/Delete";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import clsx from "clsx";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { firestore, storage } from "../../firebase/config";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import PlacesAutocomplete from "react-places-autocomplete";
import { useHistory } from "react-router-dom";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import CircularProgress from "@material-ui/core/CircularProgress";
import firebase from "firebase";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import FormHelperText from "@material-ui/core/FormHelperText";
import { set } from "date-fns";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

function Listing1() {
  const [images, setImages] = useState([]);
  const [category, setCategory] = useState("");
  const [cat, setCat] = useState("");
  const [dcat, setDcat] = useState([]);
  const [address, setAddress] = useState("");
  const [tags, setTags] = useState([]);

  const [addresses, setAddresses] = useState([]);
  const [ttag, setTtag] = useState("");
  const history = useHistory();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deliverydes, setDeliverydes] = useState("");
  const [stock, setStock] = useState(0);
  const [weight, setWeight] = useState("");
  const [size, setSize] = useState("");
  const [qty, setQty] = useState("");
  const [price, setPrice] = useState(0);
  const [prices, setPrices] = useState([]);
  const [vary, setVary] = useState("");
  const [variations, setVariations] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [psError, setPserror] = useState(false);
  const [psError2, setPserror2] = useState(false);
  let currentDate = new Date();

  var date =
    currentDate.getMonth() +
    1 +
    "/" +
    currentDate.getDate() +
    "/" +
    currentDate.getFullYear();

  // setDateupload(date);
  const today = Date.now();
  const dd = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(today);

  //datesAgeComputation
  const date1 = new Date("9/21/2021");
  const date2 = new Date("9/22/2021");
  const timeDiff = Math.abs(date2 - date1);
  const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  const monthDiff = Math.ceil(daysDiff / 30);
  console.log("time:", timeDiff, "days: ", daysDiff, "months ago: ", monthDiff);
  console.log(timeDiff);

  const handleTagChange = (e) => {
    setTtag(e.target.value);
  };

  const handleTagSubmit = () => {
    setTags([
      ...tags,
      {
        id: tags.length,
        value: ttag,
      },
    ]);
    setTtag("");
    console.log(tags.length);
  };
  const handleVarSubmit = () => {
    setVariations([
      ...variations,
      {
        id: variations.length,
        value: vary,
      },
    ]);
    setVary("");
  };
  const handleSizeSubmit = () => {
    const getNum = price.toString();
    const fnum = getNum.charAt(0);
    const ffnum = parseInt(fnum);
    if (size !== "" && price !== "") {
      if (ffnum !== 0) {
        setSizes([
          ...sizes,
          {
            id: sizes.length,
            value: size,
          },
        ]);
        setPrices([
          ...prices,
          {
            id: prices.length,
            value: price,
          },
        ]);
        setSize("");
        setPrice("");
        setPserror(false);
        setPserror2(false);
      } else {
        setPserror(false);
        setPserror2(true);
      }
    } else {
      setPserror(true);
      setPserror2(false);
    }
  };

  const handleAddressSubmit = () => {
    setAddresses([
      ...addresses,
      {
        id: addresses.length,
        value: address,
      },
    ]);
    setAddress("");
  };

  const handleSelect = (value) => {
    setAddress(value);
  };

  const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    root: {
      display: "flex",
      flexWrap: "wrap",
    },
    margin: {
      margin: theme.spacing(1),
    },
    withoutLabel: {
      marginTop: theme.spacing(3),
    },
    textField: {
      width: "25ch",
    },
  }));
  const classes = useStyles();

  const GreenCheckbox = withStyles({
    root: {
      color: "#9A9A9A",
      "&$checked": {
        color: "#49b78a",
      },
    },
    checked: {},
  })((props) => <Checkbox color="default" {...props} />);

  const [state, setState] = React.useState({
    checkedB: false,
    checkedC: false,
  });

  const ColorButton = withStyles((theme) => ({
    root: {
      color: "#fff",
      backgroundColor: "#49b78a",
      "&:hover": {
        backgroundColor: "#368866",
      },
    },
  }))(Button);

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const handleChange2 = (event) => {
    setCat(event.target.value);
  };

  const handlePriceChange = (e) => {
    if (e.target.value < 0) {
      e.target.value = e.target.value * -1;
    }
    setPrice(e.target.value);
  };
  const handleQtyChange = (e) => {
    if (e.target.value < 0) {
      e.target.value = e.target.value * -1;
    }
    setQty(e.target.value);
  };
  const handleStockChange = (e) => {
    if (e.target.value < 0) {
      e.target.value = e.target.value * -1;
    }
    setStock(e.target.value);
  };
  const handleWeightChange = (e) => {
    if (e.target.value < 0) {
      e.target.value = e.target.value * -1;
    }
    setWeight(e.target.value);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      if (images.length + acceptedFiles.length > 10)
        return alert("You can only upload a maimum of 10 photos");
      const newImg = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
          id: uuid(),
        })
      );

      setImages([...images, ...newImg]);
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      const db = firestore;
      const data = await db.collection("category").get();
      setDcat(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    fetchData();
  }, []);

  const hasValue = Boolean(category || images.length);

  const removeImg = (id) => () => {
    const imgs = images.filter((img) => img.id !== id);
    setImages(imgs);
  };

  const tremove = tags.map((x) => {
    return x.id;
  });

  const removeTag = (id) => () => {
    const newTag = tags.filter((tag) => tag.id !== id);
    setTags(newTag);
  };

  const removeAdress = (id) => () => {
    const newAdress = addresses.filter((addr) => addr.id !== id);
    setAddresses(newAdress);
  };

  const removeVars = (id) => () => {
    const newVar = variations.filter((vars) => vars.id !== id);
    setVariations(newVar);
  };

  const removeSize = (id) => () => {
    const newSize = sizes.filter((siz) => siz.id !== id);
    setSizes(newSize);
    const newPrice = prices.filter((prc) => prc.id !== id);
    setPrices(newPrice);
  };
  const removePrice = (id) => () => {
    const newSize = sizes.filter((siz) => siz.id !== id);
    setSizes(newSize);
    const newPrice = prices.filter((prc) => prc.id !== id);
    setPrices(newPrice);
  };

  const [ids, setIds] = useState([]);
  const [sid, setSid] = useState("");
  const [lastID, setLastID] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const db = firestore;
      const data = await db.collection("productinfo").get();
      setIds(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    fetchData();
  }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const db = firestore;
  //     const data = await db
  //       .collection("productinfo")
  //       .orderBy("timestamp", "desc")
  //       .limit(1)
  //       .get();
  //     setLastID(data.docs.map((doc) => ({ id: doc.id })));
  //   };
  //   fetchData();
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      const db = firestore;
      db.collection("productinfo")
        .orderBy("timestamp", "desc")
        .limit(1)
        .onSnapshot((snapshot) => {
          const newID = snapshot.docs.map((doc) => ({
            id: doc.id,
          }));
          setLastID(newID);
        });
    };
    fetchData();
  }, []);

  var x = 0;
  var z = "";
  let f;
  lastID.forEach((id) => (f = id.id));
  console.log("last:", f);
  f = +f + 1;
  console.log("plus1: ", f);
  // ids.map((iid) => (x = parseInt(iid.prodid, 10)));

  x = ids.length;
  console.log("idsLength: ", x);

  if (x < 1) {
    z = x.toString();
  } else {
    z = f.toString();
  }

  console.log("z", z);

  const [uploaded, setUploaded] = useState(false);

  const handleDelDes = async () => {
    try {
      await firestore.collection("productinfo").doc(z).update({
        proddeliverydescription: deliverydes,
      });
    } catch (err) {
      console.log(err.message);
    }
  };
  const [submitting, setSubmitting] = useState(false);

  const handleProdUpload = async () => {
    setSubmitting(true);
    try {
      await firestore
        .collection("productinfo")
        .doc(z)
        .set({
          prodcategory: cat,
          prodtitle: title,
          // prodprice: price,
          proddescription: description,
          prodid: z,
          likes: 0,
          rating: 0,
          totalrate: 0,
          sold: 0,
          qty: qty + "pcs",
          weight: weight + "Kg",
          imgSelector: false,
          imgselector: 0,
          pimgselector: 0,
          selectedSize: "",
          selectedPrice: "",
          selectedVariant: "",
          stock: stock,
          dateupload: dd,
          meetup: state.checkedB,
          delivery: state.checkedC,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          allLikes: [],
          allRated: [],
        })
        .then(() => {
          setCat("");
          setTitle("");
          // setPrice(0);
          setDescription("");
          setDeliverydes("");
          setQty("");
          setWeight("");
          setStock(0);

          setState({
            checkedB: false,
            checkedC: false,
          });
        });
    } catch (err) {
      console.log(err.message);
    }

    console.log("uploaded", tags.length);
    setUploaded(true);
    // window.location.reload(false);
  };

  const handleCounter = () => {
    setTimeout(function () {
      setSubmitting(false);
      setImages([]);
      // alert("Listed Successfuly");
      // window.location.reload(false);
    }, 1000);
  };

  const multipleUpload = () => {
    setSubmitting(true);
    for (let i = 0; i < images.length; i++) {
      console.log("okloop", submitting);
      const uploadTask = storage
        .ref("images/")
        .child(images[i].name)
        .put(images[i]);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          let progress;
          progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("progress: ", progress);
        },
        (err) => {
          console.log("err: ", err);
        },
        () => {
          storage
            .ref("images")
            .child(images[i].name)
            .getDownloadURL()
            .then((imageURL) => {
              firestore
                .collection("productinfo")
                .doc(z)
                .update({
                  allImages: firebase.firestore.FieldValue.arrayUnion(imageURL),
                })
                .then(() => {
                  // alert("Listing successful")
                  if (i === images.length - 1) {
                    // return console.log("Listing Successful");
                    return handleCounter();
                  }
                });
            });
        }
      );
    }
    console.log("okay na");
  };

  const tagUpload = async () => {
    for (let i = 0; i < tags.length; i++) {
      try {
        await firestore
          .collection("productinfo")
          .doc(z)
          .update({
            Alltags: firebase.firestore.FieldValue.arrayUnion(tags[i].value),
          })
          .then(() => {
            setTtag("");
            setTags([]);
          });
      } catch (err) {
        console.log(err.message);
      }
    }
  };
  const addressUpload = async (isSubmitting) => {
    if (isSubmitting) {
      setSubmitting(true);
    } else {
      setSubmitting(false);
    }
    for (let i = 0; i < addresses.length; i++) {
      console.log(submitting);
      try {
        await firestore
          .collection("productinfo")
          .doc(z)
          .update({
            Alladdresses: firebase.firestore.FieldValue.arrayUnion(
              addresses[i].value
            ),
          })
          .then(() => {
            setAddress("");
            setAddresses([]);
          });
      } catch (err) {
        console.log(err.message);
      }
    }
  };

  const varUpload = async () => {
    for (let i = 0; i < variations.length; i++) {
      try {
        await firestore
          .collection("productinfo")
          .doc(z)
          .update({
            Allvariations: firebase.firestore.FieldValue.arrayUnion(
              variations[i].value
            ),
          })
          .then(() => {
            setVary("");
            setVariations([]);
          });
      } catch (err) {
        console.log(err.message);
      }
    }
  };

  const sizeUpload = async () => {
    for (let i = 0; i < sizes.length; i++) {
      try {
        await firestore
          .collection("productinfo")
          .doc(z)
          .update({
            Allsizes: firebase.firestore.FieldValue.arrayUnion({
              id: sizes[i].id,
              value: sizes[i].value,
            }),
          })
          .then(() => {
            setSize("");
            setSizes([]);
          });
      } catch (err) {
        console.log(err.message);
      }
    }
  };
  const priceUpload = async () => {
    for (let i = 0; i < prices.length; i++) {
      try {
        await firestore
          .collection("productinfo")
          .doc(z)
          .update({
            Allprices: firebase.firestore.FieldValue.arrayUnion({
              id: prices[i].id,
              value: prices[i].value,
            }),
          })
          .then(() => {
            setPrice("");
            setPrices([]);
          });
      } catch (err) {
        console.log(err.message);
      }
    }
  };

  return (
    <div className="listCon">
      {/* <Nav /> */}
      <div className="draggableCon">
        <div className="lTitle">
          <IconButton
            aria-label="search"
            color="inherit"
            className="closeListingBtn"
            onClick={() => history.push("/admin/product")}
          >
            <CloseIcon />
          </IconButton>
          <h2>What are you listing today?</h2>
        </div>

        <div className={hasValue ? "content hasvalue" : " content "}>
          <div className="images">
            <div
              {...getRootProps({ className: "dropzone" })}
              // style={{ height: "300px" }}
            >
              <input {...getInputProps()} />
              <p>Click or drag and drop photos here(up to 10 photos)</p>{" "}
              <div className="listUploadBtn">
                <Button variant="contained" color="primary">
                  Upload
                </Button>
              </div>
            </div>

            <div className="previewCon">
              {images.map((image) => (
                <div className="imgCon">
                  <button onClick={removeImg(image.id)}>
                    <DeleteIcon fontSize="medium" />
                  </button>
                  <div className="imgCard">
                    <img src={image.preview} alt="img" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="category">
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="demo-simple-select-outlined-label">
                Category
              </InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={cat}
                onChange={handleChange2}
                required
                label="Category"
              >
                <MenuItem value="">
                  <em>none</em>
                </MenuItem>
                {dcat.map((cat) => (
                  <MenuItem value={cat.category}>{cat.category}</MenuItem>
                ))}
                {/* <MenuItem value="Vegetable">Vegetables</MenuItem>
                <MenuItem value="Fruits">Fruits</MenuItem>
                <MenuItem value="Seeds">Seeds</MenuItem>
                <MenuItem value="Plants">Plants</MenuItem>
                <MenuItem value="Rice">Rice</MenuItem>
                <MenuItem value="Materials and Equipment">
                  Materials and Equipment
                </MenuItem> */}
              </Select>
            </FormControl>
            <div className="catTxt">
              <TextField
                id="outlined-basic"
                label="Listing Title"
                variant="outlined"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              />
            </div>
            <h2>About item</h2>
            <div className="catQtyTxt">
              <TextField
                label="Quantity"
                id="outlined-basic"
                type="number"
                value={qty}
                onChange={handleQtyChange}
                className={clsx(classes.margin, classes.textField)}
                variant="outlined"
              />
            </div>
            <div className="catStockTxt">
              <TextField
                label="Stock"
                id="outlined-basic"
                value={stock}
                type="number"
                onChange={handleStockChange}
                className={clsx(classes.margin, classes.textField)}
                variant="outlined"
              />
            </div>
            <div className="priceSizeCont">
              <p className="psTitle">Link price to every size.</p>
              <div className="catSizeTxt">
                <TextField
                  id="outlined-basic"
                  type="text"
                  value={size}
                  label="Size"
                  variant="outlined"
                  placeholder="XS/S/M/L/XL/XXL/XXXL"
                  onChange={(e) => {
                    setSize(e.target.value);
                  }}
                />
              </div>
              <div className="catPriceTxt">
                <TextField
                  label="Price of your product"
                  id="outlined-start-adornment"
                  type="number"
                  value={price}
                  onChange={handlePriceChange}
                  className={clsx(classes.margin, classes.textField)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">Php</InputAdornment>
                    ),
                  }}
                  variant="outlined"
                />
              </div>
              <p className={psError ? "psError psErrorShow" : "psError"}>
                Fill-up both fields.
              </p>
              <p className={psError2 ? "psError2 psError2Show" : "psError2"}>
                Invalid Price.
              </p>
              <div className="addSizePriceBtn">
                <Button
                  className="addSizeBtn"
                  variant="contained"
                  color="primary"
                  onClick={handleSizeSubmit}
                >
                  Add
                </Button>
              </div>
            </div>
            <div className="psPreviewsCont">
              <div className="previewSize">
                {sizes.map((siz) => (
                  <div className="sizeCardCont">
                    <div className="sizeCard" key={siz.id}>
                      <div className="textCont">{siz.value}</div>

                      <IconButton
                        aria-label="search"
                        color="inherit"
                        className="deleteSizeBtn"
                        onClick={removeSize(siz.id)}
                      >
                        <CloseIcon />
                      </IconButton>
                    </div>
                  </div>
                ))}
              </div>
              <div className="psarrow">
                {sizes.map((val) => (
                  <div className="psWrap">
                    <div className="psArrowCont">
                      <ArrowDownwardIcon />
                    </div>
                  </div>
                ))}
              </div>

              <div className="previewPrice">
                {prices.map((prc) => (
                  <div className="priceCardCont">
                    <div className="priceCard" key={prc.id}>
                      <div className="prtextCont">₱ {prc.value}</div>

                      <IconButton
                        aria-label="search"
                        color="inherit"
                        className="deletePriceBtn"
                        onClick={removePrice(prc.id)}
                      >
                        <CloseIcon />
                      </IconButton>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="catWeightTxt">
              <FormControl
                className={clsx(classes.margin, classes.textField)}
                variant="outlined"
              >
                <OutlinedInput
                  id="outlined-adornment-weight"
                  value={weight}
                  onChange={handleWeightChange}
                  endAdornment={
                    <InputAdornment position="end">Kg</InputAdornment>
                  }
                  aria-describedby="outlined-weight-helper-text"
                  inputProps={{
                    "aria-label": "weight",
                  }}
                  labelWidth={0}
                />
                <FormHelperText id="outlined-weight-helper-text">
                  Weight
                </FormHelperText>
              </FormControl>
            </div>
            <div className="description">
              <TextField
                id="outlined-multiline-static"
                label="Description"
                value={description}
                multiline
                rows={7}
                placeholder="Describe what you are selling."
                variant="outlined"
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
            </div>
            <div className="varInputCont">
              <TextField
                id="outlined-basic"
                label="Add Variations"
                variant="outlined"
                value={vary}
                onChange={(e) => {
                  setVary(e.target.value);
                }}
              />
              <Button
                className="addVarBtn"
                variant="contained"
                color="primary"
                onClick={handleVarSubmit}
              >
                Add
              </Button>
            </div>

            <div className="previewVar">
              {variations.map((vars) => (
                <div className="varCardCont">
                  <div className="varCard" key={vars.id}>
                    <div className="textCont">{vars.value}</div>

                    <IconButton
                      aria-label="search"
                      color="inherit"
                      className="deleteVarsBtn"
                      onClick={removeVars(vars.id)}
                    >
                      <CloseIcon />
                    </IconButton>
                  </div>
                </div>
              ))}
            </div>

            <div className="tags">
              <h2>Add tags</h2>
              <p>Add tags for buyers to easily find your product</p>
              <div className="tagInputCont">
                <TextField
                  id="outlined-basic"
                  label="Add tag"
                  value={ttag}
                  variant="outlined"
                  onChange={handleTagChange}
                />
                <Button
                  className="addTagBtn"
                  variant="contained"
                  color="primary"
                  onClick={handleTagSubmit}
                >
                  Add
                </Button>
              </div>
            </div>
            <div className="previewTag">
              {tags.map((tag) => (
                <div className="tagCardCont">
                  <div className="tagCard" key={tag.id}>
                    <LocalOfferIcon />
                    <div className="textCont">{tag.value}</div>

                    <IconButton
                      aria-label="search"
                      color="inherit"
                      className="deleteUserBtn"
                      onClick={removeTag(tag.id)}
                    >
                      <CloseIcon />
                    </IconButton>
                  </div>
                </div>
              ))}
            </div>

            <h2>Deal method</h2>
            <FormControlLabel
              control={
                <GreenCheckbox
                  checked={state.checkedB}
                  onChange={handleChange}
                  name="checkedB"
                />
              }
              label="Meet-up"
            />
            <div
              className={state.checkedB ? "listingLoc checked" : "listingLoc"}
            >
              <PlacesAutocomplete
                value={address}
                onChange={setAddress}
                onSelect={handleSelect}
              >
                {({
                  getInputProps,
                  suggestions,
                  getSuggestionItemProps,
                  loading,
                }) => (
                  <div>
                    <div className="addressInputCont">
                      <TextField
                        {...getInputProps({
                          placeholder: "Add location",
                          className: "location-search-input",
                        })}
                        id="outlined-basic"
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocationOnIcon className="locationIcon" />
                            </InputAdornment>
                          ),
                        }}
                      />
                      <Button
                        className="addAddressBtn"
                        variant="contained"
                        color="primary"
                        onClick={handleAddressSubmit}
                      >
                        Add
                      </Button>
                    </div>

                    <div
                      className={
                        suggestions.length === 0
                          ? "autocomplete-dropdown-container autocomplete-dropdown-containerH"
                          : "autocomplete-dropdown-container"
                      }
                    >
                      {loading && <div>Loading...</div>}
                      {suggestions.map((suggestion) => {
                        const className = suggestion.active
                          ? "suggestion-item--active"
                          : "suggestion-item";
                        // inline style for demonstration purpose
                        const style = suggestion.active
                          ? { backgroundColor: "#F0F1F1", cursor: "pointer" }
                          : { backgroundColor: "#ffffff", cursor: "pointer" };
                        return (
                          <div
                            {...getSuggestionItemProps(suggestion, { style })}
                            className="places"
                          >
                            {suggestion.description}
                          </div>
                        );
                      })}
                    </div>
                    <div className="addressPreviewCont">
                      {addresses.map((add) => (
                        <div className="addressCardCont">
                          <div className="addressCard">
                            <div className="addressTextCont">{add.value}</div>

                            <IconButton
                              aria-label="search"
                              color="inherit"
                              className="deleteAddressBtn"
                              onClick={removeAdress(add.id)}
                            >
                              <CloseIcon />
                            </IconButton>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </PlacesAutocomplete>
            </div>
            <FormControlLabel
              control={
                <GreenCheckbox
                  checked={state.checkedC}
                  onChange={handleChange}
                  name="checkedC"
                />
              }
              label="Deliver"
            />
            <div
              className={state.checkedC ? "deliverDes checked2" : "deliverDes"}
            >
              <TextField
                id="outlined-multiline-static"
                label=""
                multiline
                rows={3}
                placeholder="Are there any delivery fees?"
                variant="outlined"
                value={deliverydes}
                onChange={(e) => {
                  setDeliverydes(e.target.value);
                }}
              />
            </div>
            <ColorButton
              variant="contained"
              color="primary"
              className={classes.margin}
              disabled={submitting ? true : false}
              onClick={() => {
                const hasProd = ids.some((item) => {
                  return item.prodtitle === title;
                });
                if (hasProd) {
                  alert("Product " + title + " already exist!");
                } else {
                  if (
                    title !== "" &&
                    cat !== "" &&
                    description !== "" &&
                    tags.length > 0 &&
                    sizes.length > 0 &&
                    prices.length > 0 &&
                    weight !== "" &&
                    stock !== 0 &&
                    qty !== ""
                  ) {
                    handleProdUpload();
                    multipleUpload();
                    tagUpload();
                    varUpload();
                    sizeUpload();
                    priceUpload();
                    if (state.checkedB === true) {
                      addressUpload();
                    }
                    if (state.checkedC === true) {
                      handleDelDes();
                    }
                  } else {
                    alert("Please fillup all fields");
                  }
                }
              }}
            >
              {submitting ? <CircularProgress /> : "List now"}
            </ColorButton>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Listing1;
