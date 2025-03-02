import styles from "./login.module.css";
import buttonStyles from "../StartingScreen/startingScreen.module.css";
import lawgicLogo from "../../images/lawgicIconWhite.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Input from "../../components/input/Input.jsx";
import Button from "../../components/button/Button.jsx";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const login = async () => {
    if (username === "" || password === "") {
      alert("Some fields are empty!");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:5000/login?username=${username}&password=${password}`
      );
      const data = await response.json();
      if (data.status === "success") {
        navigate("/loading", { state: username });
      } else {
        setUsername("");
        setPassword("");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.verticalContainer}>
        <img src={lawgicLogo} className={styles.logo}></img>
      </div>
      <div className={styles.verticalContainer}>
        <div className={styles.formContainer}>
          <Input
            tag="Username"
            type="text"
            input={username}
            setInput={(e) => {
              setUsername(e.target.value);
            }}
          />
          <Input
            tag="Password"
            type="password"
            input={password}
            setInput={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className={buttonStyles.buttonsContainer}>
          <Button tag="Login" onClick={login} />
          <Button tag="Sign in" onClick={() => navigate("/signin")} />
        </div>
      </div>
      <div className={styles.verticalContainer}>
        <img src={lawgicLogo} className={styles.logo}></img>
      </div>
    </div>
  );
}
