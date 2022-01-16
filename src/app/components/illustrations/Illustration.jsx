import React, { useState, useEffect } from "react";
import "./Illustration.scss";
import { firestore } from "../../firebase/config";

function Illustration() {
  const [frontimage, setFrontimage] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const db = firestore;
      const data = await db.collection("fimage").get();
      setFrontimage(data.docs.map((doc) => doc.data()));
    };
    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      const db = firestore;
      db.collection("fimage").onSnapshot((snapshot) => {
        const newImage = snapshot.docs.map((doc) => doc.data());
        setFrontimage(newImage);
      });
    };
    fetchData();
  }, []);
  return (
    <div>
      <div className="svgCont">
        {frontimage.map((front) => (
          <img src={front.imgURL} alt="fi" />
        ))}
      </div>
    </div>
  );
}

export default Illustration;
