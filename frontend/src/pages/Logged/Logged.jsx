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

  const [responses, setResponses] = useState([]);

  const location = useLocation();
  const username = location?.state;

  const rightContainer = useRef(null);

  return (
    <div
      className={styles.pageContainer}
      style={responses.length ? { alignItems: "start" } : {}}
    >
      <div className={styles.left}>
        <img src={icon} className={styles.logo} />
      </div>
      <div
        ref={rightContainer}
        className={styles.right}
        style={
          responses.length
            ? {
                height: "78%",
                backgroundColor: "#1e1e1e",
                marginTop: "40px",
                borderRadius: "20px",
                justifyContent: "flex-start",
              }
            : {}
        }
      >
        {!response && !isLoading && <Hello name={username} />}
        <MainInput
          response={response}
          setResponse={setResponse}
          prompt={prompt}
          setPrompt={setPrompt}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          responses={responses}
          setResponses={setResponses}
          rightContainer={rightContainer}
        />
        {responses.map((response, index) => (
          <Response key={index} response={response} />
        ))}
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
