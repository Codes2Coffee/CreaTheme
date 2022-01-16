import React, { useState, useEffect } from "react";
import "./Product.scss";
import { Button } from "@material-ui/core";
import { Route, Switch, useHistory } from "react-router-dom";
import AddIcon from "@material-ui/icons/Add";
import Slide from "../Slideshow/Slideshow";
import { firestore } from "../../firebase/config";
import IconButton from "@material-ui/core/IconButton";
import ArrowForwardIosRoundedIcon from "@material-ui/icons/ArrowForwardIosRounded";
import ArrowBackIosRoundedIcon from "@material-ui/icons/ArrowBackIosRounded";
import DeleteIcon from "@material-ui/icons/Delete";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Confirm from "../../components/PopupMessages/Confirmation";

function Product() {
  const history = useHistory();
  const db = firestore;
  let x = 2;

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
  const [searchcontent, setSearchcontent] = useState("");

  const [catvalue, setCatvalue] = useState("");

  const [category, setCategory] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const db = firestore;
      db.collection("category").onSnapshot((snapshot) => {
        const newCategory = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setCategory(newCategory);
      });
    };
    fetchData();
  }, []);

  const [searchvalue, setSearchvalue] = useState(false);

  const [focused, setFocused] = useState(false);

  const [prodidGet, setProdidGet] = useState("");
  const [confirmMsg, setConfirmMsg] = useState("");
  const [confirm, setConfirm] = useState(false);

  const action = () => {
    db.collection("productinfo")
      .doc(prodidGet)
      .delete()
      .then(() => {
        setConfirm(false);
      });
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
      <div className="prodCont">
        <div className="prodTopCont">
          <h3>Products</h3>
          <div className="addProdBtnCont">
            <Button
              variant="contained"
              color="primary"
              className="addProdBtn"
              onClick={() => history.push("/admin/listings")}
            >
              <AddIcon />
              Add product
            </Button>
          </div>
        </div>
        <div className="productSubCont">
          <div className="topCont">
            <div
              className={focused ? "searchBarCont searchBarF" : "searchBarCont"}
            >
              <TextField
                id="outlined-basic"
                placeholder="Search"
                variant="outlined"
                className="prodSearchbar"
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

            <div className="rightTop">
              <FormControl variant="outlined" className="filterCategory">
                <InputLabel id="demo-simple-select-outlined-label">
                  Category
                </InputLabel>
                <Select
                  value={catvalue}
                  onChange={(e) => {
                    setCatvalue(e.target.value);
                  }}
                  label="Category"
                >
                  <MenuItem value="">
                    <em>All</em>
                  </MenuItem>
                  {category.map((cat) => (
                    <MenuItem value={cat.category}>{cat.category}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <h2>{formatter.format(products.length)} products</h2>
            </div>
          </div>
          <div className="botCont">
            <div className="prodColumn">
              {products
                .filter((val) => {
                  if (searchcontent === "") {
                    if (catvalue === "") {
                      return val;
                    } else if (
                      val.prodcategory.toLowerCase() === catvalue.toLowerCase()
                    ) {
                      if (searchcontent === "") {
                        return val;
                      } else if (
                        val.prodtitle
                          .toLowerCase()
                          .includes(searchcontent.toLowerCase()) ||
                        val.Alltags.some((tag) => {
                          return tag
                            .toLowerCase()
                            .includes(searchcontent.toLowerCase());
                        }) ||
                        val.Allsizes.some((size) => {
                          return size.value
                            .toLowerCase()
                            .includes(searchcontent.toLowerCase());
                        }) ||
                        val.Allvariations.some((vars) => {
                          return vars
                            .toLowerCase()
                            .includes(searchcontent.toLowerCase());
                        }) ||
                        val.Allprices.some((pr) => {
                          return pr.value
                            .toLowerCase()
                            .includes(searchcontent.toLowerCase());
                        }) ||
                        val.prodcategory
                          .toLowerCase()
                          .includes(searchcontent.toLowerCase())
                      ) {
                        return val;
                      }
                    }
                  } else {
                    if (catvalue === "") {
                      if (
                        val.prodtitle
                          .toLowerCase()
                          .includes(searchcontent.toLowerCase()) ||
                        val.Alltags.some((tag) => {
                          return tag
                            .toLowerCase()
                            .includes(searchcontent.toLowerCase());
                        }) ||
                        val.Allsizes.some((size) => {
                          return size.value
                            .toLowerCase()
                            .includes(searchcontent.toLowerCase());
                        }) ||
                        val.Allvariations.some((vars) => {
                          return vars
                            .toLowerCase()
                            .includes(searchcontent.toLowerCase());
                        }) ||
                        val.Allprices.some((pr) => {
                          return pr.value
                            .toLowerCase()
                            .includes(searchcontent.toLowerCase());
                        }) ||
                        val.prodcategory
                          .toLowerCase()
                          .includes(searchcontent.toLowerCase())
                      ) {
                        return val;
                      }
                    } else {
                      if (
                        val.prodcategory.toLowerCase() ===
                        catvalue.toLowerCase()
                      ) {
                        if (
                          val.prodtitle
                            .toLowerCase()
                            .includes(searchcontent.toLowerCase()) ||
                          val.Alltags.some((tag) => {
                            return tag
                              .toLowerCase()
                              .includes(searchcontent.toLowerCase());
                          }) ||
                          val.Allsizes.some((size) => {
                            return size.value
                              .toLowerCase()
                              .includes(searchcontent.toLowerCase());
                          }) ||
                          val.Allvariations.some((vars) => {
                            return vars
                              .toLowerCase()
                              .includes(searchcontent.toLowerCase());
                          }) ||
                          val.Allprices.some((pr) => {
                            return pr.value
                              .toLowerCase()
                              .includes(searchcontent.toLowerCase());
                          }) ||
                          val.prodcategory
                            .toLowerCase()
                            .includes(searchcontent.toLowerCase())
                        ) {
                          return val;
                        }
                      }
                    }
                  }
                })
                .map((prod) => (
                  <div className="columnCont">
                    <div className="prevBtnCont">
                      <IconButton
                        aria-label="search"
                        color="inherit"
                        className="prevBtn"
                        onClick={() => {
                          if (prod.pimgselector > 0) {
                            db.collection("productinfo")
                              .doc(prod.id)
                              .update({
                                pimgselector: prod.pimgselector - 1,
                              });
                          } else {
                            db.collection("productinfo")
                              .doc(prod.id)
                              .update({
                                pimgselector: prod.allImages.length - 1,
                              });
                          }
                        }}
                      >
                        <ArrowBackIosRoundedIcon />
                      </IconButton>
                    </div>
                    <div className="imgWrapper">
                      <img
                        src={prod.allImages[prod.pimgselector]}
                        alt="prodImg"
                        className="prodImg"
                      />
                      <div className="bulletCont">
                        {prod.allImages.map((item) => (
                          <div className="bulletSelector"></div>
                        ))}
                      </div>
                    </div>
                    <div className="nextBtnCont">
                      <IconButton
                        aria-label="search"
                        color="inherit"
                        className="nextBtn"
                        onClick={() => {
                          if (prod.pimgselector < prod.allImages.length - 1) {
                            db.collection("productinfo")
                              .doc(prod.id)
                              .update({
                                pimgselector: prod.pimgselector + 1,
                              });
                          } else {
                            db.collection("productinfo").doc(prod.id).update({
                              pimgselector: 0,
                            });
                          }
                        }}
                      >
                        <ArrowForwardIosRoundedIcon />
                      </IconButton>
                    </div>
                  </div>
                ))}
            </div>
            <div className="prodColumn">
              {products
                .filter((val) => {
                  if (searchcontent === "") {
                    if (catvalue === "") {
                      return val;
                    } else if (
                      val.prodcategory.toLowerCase() === catvalue.toLowerCase()
                    ) {
                      if (searchcontent === "") {
                        return val;
                      } else if (
                        val.prodtitle
                          .toLowerCase()
                          .includes(searchcontent.toLowerCase()) ||
                        val.Alltags.some((tag) => {
                          return tag
                            .toLowerCase()
                            .includes(searchcontent.toLowerCase());
                        }) ||
                        val.Allsizes.some((size) => {
                          return size.value
                            .toLowerCase()
                            .includes(searchcontent.toLowerCase());
                        }) ||
                        val.Allvariations.some((vars) => {
                          return vars
                            .toLowerCase()
                            .includes(searchcontent.toLowerCase());
                        }) ||
                        val.Allprices.some((pr) => {
                          return pr.value
                            .toLowerCase()
                            .includes(searchcontent.toLowerCase());
                        }) ||
                        val.prodcategory
                          .toLowerCase()
                          .includes(searchcontent.toLowerCase())
                      ) {
                        return val;
                      }
                    }
                  } else {
                    if (catvalue === "") {
                      if (
                        val.prodtitle
                          .toLowerCase()
                          .includes(searchcontent.toLowerCase()) ||
                        val.Alltags.some((tag) => {
                          return tag
                            .toLowerCase()
                            .includes(searchcontent.toLowerCase());
                        }) ||
                        val.Allsizes.some((size) => {
                          return size.value
                            .toLowerCase()
                            .includes(searchcontent.toLowerCase());
                        }) ||
                        val.Allvariations.some((vars) => {
                          return vars
                            .toLowerCase()
                            .includes(searchcontent.toLowerCase());
                        }) ||
                        val.Allprices.some((pr) => {
                          return pr.value
                            .toLowerCase()
                            .includes(searchcontent.toLowerCase());
                        }) ||
                        val.prodcategory
                          .toLowerCase()
                          .includes(searchcontent.toLowerCase())
                      ) {
                        return val;
                      }
                    } else {
                      if (
                        val.prodcategory.toLowerCase() ===
                        catvalue.toLowerCase()
                      ) {
                        if (
                          val.prodtitle
                            .toLowerCase()
                            .includes(searchcontent.toLowerCase()) ||
                          val.Alltags.some((tag) => {
                            return tag
                              .toLowerCase()
                              .includes(searchcontent.toLowerCase());
                          }) ||
                          val.Allsizes.some((size) => {
                            return size.value
                              .toLowerCase()
                              .includes(searchcontent.toLowerCase());
                          }) ||
                          val.Allvariations.some((vars) => {
                            return vars
                              .toLowerCase()
                              .includes(searchcontent.toLowerCase());
                          }) ||
                          val.Allprices.some((pr) => {
                            return pr.value
                              .toLowerCase()
                              .includes(searchcontent.toLowerCase());
                          }) ||
                          val.prodcategory
                            .toLowerCase()
                            .includes(searchcontent.toLowerCase())
                        ) {
                          return val;
                        }
                      }
                    }
                  }
                })
                .map((prod) => (
                  <div className="columnCont2">
                    <h2>{prod.prodtitle}</h2>
                    <h3>{prod.prodcategory}</h3>
                    {/* <h3>₱ {formatter.format(prod.prodprice)}</h3> */}
                    {prod.Allprices.sort((a, b) => {
                      if (parseInt(a.value) < parseInt(b.value)) return 1;
                      if (parseInt(a.value) > parseInt(b.value)) return -1;
                    })
                      .filter((val) => {
                        return val.id === 0;
                      })
                      .map((val) => (
                        <h3 className="price">
                          ₱ {formatter.format(val.value)}
                        </h3>
                      ))}
                    <h3>-</h3>
                    {prod.Allprices.sort((a, b) => {
                      if (parseInt(a.value) < parseInt(b.value)) return 1;
                      if (parseInt(a.value) > parseInt(b.value)) return -1;
                    })
                      .filter((val) => {
                        return val.id === prod.Allprices.length - 1;
                      })
                      .map((val) => (
                        <h3 className="price2">
                          ₱ {formatter.format(val.value)}
                        </h3>
                      ))}
                    <div className="dealCont">
                      {prod.meetup ? <p>Meetup ✓</p> : <p>Meetup ✕</p>}
                      {prod.delivery ? <p>Delivery ✓</p> : <p>Delivery ✕</p>}
                    </div>
                  </div>
                ))}
            </div>

            <div className="prodColumn">
              {products
                .filter((val) => {
                  if (searchcontent === "") {
                    if (catvalue === "") {
                      return val;
                    } else if (
                      val.prodcategory.toLowerCase() === catvalue.toLowerCase()
                    ) {
                      if (searchcontent === "") {
                        return val;
                      } else if (
                        val.prodtitle
                          .toLowerCase()
                          .includes(searchcontent.toLowerCase()) ||
                        val.Alltags.some((tag) => {
                          return tag
                            .toLowerCase()
                            .includes(searchcontent.toLowerCase());
                        }) ||
                        val.Allsizes.some((size) => {
                          return size.value
                            .toLowerCase()
                            .includes(searchcontent.toLowerCase());
                        }) ||
                        val.Allvariations.some((vars) => {
                          return vars
                            .toLowerCase()
                            .includes(searchcontent.toLowerCase());
                        }) ||
                        val.Allprices.some((pr) => {
                          return pr.value
                            .toLowerCase()
                            .includes(searchcontent.toLowerCase());
                        }) ||
                        val.prodcategory
                          .toLowerCase()
                          .includes(searchcontent.toLowerCase())
                      ) {
                        return val;
                      }
                    }
                  } else {
                    if (catvalue === "") {
                      if (
                        val.prodtitle
                          .toLowerCase()
                          .includes(searchcontent.toLowerCase()) ||
                        val.Alltags.some((tag) => {
                          return tag
                            .toLowerCase()
                            .includes(searchcontent.toLowerCase());
                        }) ||
                        val.Allsizes.some((size) => {
                          return size.value
                            .toLowerCase()
                            .includes(searchcontent.toLowerCase());
                        }) ||
                        val.Allvariations.some((vars) => {
                          return vars
                            .toLowerCase()
                            .includes(searchcontent.toLowerCase());
                        }) ||
                        val.Allprices.some((pr) => {
                          return pr.value
                            .toLowerCase()
                            .includes(searchcontent.toLowerCase());
                        }) ||
                        val.prodcategory
                          .toLowerCase()
                          .includes(searchcontent.toLowerCase())
                      ) {
                        return val;
                      }
                    } else {
                      if (
                        val.prodcategory.toLowerCase() ===
                        catvalue.toLowerCase()
                      ) {
                        if (
                          val.prodtitle
                            .toLowerCase()
                            .includes(searchcontent.toLowerCase()) ||
                          val.Alltags.some((tag) => {
                            return tag
                              .toLowerCase()
                              .includes(searchcontent.toLowerCase());
                          }) ||
                          val.Allsizes.some((size) => {
                            return size.value
                              .toLowerCase()
                              .includes(searchcontent.toLowerCase());
                          }) ||
                          val.Allvariations.some((vars) => {
                            return vars
                              .toLowerCase()
                              .includes(searchcontent.toLowerCase());
                          }) ||
                          val.Allprices.some((pr) => {
                            return pr.value
                              .toLowerCase()
                              .includes(searchcontent.toLowerCase());
                          }) ||
                          val.prodcategory
                            .toLowerCase()
                            .includes(searchcontent.toLowerCase())
                        ) {
                          return val;
                        }
                      }
                    }
                  }
                })
                .map((prod) => (
                  <div className="columnCont3">
                    <div className="variationCont">
                      <p>Variations: </p>
                      {prod.Allvariations.map((vars) => (
                        <p className="variants">{vars}, </p>
                      ))}
                    </div>
                    <div className="sizesCont">
                      <p>Sizes: </p>
                      {prod.Allsizes.map((size) => (
                        <p className="sizes"> {size.value}, </p>
                      ))}
                    </div>
                    <div className="dateCont">
                      <p>Uploaded: </p>
                      <p className="date">{prod.dateupload}</p>
                    </div>
                  </div>
                ))}
            </div>

            <div className="prodColumn">
              {products
                .filter((val) => {
                  if (searchcontent === "") {
                    if (catvalue === "") {
                      return val;
                    } else if (
                      val.prodcategory.toLowerCase() === catvalue.toLowerCase()
                    ) {
                      if (searchcontent === "") {
                        return val;
                      } else if (
                        val.prodtitle
                          .toLowerCase()
                          .includes(searchcontent.toLowerCase()) ||
                        val.Alltags.some((tag) => {
                          return tag
                            .toLowerCase()
                            .includes(searchcontent.toLowerCase());
                        }) ||
                        val.Allsizes.some((size) => {
                          return size.value
                            .toLowerCase()
                            .includes(searchcontent.toLowerCase());
                        }) ||
                        val.Allvariations.some((vars) => {
                          return vars
                            .toLowerCase()
                            .includes(searchcontent.toLowerCase());
                        }) ||
                        val.Allprices.some((pr) => {
                          return pr.value
                            .toLowerCase()
                            .includes(searchcontent.toLowerCase());
                        }) ||
                        val.prodcategory
                          .toLowerCase()
                          .includes(searchcontent.toLowerCase())
                      ) {
                        return val;
                      }
                    }
                  } else {
                    if (catvalue === "") {
                      if (
                        val.prodtitle
                          .toLowerCase()
                          .includes(searchcontent.toLowerCase()) ||
                        val.Alltags.some((tag) => {
                          return tag
                            .toLowerCase()
                            .includes(searchcontent.toLowerCase());
                        }) ||
                        val.Allsizes.some((size) => {
                          return size.value
                            .toLowerCase()
                            .includes(searchcontent.toLowerCase());
                        }) ||
                        val.Allvariations.some((vars) => {
                          return vars
                            .toLowerCase()
                            .includes(searchcontent.toLowerCase());
                        }) ||
                        val.Allprices.some((pr) => {
                          return pr.value
                            .toLowerCase()
                            .includes(searchcontent.toLowerCase());
                        }) ||
                        val.prodcategory
                          .toLowerCase()
                          .includes(searchcontent.toLowerCase())
                      ) {
                        return val;
                      }
                    } else {
                      if (
                        val.prodcategory.toLowerCase() ===
                        catvalue.toLowerCase()
                      ) {
                        if (
                          val.prodtitle
                            .toLowerCase()
                            .includes(searchcontent.toLowerCase()) ||
                          val.Alltags.some((tag) => {
                            return tag
                              .toLowerCase()
                              .includes(searchcontent.toLowerCase());
                          }) ||
                          val.Allsizes.some((size) => {
                            return size.value
                              .toLowerCase()
                              .includes(searchcontent.toLowerCase());
                          }) ||
                          val.Allvariations.some((vars) => {
                            return vars
                              .toLowerCase()
                              .includes(searchcontent.toLowerCase());
                          }) ||
                          val.Allprices.some((pr) => {
                            return pr.value
                              .toLowerCase()
                              .includes(searchcontent.toLowerCase());
                          }) ||
                          val.prodcategory
                            .toLowerCase()
                            .includes(searchcontent.toLowerCase())
                        ) {
                          return val;
                        }
                      }
                    }
                  }
                })
                .map((prod) => (
                  <div className="columnCont4">
                    <div className="desCont">
                      <p> Description: {prod.proddescription}</p>
                    </div>
                    <div className="numbersCont">
                      <p> Stock: {prod.stock} </p>
                      <p> Qty: {prod.qty}</p>
                      <p> Weight: {prod.weight}</p>
                      <p> Sold: {prod.sold}</p>
                    </div>
                  </div>
                ))}
            </div>
            <div className="prodColumn">
              {products
                .filter((val) => {
                  if (searchcontent === "") {
                    if (catvalue === "") {
                      return val;
                    } else if (
                      val.prodcategory.toLowerCase() === catvalue.toLowerCase()
                    ) {
                      if (searchcontent === "") {
                        return val;
                      } else if (
                        val.prodtitle
                          .toLowerCase()
                          .includes(searchcontent.toLowerCase()) ||
                        val.Alltags.some((tag) => {
                          return tag
                            .toLowerCase()
                            .includes(searchcontent.toLowerCase());
                        }) ||
                        val.Allsizes.some((size) => {
                          return size.value
                            .toLowerCase()
                            .includes(searchcontent.toLowerCase());
                        }) ||
                        val.Allvariations.some((vars) => {
                          return vars
                            .toLowerCase()
                            .includes(searchcontent.toLowerCase());
                        }) ||
                        val.Allprices.some((pr) => {
                          return pr.value
                            .toLowerCase()
                            .includes(searchcontent.toLowerCase());
                        }) ||
                        val.prodcategory
                          .toLowerCase()
                          .includes(searchcontent.toLowerCase())
                      ) {
                        return val;
                      }
                    }
                  } else {
                    if (catvalue === "") {
                      if (
                        val.prodtitle
                          .toLowerCase()
                          .includes(searchcontent.toLowerCase()) ||
                        val.Alltags.some((tag) => {
                          return tag
                            .toLowerCase()
                            .includes(searchcontent.toLowerCase());
                        }) ||
                        val.Allsizes.some((size) => {
                          return size.value
                            .toLowerCase()
                            .includes(searchcontent.toLowerCase());
                        }) ||
                        val.Allvariations.some((vars) => {
                          return vars
                            .toLowerCase()
                            .includes(searchcontent.toLowerCase());
                        }) ||
                        val.Allprices.some((pr) => {
                          return pr.value
                            .toLowerCase()
                            .includes(searchcontent.toLowerCase());
                        }) ||
                        val.prodcategory
                          .toLowerCase()
                          .includes(searchcontent.toLowerCase())
                      ) {
                        return val;
                      }
                    } else {
                      if (
                        val.prodcategory.toLowerCase() ===
                        catvalue.toLowerCase()
                      ) {
                        if (
                          val.prodtitle
                            .toLowerCase()
                            .includes(searchcontent.toLowerCase()) ||
                          val.Alltags.some((tag) => {
                            return tag
                              .toLowerCase()
                              .includes(searchcontent.toLowerCase());
                          }) ||
                          val.Allsizes.some((size) => {
                            return size.value
                              .toLowerCase()
                              .includes(searchcontent.toLowerCase());
                          }) ||
                          val.Allvariations.some((vars) => {
                            return vars
                              .toLowerCase()
                              .includes(searchcontent.toLowerCase());
                          }) ||
                          val.Allprices.some((pr) => {
                            return pr.value
                              .toLowerCase()
                              .includes(searchcontent.toLowerCase());
                          }) ||
                          val.prodcategory
                            .toLowerCase()
                            .includes(searchcontent.toLowerCase())
                        ) {
                          return val;
                        }
                      }
                    }
                  }
                })
                .map((prod) => (
                  <div className="columnCont5">
                    <Button
                      variant="contained"
                      color="primary"
                      className="featBtn"
                      style={
                        prod.featured
                          ? { backgroundColor: "maroon" }
                          : { backgroundColor: "#00ab55" }
                      }
                      onClick={() => {
                        if (prod.featured === false) {
                          db.collection("productinfo").doc(prod.id).update({
                            featured: true,
                          });
                        } else {
                          db.collection("productinfo").doc(prod.id).update({
                            featured: false,
                          });
                        }
                      }}
                    >
                      {prod.featured ? "Unfeature" : "Feature"}
                    </Button>
                  </div>
                ))}
            </div>
            <div className="prodColumn">
              {products
                .filter((val) => {
                  if (searchcontent === "") {
                    if (catvalue === "") {
                      return val;
                    } else if (
                      val.prodcategory.toLowerCase() === catvalue.toLowerCase()
                    ) {
                      if (searchcontent === "") {
                        return val;
                      } else if (
                        val.prodtitle
                          .toLowerCase()
                          .includes(searchcontent.toLowerCase()) ||
                        val.Alltags.some((tag) => {
                          return tag
                            .toLowerCase()
                            .includes(searchcontent.toLowerCase());
                        }) ||
                        val.Allsizes.some((size) => {
                          return size.value
                            .toLowerCase()
                            .includes(searchcontent.toLowerCase());
                        }) ||
                        val.Allvariations.some((vars) => {
                          return vars
                            .toLowerCase()
                            .includes(searchcontent.toLowerCase());
                        }) ||
                        val.Allprices.some((pr) => {
                          return pr.value
                            .toLowerCase()
                            .includes(searchcontent.toLowerCase());
                        }) ||
                        val.prodcategory
                          .toLowerCase()
                          .includes(searchcontent.toLowerCase())
                      ) {
                        return val;
                      }
                    }
                  } else {
                    if (catvalue === "") {
                      if (
                        val.prodtitle
                          .toLowerCase()
                          .includes(searchcontent.toLowerCase()) ||
                        val.Alltags.some((tag) => {
                          return tag
                            .toLowerCase()
                            .includes(searchcontent.toLowerCase());
                        }) ||
                        val.Allsizes.some((size) => {
                          return size.value
                            .toLowerCase()
                            .includes(searchcontent.toLowerCase());
                        }) ||
                        val.Allvariations.some((vars) => {
                          return vars
                            .toLowerCase()
                            .includes(searchcontent.toLowerCase());
                        }) ||
                        val.Allprices.some((pr) => {
                          return pr.value
                            .toLowerCase()
                            .includes(searchcontent.toLowerCase());
                        }) ||
                        val.prodcategory
                          .toLowerCase()
                          .includes(searchcontent.toLowerCase())
                      ) {
                        return val;
                      }
                    } else {
                      if (
                        val.prodcategory.toLowerCase() ===
                        catvalue.toLowerCase()
                      ) {
                        if (
                          val.prodtitle
                            .toLowerCase()
                            .includes(searchcontent.toLowerCase()) ||
                          val.Alltags.some((tag) => {
                            return tag
                              .toLowerCase()
                              .includes(searchcontent.toLowerCase());
                          }) ||
                          val.Allsizes.some((size) => {
                            return size.value
                              .toLowerCase()
                              .includes(searchcontent.toLowerCase());
                          }) ||
                          val.Allvariations.some((vars) => {
                            return vars
                              .toLowerCase()
                              .includes(searchcontent.toLowerCase());
                          }) ||
                          val.Allprices.some((pr) => {
                            return pr.value
                              .toLowerCase()
                              .includes(searchcontent.toLowerCase());
                          }) ||
                          val.prodcategory
                            .toLowerCase()
                            .includes(searchcontent.toLowerCase())
                        ) {
                          return val;
                        }
                      }
                    } 
                  }
                })
                .map((prod) => (
                  <div className="columnCont5">
                    <IconButton
                      aria-label="search"
                      color="inherit"
                      className="deleteUserBtn"
                      onClick={() => {
                        setConfirmMsg(
                          "Are you sure you want to delete this product?"
                        );
                        setConfirm(true);
                        setProdidGet(prod.id);
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
  );
}

export default Product;
