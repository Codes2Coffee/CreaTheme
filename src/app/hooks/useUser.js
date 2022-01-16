import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { auth, firestore } from "../firebase/config";
import { setUser, setUserStatus } from "../store/user";

const useUser = () => {
  const { status } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  console.log("useUser");
  useEffect(() => {
    if (status === "noUser") return console.log("noUser--");
    const uid = auth.currentUser.uid;
    const unsub = firestore
      .collection("users")
      .doc(uid)
      .onSnapshot(
        (doc) => {
          console.log(uid);
          if (!doc.exists) return console.log("no user"); //
          dispatch(setUser(doc.data()));
          console.log(doc.data());
        },
        (err) => {
          console.log(err);
          if (status !== "logged") dispatch(setUserStatus("error"));
        }
      );
    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useUser;
