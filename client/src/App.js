import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { localstorage } from "./utils";
import { authActions } from "./store/actions";

import { Leaderboard } from "./components/Leaderboard";
import Login from "./components/Login";
import LogoutButton from "./components/LogoutButton";
import SelfRank from "./components/SelfRank";
import Profile from "./components/Profile";
import socket from "./services/socket";

// Checks if a user has token data in local storage, then changes auth state and sends an auth-change event to the server to stop any non-user based cron stream
// Based on the existance of self rank data and profile data, conditional renderings happen

function App() {
  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state.authReducer.authStatus);
  const selfRankData = useSelector((state) => state.dataReducer.selfRankData);
  const profileData = useSelector((state) => state.dataReducer.profileData);

  useEffect(() => {
    const authData = localstorage.getItem("authData")
      ? localstorage.getItem("authData")
      : null;
    const token = authData || authStatus ? authData.token : null;
    if (token) {
      dispatch(authActions.endLogin({ status: true, token: token }));
      socket.emit("auth-change");
    }
  }, []);

  return (
    <div className="App">
      {authStatus && <LogoutButton />}
      <Leaderboard authStatus={authStatus} />
      {!authStatus && <Login />}
      {selfRankData && authStatus && <SelfRank data={selfRankData} />}
      {profileData && authStatus && <Profile data={profileData} />}
    </div>
  );
}

export default App;
