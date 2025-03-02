import styles from "./logged.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import lawgicIcon from "../../images/lawgicPngWhite.png";
import logoutIcon from "../../images/logoutIcon.png";
import Hello from "../../components/hello/Hello.jsx";
import Response from "../../components/response/Response.jsx";
import MainInput from "../../components/mainInput/MainInput.jsx";
import RoundButton from "../../components/roundButton/RoundButton.jsx";

export default function Logged() {
  const [response, setResponse] = useState("");
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [responses, setResponses] = useState([]);

  const navigate = useNavigate();
  const rightContainer = useRef(null);

  const location = useLocation();
  const username = location?.state;

  return (
    <div
      className={styles.pageContainer}
      style={responses.length ? { alignItems: "start" } : {}}
    >
      <div className={styles.left}>
        <img src={lawgicIcon} className={styles.logo} />
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
        <div className={styles.roundButtonContainer}>
          <RoundButton src={logoutIcon} onClick={() => navigate("/")} />
        </div>
      </div>
    </div>
  );
}
