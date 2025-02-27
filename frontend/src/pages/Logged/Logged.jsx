import { useState } from "react";
import { useLocation } from "react-router-dom";
import styles from "./logged.module.css";
import icon from "../../images/lawgicPngWhite.png";
import logo from "../../images/lawgicLogoPngBlack.png";
import Hello from "../../components/hello/Hello.jsx";

export default function Logged() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [re, setRe] = useState("");
  const [expandedSidebar, setExpandedSidebar] = useState(false);

  const location = useLocation();
  const username = location?.state;

  async function handlePrompt() {
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:5000/gptt?prompt=${prompt}`
      );
      const data = await response.json();
      // is there a way to signal the time we wait for the API?
      setRe(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.pageContainer}>
      <div
        className={`${styles.left} ${
          expandedSidebar ? styles.leftExpanded : ""
        }`}
      >
        <img
          src={expandedSidebar ? logo : icon}
          className={styles.logo}
          onClick={() => setExpandedSidebar(!expandedSidebar)}
        />
      </div>
      <div className={styles.right}>
        <Hello name={username} />
        <div className={styles.inputContainer}>
          <textarea
            className={styles.input}
            placeholder="Ask me"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          ></textarea>
          <div className={styles.buttonsContainer}>
            <button className={styles.button}>▶</button>
            <button className={styles.button} onClick={() => handlePrompt()}>
              ↑
            </button>
          </div>
        </div>
        <p className={styles.response}>{re}</p>
        {isLoading ? (
          <div className={styles.dotsContainer}>
            <div className={styles.dot} id={styles.dot1}></div>
            <div className={styles.dot} id={styles.dot2}></div>
            <div className={styles.dot} id={styles.dot3}></div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
