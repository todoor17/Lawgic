import styles from "./mainInput.module.css";
import playIcon from "../../images/playIcon.png";
import pauseIcon from "../../images/pauseIcon.png";
import micIcon from "../../images/micIcon.png";
import sendIcon from "../../images/sendIcon.png";
import { useRef, useEffect, useState } from "react";
import { saveAs } from "file-saver";
import RoundButton from "../roundButton/RoundButton.jsx";
import audioFile from "../../../../backend/input.mp3";

export default function MainInput({
  setResponse,
  prompt,
  setPrompt,
  isLoading,
  setIsLoading,
  responses,
  setResponses,
  rightContainer,
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  const textAreaRef = useRef(null);
  const inputContainerRef = useRef(null);
  const audioRef = useRef(null);

  const handleHeight = () => {
    if (textAreaRef.current && inputContainerRef.current) {
      textAreaRef.current.style.height = "auto";
      inputContainerRef.current.style.height = "auto";

      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
      inputContainerRef.current.style.height = `${textAreaRef.current.style.height}px`;
    }
  };

  // modfiy input height everytime the prompt updates
  useEffect(() => {
    handleHeight();
  }, [prompt]);

  // scroll to the bottom of responses for each new response
  useEffect(() => {
    if (rightContainer.current && responses.length > 0) {
      setTimeout(() => {
        rightContainer.current.scrollTop = rightContainer.current.scrollHeight;
      }, 50);
    }
  }, [responses, isLoading]);

  async function handlePrompt() {
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:5000/ollama?prompt=${prompt}`
      );
      const data = await response.json();
      setResponse(data);
      setResponses([...responses, data]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function getSound() {
    try {
      const response = await fetch(
        `http://localhost:5000/tts?prompt=${prompt}&type=input`
      );
    } catch (e) {
      console.error(e);
    }
  }

  const handleAudio = async () => {
    const audioElement = audioRef.current;
    await getSound();
    // cache busting - force the browser load the latest version of the audio file
    audioElement.src = `${audioFile}?${new Date().getTime()}`;

    if (audioElement) {
      audioElement.addEventListener("ended", () => {
        setIsPlaying(false);
      });
    }

    if (isPlaying) {
      audioElement.pause();
      setIsPlaying(false);
    } else {
      audioElement.play();
      setIsPlaying(true);
    }
  };

  const [isRecording, setIsRecording] = useState(false);
  const [recordingFileName, setRecordingFileName] = useState("");
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      setRecordingFileName(null);
      // request access to the microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      // collect the data in chuncks when it is available from the microphone
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        // create a Blob from the audio chunks
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        const hours = new Date().getHours();
        const minutes = new Date().getMinutes();
        const seconds = new Date().getSeconds();
        const fileName = `recording${hours}_${minutes}_${seconds}.webm`;

        saveAs(audioBlob, fileName);
        setRecordingFileName(fileName);
      };

      // begin caturing the audio based on the above setup
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Microphone access error:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // the API call that provides the transcription
  useEffect(() => {
    if (recordingFileName) {
      const getTranscription = async () => {
        try {
          // add a promise to resolve the race condition between saving a file and searching it instantly in the backend
          await new Promise((resolve) => setTimeout(resolve, 500));

          const response = await fetch(
            `http://localhost:5000/stt?title=${recordingFileName}`
          );
          const data = await response.json();
          setPrompt(data.transcription);
        } catch (error) {
          console.error(error);
        }
      };
      getTranscription();
    }
  }, [recordingFileName, setPrompt]);

  return (
    <div
      ref={inputContainerRef}
      className={styles.inputContainer}
      style={
        isLoading || responses.length
          ? { position: "absolute", bottom: "20px" }
          : {}
      }
    >
      <textarea
        ref={textAreaRef}
        className={
          prompt?.length < 56 || prompt?.length == 0
            ? `${styles.input}`
            : `${styles.input} ${styles.paddingBottom}`
        }
        placeholder="Ask me anything"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      ></textarea>
      <div className={styles.buttonsContainer}>
        <RoundButton
          src={isRecording ? pauseIcon : micIcon}
          onClick={isRecording ? stopRecording : startRecording}
        />
        <RoundButton
          src={isPlaying ? pauseIcon : playIcon}
          onClick={handleAudio}
        />
        <RoundButton src={sendIcon} onClick={handlePrompt} />
      </div>
      <audio ref={audioRef} src={audioFile} style={{ display: "none" }}></audio>
    </div>
  );
}
