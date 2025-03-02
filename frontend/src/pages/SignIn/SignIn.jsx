import styles from "../Login/login.module.css";
import buttonStyles from "../StartingScreen/startingScreen.module.css";
import { useNavigate } from "react-router-dom";
import logo from "../../images/lawgicIconWhite.png";
import Input from "../../components/input/Input.jsx";
import Button from "../../components/button/Button.jsx";
import { useEffect, useState } from "react";

export default function SignIn() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    repeatedPassword: "",
  });

  useEffect(() => {
    console.log(userInfo);
  }, [userInfo]);

  function redirect(path) {
    navigate(path);
  }

  const signIn = async () => {
    const allFieldsAssigned = Object.values(userInfo).every(
      (attribute) => attribute != ""
    );
    if (!allFieldsAssigned) {
      alert("One or more fields are empty!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userInfo),
      });
      const data = await response.json();
      console.log(data.status);
      if (data.status === "error") {
        alert("An account with these credentials already exist.");
        return;
      } else {
        alert("Account created succesfully!");
        setTimeout(() => {
          console.log("here");
          navigate("/login");
        }, 1500);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.verticalContainer}>
        <img src={logo} className={styles.logo}></img>
      </div>
      <div className={styles.verticalContainer}>
        <div className={styles.formContainer}>
          <Input
            tag="First Name"
            type="text"
            input={userInfo.firstName}
            setInput={(e) => {
              setUserInfo({ ...userInfo, firstName: e.target.value });
            }}
          />
          <Input
            tag="Last Name"
            type="text"
            input={userInfo.lastName}
            setInput={(e) => {
              setUserInfo({ ...userInfo, lastName: e.target.value });
            }}
          />
          <Input
            tag="Username"
            type="text"
            input={userInfo.username}
            setInput={(e) => {
              setUserInfo({ ...userInfo, username: e.target.value });
            }}
          />
          <Input
            tag="Email"
            type="text"
            input={userInfo.email}
            setInput={(e) => {
              setUserInfo({ ...userInfo, email: e.target.value });
            }}
          />
          <Input
            tag="Password"
            type="text"
            input={userInfo.password}
            setInput={(e) => {
              setUserInfo({ ...userInfo, password: e.target.value });
            }}
          />
          <Input
            tag="Repeat Passoword"
            type="text"
            input={userInfo.repeatedPassword}
            setInput={(e) => {
              setUserInfo({ ...userInfo, repeatedPassword: e.target.value });
            }}
          />
        </div>
        <div className={buttonStyles.buttonsContainer}>
          <Button tag="Sign in" onClick={signIn}></Button>
          <Button tag="" icon="home" onClick={() => redirect("/")}></Button>
        </div>
      </div>
      <div className={styles.verticalContainer}>
        <img src={logo} className={styles.logo}></img>
      </div>
    </div>
  );
}
