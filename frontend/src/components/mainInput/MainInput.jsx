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
  response,
  setResponse,
  prompt,
  setPrompt,
  isLoading,
  setIsLoading,
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

  const handleChange = (e) => {
    setPrompt(e.target.value);
  };

  useEffect(() => {
    handleHeight();
  }, [prompt]);

  async function handlePrompt() {
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:5000/gptt?prompt=${prompt}`
      );
      const data = await response.json();
      setResponse(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function getSound() {
    console.log("here");
    try {
      const response = await fetch(
        `http://localhost:5000/voice?prompt=${prompt}&type=input`
      );
    } catch (e) {
      console.error(e);
    }
  }

  const handleAudio = async () => {
    const audioElement = audioRef.current;

    await getSound();
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
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      // Store stream reference for cleanup
      const mediaStream = stream;

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
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

  useEffect(() => {
    if (recordingFileName) {
      const getTranscription = async () => {
        try {
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
    <div ref={inputContainerRef} className={styles.inputContainer}>
      <textarea
        ref={textAreaRef}
        className={
          prompt?.length < 38 || prompt?.length == 0
            ? `${styles.input}`
            : `${styles.input} ${styles.paddingBottom}`
        }
        placeholder="Ask me anything"
        value={prompt}
        onChange={handleChange}
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
