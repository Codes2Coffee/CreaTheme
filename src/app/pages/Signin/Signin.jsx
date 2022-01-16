import React, { useState, useEffect } from "react";
import "./Signin.scss";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Link, Redirect, useHistory } from "react-router-dom";
import * as yup from "yup";
import { BsEyeSlashFill, BsEyeFill } from "react-icons/bs";
import { auth, firestore } from "../../firebase/config";
import Nav from "../../components/nav/Nav";
import Button from "@material-ui/core/Button";
import Error from "../../components/PopupMessages/Errormessage";

let schema = yup.object().shape({
  email: yup.string().max(30).min(6).required(),
  password: yup.string().required().min(6).max(30),
});

function Signin() {
  const [showpass, setShowPass] = useState(false);
  const history = useHistory();
  const [color, setColor] = useState([]);
  const [error, setError] = useState("");
  const [errorPrimary, setErrorPrimary] = useState("");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const db = firestore;
      const data = await db.collection("webinfo").get();
      setColor(data.docs.map((doc) => doc.data()));
    };
    fetchData();
  }, []);

  const [usercheck, setUsercheck] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const db = firestore;
      db.collection("users").onSnapshot((snapshot) => {
        const newUser = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setUsercheck(newUser);
      });
    };
    fetchData();
  }, []);
  const [shownotif, setShownotif] = useState(false);

  let title;
  color.map((val) => (title = val.title));

  if (auth.currentUser) return <Redirect to="/" />;
  return (
    <div>
      <Nav shownotif={setShownotif} setShownotif={setShownotif} />
      <div
        className={failed ? "faliedContSi faliedContSiShow" : "faliedContSi"}
      >
        <Error
          error={error}
          errorPrimary={errorPrimary}
          failed={failed}
          setFailed={setFailed}
        />
      </div>

      <div
        className="si_header"
        style={failed ? { pointerEvents: "none" } : { pointerEvents: "auto" }}
        onClick={() => {
          setShownotif(false);
        }}
      >
        <div
          className="si_container"
          style={failed ? { pointerEvents: "none" } : { pointerEvents: "auto" }}
          onClick={() => {
            setShownotif(false);
          }}
        >
          <div className="si_title">
            <h2>SIGN IN</h2>
          </div>

          <div className="si_ob">
            <p>Sign in with your e-mail address and password below.</p>

            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={schema}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                setSubmitting(true);
                const { email, password } = values;
                let stats;

                if (
                  usercheck
                    .filter((val) => {
                      return val.email === email;
                    })
                    .some((val) => {
                      return val.access === "allowed";
                    }) === true
                ) {
                  auth
                    .signInWithEmailAndPassword(email, password)
                    .then(() => {
                      alert("Welcome to " + title + " !");
                      history.push("/");
                    })
                    .catch((err) => {
                      switch (err.code) {
                        case "auth/invalid-email":
                        case "auth/user-disabled":
                        case "auth/user-not-found":
                          // alert(err.message);
                          setError(err.message);
                          setErrorPrimary("Login failed");
                          setFailed(true);
                          break;
                        case "auth/wrong-password":
                          // alert(err.message);
                          setError(err.message);
                          setErrorPrimary("Login failed");
                          setFailed(true);
                          break;
                        default:
                          // alert(err.message);
                          setError(err.message);
                          setErrorPrimary("Login failed");
                          setFailed(true);
                      }
                    });
                  setSubmitting(false);
                } else {
                  // alert("Account not found please signup!");
                  setError("Account disabled.");
                  setErrorPrimary("Login failed");
                  setFailed(true);
                  setSubmitting(false);
                }
              }}
            >
              {({ isSubmitting }) => (
                <Form>
                  <Field
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    className="si_formField"
                  />
                  <div className="si_formErr">
                    <ErrorMessage name="email" component="div" />
                  </div>
                  <div className="si_passCon">
                    <Field
                      placeholder="Password"
                      type={showpass ? "text" : "password"}
                      name="password"
                      className="si_passField si_formField"
                    />
                    <div className="si_formErr">
                      <ErrorMessage name="password" component="div" />
                    </div>
                    <span
                      className="si_showPass"
                      onClick={() => setShowPass(!showpass)}
                    >
                      {showpass ? <BsEyeFill /> : <BsEyeSlashFill />}
                    </span>
                  </div>

                  {color.map((col) => (
                    <div className="s-s">
                      <Button
                        variant="contained"
                        color="primary"
                        className="si_signinBtn"
                        type="submit"
                        disabled={isSubmitting}
                        style={{ backgroundColor: col.color }}
                      >
                        SIGN IN
                      </Button>
                      <Link
                        className="si_createBtn"
                        to="/Signup"
                        // style={{ backgroundColor: col.color }}
                      >
                        Signup
                      </Link>
                    </div>
                  ))}

                  {/* {color.map((col) => (
                    <Link
                      className="fpwordBtn"
                      to=""
                      style={{ backgroundColor: col.color }}
                    >
                      FORGOT PASSWORD?
                    </Link>
                  ))} */}
                </Form>
              )}
            </Formik>

            {/* <input id="user" type="text" placeholder="Enter Username" />

            <input id="pass" type="text" placeholder="Enter Password" />

            <div className="s-s">
              <input id="signinBtn" type="submit" value="SIGN IN" />
              <Link className="createBtn" to="/signup">
                CREATE ACCOUNT
              </Link>
            </div>

            <input id="fpwordBtn" type="submit" value="FORGOT PASSWORD?" /> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signin;
