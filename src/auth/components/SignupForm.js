import React, { useState, Fragment } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import {
  createWallet,
  retrieveNonce,
  signMessage,
  retrieveJwt,
  createSecret
} from "../helpers/";
import { useAuthState, useAuthDispatch } from "../auth-context";
import { useUserDispatch } from "../../user/user-context";
import { API_ROOT } from "../../app/helpers";

export default function SignupForm() {
  const authDispatch = useAuthDispatch();
  const { isAuthenticating } = useAuthState();
  const userDispatch = useUserDispatch();
  const [email, setEmail] = useState("bobthecryptonoob@gmail.com");
  const [password, setPassword] = useState("Zn48&NJFLPjr");
  const [understandMessage, setUnderstandMessage] = useState(true);
  const [retypedPassword, setRetypedPassword] = useState("Zn48&NJFLPjr");

  const [showInvalidPasswordError, setShowInvalidPasswordError] = useState(
    false
  );
  const [showUnmatchedPasswordError, setShowUnmatchedPasswordError] = useState(
    false
  );
  const [isError, setIsError] = useState(false);

  // TODO - error handling in the UI
  const emailSecret = async secret => {
    try {
      const result = await axios.post(
        `${API_ROOT}/emailSecrets`,
        JSON.stringify({ to: email, payload: secret })
      );
      if (result) {
        return true;
      }
    } catch (error) {
      setIsError(true);
      return false;
    }
  };

  const handleFormValidation = () => {
    // will return true if string contains at least 1 number
    function hasNumber(string) {
      var regex = /\d/g;
      return regex.test(string);
    }
    // check if user enters a password that is at least 8 chracters long and contains one number
    if (password.length < 8 || !hasNumber(password)) {
      setShowInvalidPasswordError(true);
      return false;
    }
    // check that password and retyped password have same value
    if (password !== retypedPassword) {
      setShowUnmatchedPasswordError(true);
      return false;
    }
    // two checks have passed
    return true;
  };

  const handleSignup = async () => {
    const inputsAreValid = handleFormValidation();

    if (inputsAreValid) {
      setIsError(false);
      authDispatch({ type: "AUTHENTICATING", payload: true });

      const wallet = createWallet();

      const nonce = await retrieveNonce(wallet.signingKey.address);

      const signedMessage = signMessage({ nonce, wallet });

      const jwt = await retrieveJwt({
        address: wallet.signingKey.address,
        signedMessage: signedMessage
      });

      const secret = createSecret(wallet.signingKey.privateKey, password);
      // email secret to the user
      const emailSecretSuccess = await emailSecret(secret);
      // only log user in if email of secret is a success
      if (emailSecretSuccess) {
        try {
          const result = await axios.post(
            `${API_ROOT}/profile`,
            JSON.stringify({
              jwt: jwt,
              address: wallet.signingKey.address
            })
          );
          authDispatch({ type: "SET_JWT", payload: jwt });
          authDispatch({
            type: "SET_USER_ADDRESS",
            payload: wallet.signingKey.address
          });
          authDispatch({ type: "SET_AUTH_TYPE", payload: "email" });
          userDispatch({ type: "SET_USER_DATA", payload: result.data });
          // add jwt and address to local storage
          localStorage.setItem("trusat-jwt", jwt);
        } catch (error) {
          setIsError(true);
        }
      }
      authDispatch({ type: "AUTHENTICATING", payload: false });
    } else {
      setShowInvalidPasswordError(true);
    }
  };

  return (
    <Fragment>
      <form
        className="email-form"
        name="auth-form"
        onSubmit={event => {
          event.preventDefault();
          handleSignup();
        }}
      >
        <label className="email-form__label">Email</label>
        <input
          required
          className="email-form__input"
          type="email"
          onChange={event => setEmail(event.target.value)}
          value={email}
        />

        <label className="email-form__label">Password</label>
        <input
          required
          className="email-form__input"
          type="password"
          onChange={event => setPassword(event.target.value)}
          value={password}
        />
        {showInvalidPasswordError ? (
          <div className="email-form__error">
            Please choose a password that is at least 8 characters long and
            contains one number
          </div>
        ) : null}

        <div className="email-form__checkbox-and-message-wrapper">
          <input
            required
            type="checkbox"
            checked={understandMessage}
            onChange={() => setUnderstandMessage(!understandMessage)}
          ></input>
          <p>
            I understand I cannot change this password in the future, and that
            TruSat cannot restore this password for me. I've saved it somewhere
            safe.
          </p>
        </div>

        <label className="email-form__label">Retype password to confirm</label>
        <input
          required
          className="email-form__input"
          type="password"
          onChange={event => setRetypedPassword(event.target.value)}
          value={retypedPassword}
        />
        {showUnmatchedPasswordError ? (
          <div className="email-form__error">
            The passwords you have entered do not match
          </div>
        ) : null}

        <div className="email-form__button-wrapper">
          <NavLink className="app__nav-link" to="/">
            <span className="email-form__button--black">Cancel</span>
          </NavLink>

          <button type="submit" className="email-form__button--white">
            {isAuthenticating ? `...Loading` : `Sign Up`}
          </button>
        </div>

        <div className="email-form__link-to-login-wrapper">
          <p>Already a member?</p>
          <NavLink className="app__nav-link" to="/login">
            <p className="email-form__log-in-text">Log in</p>
          </NavLink>
        </div>
      </form>
      {isError ? (
        <p className="app__error-message">Something went wrong ...</p>
      ) : null}
    </Fragment>
  );
}
