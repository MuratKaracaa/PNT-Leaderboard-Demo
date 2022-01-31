import { Form, Field, FormElement } from "@progress/kendo-react-form";
import { useDispatch } from "react-redux";
import { authActions } from "../store/actions";
import { Input } from "@progress/kendo-react-inputs";
import "@progress/kendo-theme-default/dist/all.css";
import socket from "../services/socket";

// Component to be rendered based on auth status, which dispatches an action to the related endpoint on the server for basic token retrieval and sends an auth change event
// to the server to stop running cron jobs based on unlogged user info
// the cretendials object is provided thanks to the structure of the Kendo UI components, so there is no states defined

const Login = () => {
  const dispatch = useDispatch();
  const handleSubmit = (credentials) => {
    dispatch(authActions.startLogin(credentials));
    socket.emit("auth-change");
  };

  return (
    <Form
      onSubmit={handleSubmit}
      render={(formRenderProps) => (
        <FormElement
          style={{
            maxWidth: 650,
          }}
        >
          <fieldset className={"k-form-fieldset"}>
            <legend className={"k-form-legend"}>
              Please input your creadentials
              <p>You can use Mock User [0-5000] to login</p>
            </legend>
            <div className="mb-3">
              <Field name={"userName"} component={Input} label={"User Name"} />
            </div>
          </fieldset>
          <div className="k-form-buttons">
            <button
              type={"submit"}
              className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
              disabled={!formRenderProps.allowSubmit}
            >
              Submit
            </button>
          </div>
        </FormElement>
      )}
    />
  );
};

export default Login;
