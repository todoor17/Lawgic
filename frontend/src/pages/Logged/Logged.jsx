import { useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import styles from "./logged.module.css";
import icon from "../../images/lawgicPngWhite.png";
import Hello from "../../components/hello/Hello.jsx";
import Response from "../../components/response/Response.jsx";
import MainInput from "../../components/mainInput/MainInput.jsx";

export default function Logged() {
  const [response, setResponse] = useState("");
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();
  const username = location?.state;

  return (
    <div className={styles.pageContainer}>
      <div className={styles.left}>
        <img src={icon} className={styles.logo} />
      </div>
      <div className={styles.right}>
        {!response && !isLoading && <Hello name={username} />}
        <MainInput
          response={response}
          setResponse={setResponse}
          prompt={prompt}
          setPrompt={setPrompt}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
        {isLoading ? (
          <div className={styles.dotsContainer}>
            <div className={styles.dot} id={styles.dot1}></div>
            <div className={styles.dot} id={styles.dot2}></div>
            <div className={styles.dot} id={styles.dot3}></div>
          </div>
        ) : response ? (
          <Response response={response} />
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
