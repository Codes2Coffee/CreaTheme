import React from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import "./Adminsignup.scss";
import { useFormik } from "formik";
import * as yup from "yup";
import { auth, firestore } from "../../firebase/config";
import Loading from "../../components/loading/loading";
import * as admin from "firebase-admin";
import ArrowBackIosRoundedIcon from "@material-ui/icons/ArrowBackIosRounded";
import { IconButton } from "@material-ui/core";
import { useHistory } from "react-router-dom";

admin.initializeApp();

let validationSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required().min(6).max(30),
});

function Adminsignup() {
  const history = useHistory();
  //signup function
  const onSignup = async ({ email, password }, { setSubmitting }) => {
    // return console.log(email, password);
    setSubmitting(true);
    try {
      const { user } = await auth.createUserWithEmailAndPassword(
        email,
        password
      );
      await firestore.collection("adminuser").doc(user.uid).set({
        uid: user.uid,
        email,
      });
      admin.auth().setCustomUserClaims(user.uid, { role: "superadmin" });

      setSubmitting(false);

      // alert("signup successfully");
      console.log("ok");
    } catch (err) {
      console.log(err);
      setSubmitting(false);
    }
  };

  const { values, handleChange, handleSubmit, touched, errors, isSubmitting } =
    useFormik({
      initialValues: { email: "", password: "" },
      validationSchema,
      onSubmit: onSignup,
    });

  if (isSubmitting) return <Loading label="Loading" />;

  return (
    <div>
      <div className="aSignupCont">
        <div className="arrowBack">
          <IconButton
            aria-label="search"
            color="inherit"
            onClick={() => history.push("/adminhome")}
          >
            <ArrowBackIosRoundedIcon />
          </IconButton>
        </div>
        <div className="centerCont">
          <div className="ahomeRegisterTitle">
            <p>Register to CreaTheme</p>
          </div>
          <form onSubmit={handleSubmit}>
            <TextField
              className="aSignupEmail"
              id="outlined-basic"
              label="Email"
              variant="outlined"
              name="email"
              value={values.email}
              onChange={handleChange}
              error={touched.email && errors.email}
            />
            <TextField
              className="aSignupPassword"
              id="outlined-password-input"
              label="Password"
              type="password"
              autoComplete="current-password"
              variant="outlined"
              name="password"
              value={values.password}
              onChange={handleChange}
              error={touched.password && errors.password}
            />
            <div className="ahomeSignupBtnCont">
              <Button
                className="asignupSubmitBtn"
                variant="contained"
                color="primary"
                type="submit"
                disableTouchRipple={isSubmitting}
              >
                {isSubmitting ? "Creating your account" : "Signup"}
              </Button>
            </div>
          </form>
        </div>
        <div className="suCircle1"></div>
        <div className="suCircle2"></div>
      </div>
    </div>
  );
}

export default Adminsignup;
