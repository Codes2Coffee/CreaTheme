import React, { useState, useEffect } from "react";
import "./Editing.scss";
import Home from "../../pages/Home/Home";
import { useDropzone } from "react-dropzone";
import Button from "@material-ui/core/Button";
import PNG from "../../images/png.png";
import JPG from "../../images/file.png";
import CloudUploadOutlinedIcon from "@material-ui/icons/CloudUploadOutlined";
import TextField from "@material-ui/core/TextField";
import DeleteIcon from "@material-ui/icons/Delete";
import { useHistory } from "react-router";
import { firestore, storage } from "../../firebase/config";
import IconButton from "@material-ui/core/IconButton";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import CircularProgress from "@material-ui/core/CircularProgress";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import { makeStyles } from "@material-ui/core/styles";
import Error from "../../components/PopupMessages/Errormessage";
import Confirm from "../../components/PopupMessages/Confirmation";

const db = firestore;

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

function Editing() {
  const [images, setImages] = useState([]);
  // const [fimage, setFimage] = useState([]);
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("");
  const [font, setFont] = useState("");
  const [fi, setFi] = useState(null);
  const [category, setCategory] = useState("");
  const [dcategory, setDcategory] = useState([]);
  const [color, setColor] = useState("");
  const [color1, setColor1] = useState("");
  const [color2, setColor2] = useState("");

  const formatter = new Intl.NumberFormat("en");

  const history = useHistory();

  const removeImg = (id) => () => {
    const imgs = images.filter((img) => img.id !== id);
    setImages(imgs);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      console.log(acceptedFiles);
      const newImg = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setImages(newImg);
    },
  });
  const imgContained = Boolean(images.length);
  const [frontimage, setFrontimage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const db = firestore;
      db.collection("category").onSnapshot((snapshot) => {
        const newCategory = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setDcategory(newCategory);
      });
    };
    fetchData();
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

  const handleChange = (e) => {
    setFont(e.target.value);
  };
  const [progressNum, setProgressnum] = useState(0);
  const [progressNum2, setProgressnum2] = useState(0);

  const handleChange2 = async (e) => {
    setFi(URL.createObjectURL(e.target.files[0]));
    const im = URL.createObjectURL(e.target.files[0]);
    try {
      let imgURL = "";
      if (im) {
        const res = await fetch(im);
        const blob = await res.blob();

        const imgRef = storage.ref().child(`fimage/${im}`);
        await imgRef.put(blob);

        imgURL = await imgRef.getDownloadURL();
      }

      await firestore
        .collection("fimage")
        .doc("ff")
        .set({
          imgURL,
        })
        .then(() => {
          setSubmitting2(false);
          setFi(null);
        });
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleUpload = (e) => {
    setSubmitting2(true);
    const img = e.target.files[0];
    const imgu = URL.createObjectURL(e.target.files[0]);
    const uploadTask = storage.ref(`frontimage/${img.name}`).put(img);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgressnum(progress);
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

            const imgRef = storage.ref().child(`fimage/${imgu}`);
            await imgRef.put(blob);

            imgURL = await imgRef.getDownloadURL();
          }

          await firestore
            .collection("fimage")
            .doc("ff")
            .set({
              imgURL,
            })
            .then(() => {
              setSubmitting2(false);
              setFi(null);
            });
        } catch (err) {
          console.log(err.message);
        }
      }
    );
  };

  const [submitting3, setSubmitting3] = useState(false);
  const handleUpload2 = (e) => {
    setSubmitting3(true);
    const img = e.target.files[0];
    const imgu = URL.createObjectURL(e.target.files[0]);
    const uploadTask = storage.ref(`logoimage/${img.name}`).put(img);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgressnum2(progress);
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

            const imgRef = storage.ref().child(`logomage/${imgu}`);
            await imgRef.put(blob);

            imgURL = await imgRef.getDownloadURL();
          }

          await firestore
            .collection("webinfo")
            .doc("ggg")
            .update({
              imgURL,
            })
            .then(() => {
              setSubmitting3(false);
            });
        } catch (err) {
          console.log(err.message);
        }
      }
    );
  };

  const [submitting2, setSubmitting2] = useState(false);

  const handleFiSubmit = async (isSubmitting) => {
    setSubmitting2(true);
    try {
      let imgURL = "";
      if (fi) {
        const res = await fetch(fi);
        const blob = await res.blob();

        const imgRef = storage.ref().child(`fimage/${fi}`);
        await imgRef.put(blob);

        imgURL = await imgRef.getDownloadURL();
      }

      await firestore
        .collection("fimage")
        .doc("ff")
        .set({
          imgURL,
        })
        .then(() => {
          setSubmitting2(false);
        });
    } catch (err) {
      console.log(err.message);
    }
  };

  const [submitting4, setSubmitting4] = useState(false);
  const handleLogoSubmit = async () => {
    setSubmitting4(true);
    try {
      let imgURL = "";
      if (images[0]) {
        const res = await fetch(images[0].preview);
        const blob = await res.blob();
        const imgRef = storage.ref().child(`logo/${images}`);
        await imgRef.put(blob);

        imgURL = await imgRef.getDownloadURL();
      }
      await firestore
        .collection("webinfo")
        .doc("ggg")
        .update({
          imgURL,
        })
        .then(() => {
          setSubmitting4(false);
        });
      console.log(images[0]);
    } catch (err) {
      console.log(err.message);
    }
  };

  const [submitting, setSubmitting] = useState(false);

  console.log("front", frontimage);
  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await firestore
        .collection("webinfo")
        .doc("ggg")
        .update({
          title: title,
          tag: tag,
          font: font,
        })
        .then(() => {
          setTitle("");
          setTag("");
          setFont("");
          setSubmitting(false);
        });
      console.log(images[0]);
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleCatChange = (e) => {
    setCategory(e.target.value);
  };

  const handleCatSubmit = async () => {
    if (category.trim() !== "") {
      try {
        await firestore
          .collection("category")
          .doc()
          .set({
            category: category,
          })
          .then(() => {
            setCategory("");
          });
      } catch (err) {
        console.log(err.message);
      }
    } else {
      setCategory("");
    }
  };

  const [front, setFront] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const db = firestore;
      db.collection("fimage").onSnapshot((snapshot) => {
        const newfront = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setFront(newfront);
      });
    };
    fetchData();
  }, []);

  const [logo, setLogo] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const db = firestore;
      db.collection("webinfo").onSnapshot((snapshot) => {
        const newlogo = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setLogo(newlogo);
      });
    };
    fetchData();
  }, []);

  const [colorhover, setColorhover] = useState(false);
  const [colorhover2, setColorhover2] = useState(false);
  const [colorhover3, setColorhover3] = useState(false);
  const [colorhover4, setColorhover4] = useState(false);
  const [colorhover5, setColorhover5] = useState(false);

  useEffect(() => {
    console.log("progress: ", progressNum);
  }, [progressNum]);

  // useEffect(() => {
  //   setPro
  // }, [progress])

  const classes = useStyles();
  const [error, setError] = useState("");
  const [errorPrimary, setErrorPrimary] = useState("");
  const [failed, setFailed] = useState(false);
  const [getCat, setGetcat] = useState("");
  const [confirmMsg, setConfirmMsg] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [catID, setCatID] = useState(false);
  const [color1ID, setColor1ID] = useState(false);
  const [color2ID, setColor2ID] = useState(false);
  const [color3ID, setColor3ID] = useState(false);
  const [color4ID, setColor4ID] = useState(false);
  const [color5ID, setColor5ID] = useState(false);
  const action = async () => {
    if (catID) {
      db.collection("category").doc(getCat).delete();
      setConfirm(false);
      setCatID(!catID);
    } else if (color1ID) {
      try {
        await firestore
          .collection("webinfo")
          .doc("ggg")
          .update({
            color: "#089BAB",
            color1: "#102851",
          })
          .then(() => {
            setConfirm(false);
            setColor1ID(false);
          });
      } catch (err) {
        console.log(err);
      }
    } else if (color2ID) {
      try {
        await firestore
          .collection("webinfo")
          .doc("ggg")
          .update({
            color: "#FF7828",
            color1: "#000",
          })
          .then(() => {
            setConfirm(false);
            setColor2ID(false);
          });
      } catch (err) {
        console.log(err);
      }
    } else if (color3ID) {
      try {
        await firestore
          .collection("webinfo")
          .doc("ggg")
          .update({
            color: "#5F40A6",
            color1: "#FF5996",
          })
          .then(() => {
            setConfirm(false);
            setColor3ID(false);
          });
      } catch (err) {
        console.log(err);
      }
    } else if (color4ID) {
      try {
        await firestore
          .collection("webinfo")
          .doc("ggg")
          .update({
            color: "#00DF89",
            color1: "#000",
          })
          .then(() => {
            setConfirm(false);
            setColor4ID(false);
          });
      } catch (err) {
        console.log(err);
      }
    } else if (color5ID) {
      try {
        await firestore
          .collection("webinfo")
          .doc("ggg")
          .update({
            color: "#1A2234",
            color1: "#gray",
          })
          .then(() => {
            setConfirm(false);
            setColor5ID(false);
          });
      } catch (err) {
        console.log(err);
      }
    }
  };
  const cancel = () => {
    setConfirm(false);
    if (catID) {
      setCatID(false);
    } else if (color1ID) {
      setColor1ID(false);
    } else if (color2ID) {
      setColor2ID(false);
    } else if (color3ID) {
      setColor3ID(false);
    } else if (color4ID) {
      setColor4ID(false);
    } else if (color5ID) {
      setColor5ID(false);
    }
  };

  return (
    <div>
      <div
        className={failed ? "faliedContCat faliedContCatShow" : "faliedContCat"}
      >
        <Error
          error={error}
          errorPrimary={errorPrimary}
          failed={failed}
          setFailed={setFailed}
        />
      </div>
      <Confirm
        confirm={confirm}
        confirmMsg={confirmMsg}
        action={action}
        cancel={cancel}
      />
      <div className="editingCont">
        <h3 className="t1">Customize your online shop.</h3>
        <div className="editingBodyCont">
          <h3 className="t2">PREVIEW</h3>
          <p className="tt2">Hover to zoom in.</p>
          <div className="homeCont">
            <div className="cover"></div>
            <div className="chld">
              <div className="cover2"></div>
              <Home />
            </div>
          </div>
          <div className="editImagesCont">
            {logo.map((item) => (
              <div className="editLogoCont">
                {/* <form className="subLogoForm" onSubmit={handleSubmit}> */}
                <div className="logoWrapper">
                  {/* <h2 className="editLogoTitle">Logo</h2> */}
                  <h2 style={{ marginBottom: "20px" }}>Logo</h2>
                  <div className="currentLogoPreviewCont">
                    <div className="logoImgCont">
                      <img src={item.imgURL} alt="Logo" />
                    </div>
                  </div>
                  {submitting3 ? (
                    <Box sx={{ width: "80%", marginLeft: "20px" }}>
                      <LinearProgress
                        variant="determinate"
                        value={progressNum2}
                      />
                    </Box>
                  ) : (
                    <div></div>
                  )}
                  <div className="inputLogoCont">
                    <input
                      type="file"
                      accept="image/*"
                      className={classes.input}
                      id="contained-button-file"
                      onChange={handleUpload2}
                    />
                    <label htmlFor="contained-button-file">
                      <Button
                        variant="contained"
                        color="primary"
                        component="span"
                        className="uploadLogoBtn"
                      >
                        <CloudUploadIcon />
                        Upload
                      </Button>
                    </label>
                  </div>
                </div>
              </div>
            ))}
            <div className="editFrontImgCont">
              <div className="frontImgWrapper">
                <h2 className="editFrontImgTitle">Front Image</h2>

                {front.map((item) => (
                  <div className="previewFiCont">
                    {/* <h2>Current image</h2> */}
                    <div className="fiImgCont">
                      <img src={item.imgURL} alt="Front" />
                    </div>
                  </div>
                ))}
                <div className="inputFiCont">
                  {submitting2 ? (
                    <Box sx={{ width: "80%", marginBottom: "20px" }}>
                      <LinearProgress
                        variant="determinate"
                        value={progressNum}
                      />
                    </Box>
                  ) : (
                    <div></div>
                  )}
                  <input
                    accept="image/*"
                    className={classes.input}
                    id="contained-button-file2"
                    type="file"
                    onChange={handleUpload}
                  />
                  <label htmlFor="contained-button-file2">
                    <Button
                      variant="contained"
                      color="primary"
                      component="span"
                      className="uploadFiBtn"
                    >
                      <CloudUploadIcon />
                      Upload
                    </Button>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {logo.map((item) => (
            <div className="editTitleCont">
              <div className="titleWrapper">
                <h2 className="editTitleT">Title</h2>
                <div className="titleInputCont">
                  <TextField
                    className="titleInput"
                    id="outlined-basic"
                    // label="Outlined"
                    placeholder="Shop name"
                    variant="outlined"
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                  />
                  <TextField
                    className="tagInput"
                    id="outlined-basic"
                    // label="Outlined"
                    placeholder="Tagline"
                    variant="outlined"
                    onChange={(e) => setTag(e.target.value)}
                    value={tag}
                  />
                  <FormControl variant="outlined" className="fontInput">
                    <InputLabel id="demo-simple-select-outlined-label">
                      Font
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      value={font}
                      onChange={handleChange}
                      label="Font"
                    >
                      <MenuItem value="">
                        <em>Default</em>
                      </MenuItem>
                      <MenuItem value="Lato">Lato</MenuItem>
                      <MenuItem value="Sofia Pro">Sofia Pro</MenuItem>
                      <MenuItem value="Lufga">Lufga</MenuItem>
                      <MenuItem value="Banaue">Banaue</MenuItem>
                      <MenuItem value="Roboto">Roboto</MenuItem>
                      <MenuItem value="Nunito">Nunito</MenuItem>
                    </Select>
                  </FormControl>
                </div>

                <div className="titleSaveBtnCont">
                  <Button
                    className="titleSaveBtn"
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={
                      title === "" && font === "" && tag === "" ? true : false
                    }
                  >
                    {submitting ? (
                      <CircularProgress className="loading1" />
                    ) : (
                      "Save"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}

          <div className="editColorCont">
            <div className="editColorWrapper">
              <h2 className="editColorTitle">Colors</h2>
              <div className="colorsCont">
                <div className="colorCont">
                  {logo.map((val) => (
                    <Button
                      variant="contained"
                      color="primary"
                      className="color1"
                      style={
                        val.color === "#089BAB"
                          ? { opacity: "1", transform: "scale(1.2)" }
                          : colorhover
                          ? { opacity: "1", transform: "scale(1.2)" }
                          : { opacity: "0.5", transform: "scale(1)" }
                      }
                      onMouseEnter={() => setColorhover(true)}
                      onMouseLeave={() => setColorhover(false)}
                      onClick={() => {
                        setConfirmMsg("Set color to #089BAB ?");
                        setConfirm(true);
                        setColor1ID(true);
                      }}
                    ></Button>
                  ))}

                  <p className="colorLabels">#089BAB</p>
                </div>
                <div className="colorCont">
                  {logo.map((val) => (
                    <Button
                      variant="contained"
                      color="primary"
                      className="color2"
                      style={
                        val.color === "#FF7828"
                          ? { opacity: "1", transform: "scale(1.2)" }
                          : colorhover2
                          ? { opacity: "1", transform: "scale(1.2)" }
                          : { opacity: "0.5", transform: "scale(1)" }
                      }
                      onMouseEnter={() => setColorhover2(true)}
                      onMouseLeave={() => setColorhover2(false)}
                      onClick={() => {
                        setConfirmMsg("Set color to #FF7828 ?");
                        setConfirm(true);
                        setColor2ID(true);
                      }}
                    ></Button>
                  ))}

                  <p className="colorLabels">#FF7828</p>
                </div>
                <div className="colorCont">
                  {logo.map((val) => (
                    <Button
                      variant="contained"
                      color="primary"
                      className="color3"
                      style={
                        val.color === "#5F40A6"
                          ? { opacity: "1", transform: "scale(1.2)" }
                          : colorhover3
                          ? { opacity: "1", transform: "scale(1.2)" }
                          : { opacity: "0.5", transform: "scale(1)" }
                      }
                      onMouseEnter={() => setColorhover3(true)}
                      onMouseLeave={() => setColorhover3(false)}
                      onClick={() => {
                        setConfirmMsg("Set color to #5F40A6 ?");
                        setConfirm(true);
                        setColor3ID(true);
                      }}
                    ></Button>
                  ))}

                  <p className="colorLabels">#5F40A6</p>
                </div>
                <div className="colorCont">
                  {logo.map((val) => (
                    <Button
                      variant="contained"
                      color="primary"
                      className="color4"
                      style={
                        val.color === "#00DF89"
                          ? { opacity: "1", transform: "scale(1.2)" }
                          : colorhover4
                          ? { opacity: "1", transform: "scale(1.2)" }
                          : { opacity: "0.5", transform: "scale(1)" }
                      }
                      onMouseEnter={() => setColorhover4(true)}
                      onMouseLeave={() => setColorhover4(false)}
                      onClick={() => {
                        setConfirmMsg("Set color to #00DF89");
                        setConfirm(true);
                        setColor4ID(true);
                      }}
                    ></Button>
                  ))}

                  <p className="colorLabels">#00DF89</p>
                </div>
                <div className="colorCont">
                  {logo.map((val) => (
                    <Button
                      variant="contained"
                      color="primary"
                      className="color5"
                      style={
                        val.color === "#1A2234"
                          ? { opacity: "1", transform: "scale(1.2)" }
                          : colorhover5
                          ? { opacity: "1", transform: "scale(1.2)" }
                          : { opacity: "0.5", transform: "scale(1)" }
                      }
                      onMouseEnter={() => setColorhover5(true)}
                      onMouseLeave={() => setColorhover5(false)}
                      onClick={() => {
                        setConfirmMsg("Set color to #1A2234 ?");
                        setConfirm(true);
                        setColor5ID(true);
                      }}
                    ></Button>
                  ))}

                  <p className="colorLabels">#1A2234</p>
                </div>
              </div>
              <div className="colorNameCont">
                <div className={!color ? "colorName colorNameS" : "colorName"}>
                  {color}
                </div>
              </div>
            </div>
          </div>

          <div className="editCategoryCont">
            <div className="editCategoryWrapper">
              <h2 className="editCategoryTitle">Category</h2>
              <div className="editCategoryTopCont">
                <div className="categoryTextCont">
                  <TextField
                    className="tagInput"
                    id="outlined-basic"
                    label="Category name"
                    variant="outlined"
                    value={category}
                    onChange={handleCatChange}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    className="addCategoryBtn"
                    onClick={handleCatSubmit}
                  >
                    Add
                  </Button>
                </div>
                <div className="categoryNumCont">
                  <h1>{formatter.format(dcategory.length)} Categories</h1>
                </div>
              </div>

              <div className="categoryTableCont">
                <div className="cColumn1">
                  <h3>ID</h3>
                  {dcategory.map((cat) => (
                    <div className="categories">{cat.id}</div>
                  ))}
                </div>
                <div className="cColumn2">
                  <h3>Categories</h3>
                  {dcategory.map((cat) => (
                    <div className="categories">{cat.category}</div>
                  ))}
                </div>
                <div className="cColumn3">
                  <h3>Action</h3>
                  {dcategory.map((cat) => (
                    <div className="categories">
                      <IconButton
                        aria-label="search"
                        color="inherit"
                        className="deleteCatBtn"
                        onClick={() => {
                          if (
                            products.some((val) => {
                              return val.prodcategory === cat.category;
                            }) === true
                          ) {
                            setError(
                              "Products with this category still exist in shop."
                            );
                            setErrorPrimary("Delete failed");
                            setFailed(true);
                          } else {
                            setGetcat(cat.id);
                            setConfirmMsg(
                              "Are you sure you want to delete this category?"
                            );
                            setConfirm(true);
                            setCatID(true);
                          }
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Editing;
