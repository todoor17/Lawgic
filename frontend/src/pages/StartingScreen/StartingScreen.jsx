import { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./startingScreen.module.css";
import logo from "../../images/lawgicLogoWhite.png";
import Button from "../../components/button/Button.jsx";

export default function StartingScreen({ type }) {
  const [loadingWidth, setLoadingWidth] = useState(0);

  const navigate = useNavigate();
  function redirect(route) {
    navigate(route);
  }

  const location = useLocation();
  const username = location?.state;

  useEffect(() => {
    if (type === "loading") {
      const interval = setInterval(() => {
        setLoadingWidth((prevWidth) => {
          if (prevWidth >= 100) {
            clearInterval(interval);
            navigate("/logged", { state: username });
            return 100;
          }
          return prevWidth + 1;
        });
      }, 30);
      return () => clearInterval(interval);
    }
  }, [type]);

  useEffect(() => {
    if (loadingWidth === 100) {
      navigate("/logged", { state: username });
    }
  }, [loadingWidth, navigate]);

  return (
    <div className={styles.container}>
      <img src={logo} className={styles.image}></img>{" "}
      {type === "starting" ? (
        <div className={styles.buttonsContainer}>
          <Button tag="Login" onClick={() => redirect("/login")} />
          <Button tag="Sign in" onClick={() => redirect("/signin")} />
          <Button tag="" icon="google" />
        </div>
      ) : (
        <div className={styles.loadingBarContainer}>
          <div
            className={styles.loadingBar}
            style={{ width: `${loadingWidth}%` }}
          ></div>
        </div>
      )}
    </div>
  );
}
