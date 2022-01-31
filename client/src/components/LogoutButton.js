import { Button } from "@progress/kendo-react-buttons";
import { useDispatch } from "react-redux";
import { localstorage } from "../utils";
import { authActions, dataActions } from "../store/actions";
import socket from "../services/socket";

// Component based on the auth status, which on click empties user info from state and local storage, also sends an auth change event to the server to stop existing
// cron jobs based on previous user logged in info

const LogoutButton = () => {
  const dispatch = useDispatch();
  const handleLogout = () => {
    localstorage.removeItem("authData");
    dispatch(authActions.logOut());
    dispatch(dataActions.removeData());
    socket.emit("auth-change");
  };

  return (
    <Button onClick={handleLogout} style={{ float: "right" }}>
      Logout
    </Button>
  );
};

export default LogoutButton;
