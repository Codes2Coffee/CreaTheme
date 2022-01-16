import React, { useState, useEffect } from "react";
import "./Signup.scss";
import { Link, Redirect, useHistory } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { BsEyeSlashFill, BsEyeFill } from "react-icons/bs";
import { auth } from "../../firebase/config";
import Nav from "../../components/nav/Nav";
import { firestore } from "../../firebase/config";
import Button from "@material-ui/core/Button";
import Error from "../../components/PopupMessages/Errormessage";

let schema = yup.object().shape({
  // username: yup.string().max(30).min(6).required(),
  email: yup.string().email().required(),
  password: yup.string().required().min(6).max(30),
});

function Signup() {
  const [showpass, setShowPass] = useState(false);
  const [popUP, setPopUP] = useState(false);
  const history = useHistory();
  const [color, setColor] = useState([]);

  const [failed, setFailed] = useState(false);
  const [error, setError] = useState("");
  const [errorPrimary, setErrorPrimary] = useState("");

  const [shownotif, setShownotif] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const db = firestore;
      const data = await db.collection("webinfo").get();
      setColor(data.docs.map((doc) => doc.data()));
    };
    fetchData();
  }, []);

  if (auth.currentUser) return <Redirect to="/" />;
  return (
    <div>
      <Nav shownotif={shownotif} setShownotif={setShownotif} />
      <div
        className={failed ? "faliedContSu faliedContSuShow" : "faliedContSu"}
      >
        <Error
          error={error}
          errorPrimary={errorPrimary}
          failed={failed}
          setFailed={setFailed}
        />
      </div>
      {popUP && (
        <div className="popup-signup">
          <div className="con">
            <h1>Signup Successful</h1>

            <button onClick={() => setPopUP(false)}>DONE</button>
          </div>
        </div>
      )}
      <div
        className="su_header"
        style={failed ? { pointerEvents: "none" } : { pointerEvents: "auto" }}
        onClick={() => {
          setShownotif(false);
        }}
      >
        <div className="containerup"></div>
      </div>

      <div
        className="su_bcontainer"
        style={failed ? { pointerEvents: "none" } : { pointerEvents: "auto" }}
        onClick={() => {
          setShownotif(false);
        }}
      >
        <div className="su_title">
          <h2>CREATE ACCOUNT</h2>
        </div>

        <div className="su_ob">
          <p className="su_p1">
            Creating an account lets you track your order history and store
            addresses for fast and easy checkouts.
          </p>

          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={schema}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              setSubmitting(true);
              const { email, password } = values;
              auth
                .createUserWithEmailAndPassword(email, password)
                .then(() => {
                  firestore.collection("statusheck").doc("check").set({
                    status: "new",
                  });
                })
                .then(() => {
                  alert("Welcome");
                  history.push("/settings");
                })
                .catch((err) => {
                  // alert(err.message);
                  setError(err.message);
                  setErrorPrimary("Signup failed");
                  setFailed(true);
                });
              setSubmitting(false);
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                {/* <Field
                  id="uname"
                  name="username"
                  type="text"
                  placeholder="Username"
                  className="su_formField"
                />
                <div className="su_formErr">
                  <ErrorMessage name="username" component="div" />
                </div> */}
                <Field
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  className="su_formField"
                />
                <div className="su_formErr">
                  <ErrorMessage name="email" component="div" />
                </div>
                <div className="su_passCon">
                  <Field
                    id="pass"
                    placeholder="Password"
                    type={showpass ? "text" : "password"}
                    name="password"
                    className="su_passField su_formField  "
                  />
                  <span
                    className="su_showPass"
                    onClick={() => setShowPass(!showpass)}
                  >
                    {showpass ? <BsEyeFill /> : <BsEyeSlashFill />}
                  </span>
                </div>

                <div className="su_formErr">
                  <ErrorMessage name="password" component="div" />
                </div>
                {color.map((col) => (
                  <Button
                    variant="contained"
                    color="primary"
                    className="su_createBtn"
                    type="submit"
                    disabled={isSubmitting}
                    style={{ backgroundColor: col.color }}
                  >
                    CREATE ACCOUNT
                  </Button>
                ))}
              </Form>
            )}
          </Formik>
          {color.map((col) => (
            <Link
              className="cancelBtn"
              to="/signin"
              // style={{ backgroundColor: col.color }}
            >
              Login
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Signup;
