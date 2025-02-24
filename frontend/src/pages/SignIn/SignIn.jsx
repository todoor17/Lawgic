import styles from "../Login/login.module.css";
import buttonStyles from "../StartingScreen/startingScreen.module.css";
import { useNavigate } from "react-router-dom";
import logo from "../../images/lawgicIconWhite.png";
import Input from "../../components/input/Input.jsx";
import Button from "../../components/button/Button.jsx";

export default function SignIn() {
  const navigate = useNavigate();
  function redirect(path) {
    navigate(path);
  }
  return (
    <div className={styles.pageContainer}>
      <div className={styles.verticalContainer}>
        <img src={logo} className={styles.logo}></img>
      </div>
      <div className={styles.verticalContainer}>
        <div className={styles.formContainer}>
          <Input tag="First Name" type="text" />
          <Input tag="Last Name" type="text" />
          <Input tag="Email" type="text" />
          <Input tag="Password" type="text" />
          <Input tag="Repeat Passowrd" type="text" />
          <Input tag="Birthdate" type="date" />
        </div>
        <div className={buttonStyles.buttonsContainer}>
          <Button tag="Sign in" onClick={() => redirect("/login")}></Button>
          <Button tag="" icon="home" onClick={() => redirect("/")}></Button>
        </div>
      </div>
      <div className={styles.verticalContainer}>
        <img src={logo} className={styles.logo}></img>
      </div>
    </div>
  );
}
