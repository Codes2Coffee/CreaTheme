import React, { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Signup from "./pages/Signup/Signup";
import Signin from "./pages/Signin/Signin";
import Profile from "./pages/Profile/Profile";
import Settings from "./pages/Settings/Settings";
import loading from "./components/loading/loading";
import Listing from "./pages/Listing/Listing";
import { useDispatch } from "react-redux";
import { auth } from "./firebase/config";
import { setUser, setUserStatus } from "./store/user";
import useUser from "./hooks/useUser";
import Admin from "./pages/Adminpage/Admin";
import Adminhome from "./pages/Adminhome/Adminhome";
import Adminlogin from "./pages/AdminLogin/Adminlogin";
import Adminsignup from "./pages/AdminSignup/Adminsignup";
import Shop from "./pages/Shop/Shop";
import Cart from "./pages/Cart/Cart";
import Message from "./pages/Message/Message";
import Admininformation from "./pages/Admininformation/Admininformation";

function App() {
  // const User = useSelector((state) => state.user);

  const dispatch = useDispatch();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (!user) return dispatch(setUser(null));

      dispatch(setUserStatus("loading"));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useUser();

  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/signin" component={Signin} />
        <Route exact path="/settings" component={Settings} />
        <Route exact path="/loading" component={loading} />
        <Route exact path="/listing" component={Listing} />
        <Route path="/profile" component={Profile} />
        <Route path="/admin" component={Admin} />
        <Route path="/adminhome" component={Adminhome} />
        <Route path="/adminlogin" component={Adminlogin} />
        <Route path="/adminsignup" component={Adminsignup} />
        <Route path="/shop" component={Shop} />
        <Route path="/cart" component={Cart} />
        <Route path="/messages" component={Message} />
        <Route path="/admininfo" component={Admininformation} />
      </Switch>
    </Router>
  );
}

export default App;
