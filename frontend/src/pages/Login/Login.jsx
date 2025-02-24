import styles from "./login.module.css";
import buttonStyles from "../StartingScreen/startingScreen.module.css";
import logo from "../../images/lawgicIconWhite.png";
import Input from "../../components/input/Input.jsx";
import Button from "../../components/button/Button.jsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function redirect(e) {
    navigate(e);
  }

  function login() {
    if (username === "" || password === "") {
      alert("Some fields are empty");
      return -1;
    } else {
      navigate("/loading");
    }
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.verticalContainer}>
        <img src={logo} className={styles.logo}></img>
      </div>
      <div className={styles.verticalContainer}>
        <div className={styles.formContainer}>
          <Input
            tag="Username"
            type="text"
            input={username}
            setInput={setUsername}
          />
          <Input
            tag="Password"
            type="password"
            input={password}
            setInput={setPassword}
          />
        </div>
        <div className={buttonStyles.buttonsContainer}>
          <Button tag="Login" onClick={() => login()} />
          <Button tag="Sign in" onClick={() => redirect("/signin")} />
        </div>
      </div>
      <div className={styles.verticalContainer}>
        <img src={logo} className={styles.logo}></img>
      </div>
    </div>
  );
}
