import styles from "./button.module.css";
import googleIcon from "../../images/googleIcon.png";
import homeIcon from "../../images/homeIcon.png";

export default function Button({ tag, icon, onClick }) {
  return (
    <button className={styles.button74} onClick={onClick}>
      {tag ? (
        tag
      ) : icon === "google" ? (
        <img className={styles.icon} src={googleIcon}></img>
      ) : (
        <img className={styles.icon} src={homeIcon}></img>
      )}
    </button>
  );
}
