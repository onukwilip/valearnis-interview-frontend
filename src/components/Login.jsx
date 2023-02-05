import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Icon, Message } from "semantic-ui-react";
import useAjaxHook from "use-ajax-request";
import { useInput, useForm } from "use-manage-form";
import css from "../styles/login/Login.module.scss";

const Login = ({ setWidget }) => {
  const navigate = useNavigate();
  const {
    value: email,
    isValid: emailIsValid,
    inputIsInValid: emailInputIsInValid,
    onChange: onEmailChange,
    onBlur: onEmailBlur,
    reset: resetEmail,
  } = useInput(
    (/**@type String */ value) => value?.trim() !== "" && value?.includes("@")
  );

  const {
    value: password,
    isValid: passwordIsValid,
    inputIsInValid: passwordInputIsInValid,
    onChange: onPasswordChange,
    onBlur: onPasswordBlur,
    reset: resetPassword,
  } = useInput(
    (/**@type String */ value) => value?.trim() !== "" && value?.length >= 8
  );

  const { executeBlurHandlers, formIsValid, reset } = useForm({
    blurHandlers: [onEmailBlur, onPasswordBlur],
    resetHandlers: [resetEmail, resetPassword],
    validateOptions: () => emailIsValid && passwordIsValid,
  });

  const toogle = () => {
    setWidget("signup");
  };

  const {
    sendRequest: login,
    loading: loggingIn,
    error: loginError,
  } = useAjaxHook({
    instance: axios,
    options: {
      url: `${process.env.REACT_APP_API_DOMAIN}/api/login`,
      method: "POST",
      data: {
        email,
        password,
      },
    },
  });

  const onLoginSuccess = (res) => {
    reset();
    localStorage.setItem("user", JSON.stringify(res.data));
    navigate("/quiz", { replace: true });
  };

  const onSubmit = async () => {
    if (!formIsValid) return executeBlurHandlers();

    console.log("SUBMITTED", { email, password });
    login(onLoginSuccess);
  };

  return (
    <div className={css.login}>
      <p>
        Resume your journey, <em>Login!</em>
      </p>
      <Form className={css.form} onSubmit={onSubmit}>
        <Form.Input
          placeholder="Email address"
          icon="mail"
          iconPosition="left"
          className={css.input}
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          onBlur={onEmailBlur}
          error={
            emailInputIsInValid && {
              content: "Input must be a valid email address",
              pointing: "above",
            }
          }
        />
        <Form.Input
          placeholder="Password"
          icon="key"
          iconPosition="left"
          className={css.input}
          type="password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          onBlur={onPasswordBlur}
          error={
            passwordInputIsInValid && {
              content: "Input must be a greater than 8 characters",
              pointing: "above",
            }
          }
        />
        <div className={css.actions}>
          <Button animated="fade" disabled={loggingIn}>
            <Button.Content visible>
              {loggingIn ? "Loading..." : "Login"}
            </Button.Content>
            <Button.Content hidden>
              <Icon name="arrow right" />
            </Button.Content>
          </Button>
        </div>
      </Form>

      {loginError && (
        <Message negative className={"error-warning"}>
          <Message.Header>{loginError?.response?.data?.message}</Message.Header>
        </Message>
      )}

      <div className={css.info}>
        Don't have an account?{" "}
        <a href="#" onClick={toogle}>
          Register!
        </a>
      </div>
    </div>
  );
};

export default Login;
