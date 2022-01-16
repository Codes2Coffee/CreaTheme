import React, { useState, useEffect } from "react";
import IconButton from "@material-ui/core/IconButton";
import ArrowBackIosRoundedIcon from "@material-ui/icons/ArrowBackIosRounded";
import ArrowForwardIosRoundedIcon from "@material-ui/icons/ArrowForwardIosRounded";
import { firestore } from "../../firebase/config";
import "./Slideshow.scss";

const Slideshow = ({ height = "120px", width = "100%" }) => {
  const [products, setProducts] = useState([]);
  const [index, setIndex] = useState(0);
  const [left, setLeft] = useState(-1);
  const [right, setRight] = useState(-1);

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

  useEffect(() => {
    const interval = setInterval(() => {
      next();
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const next = () => {
    let indx;
    setIndex((i) => {
      indx = i;
      return i;
    });
    if (indx < products.length - 1) {
      setRight(indx === products.length - 2 ? 0 : -1);
    } else {
      setRight(-1);
      setLeft(indx);
      setIndex(0);
    }
  };
  const prev = () => {
    if (index > 0) {
      setLeft(index - 1 === 0 ? products.length - 1 : -1);
      setRight(index);
      setIndex(index - 1);
    } else {
      setRight(index);
      setLeft(-1);
      setIndex(products.length - 1);
    }
  };

  const slideTo = (i) => () => {
    if (i < index) {
      setRight(index);
      setLeft(i === 0 ? products.length - 1 : -1);
    } else {
      setLeft(index);
      setRight(i === products.length - 1 ? 0 : -1);
    }
    setIndex(i);
  };

  return (
    <div>
      {products.map((data) => (
        <div
          className="slideShow"
          //   style={{ height, minWidth: width, maxWidth: width, width }}
        >
          <ul>
            {data.allImages.map((d, i) =>
              i === index ? (
                <li
                  className="selected"
                  style={{ backgroundImage: `URL(${d})` }}
                />
              ) : left === i ? (
                <li
                  className="left"
                  style={{
                    backgroundImage: `URL(${d})`,
                    zIndex: index === 1 - 1 ? 2 : 3,
                  }}
                />
              ) : right === i ? (
                <li
                  className="right"
                  style={{ backgroundImage: `URL(${d})` }}
                />
              ) : i < index ? (
                <li
                  className="left-align"
                  style={{ backgroundImage: `URL(${d})` }}
                />
              ) : (
                <li
                  className="right-align"
                  style={{ backgroundImage: `URL(${d})` }}
                />
              )
            )}
          </ul>
          <IconButton
            aria-label="search"
            color="inherit"
            className="prev-btn s-btn"
            onClick={prev}
          >
            <ArrowBackIosRoundedIcon />
          </IconButton>
          <IconButton
            aria-label="search"
            color="inherit"
            className="prev-btn s-btn"
            onClick={next}
          >
            <ArrowForwardIosRoundedIcon />
          </IconButton>
          <div className="stepper">
            {data.allImages.map((s, i) =>
              i === index ? (
                <span
                  key={s}
                  className="selected-index bullet"
                  onClick={slideTo(i)}
                />
              ) : (
                <span key={s} className=" bullet" onClick={slideTo(i)} />
              )
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Slideshow;
