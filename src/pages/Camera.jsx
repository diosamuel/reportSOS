import { useRef, useState, useEffect, useCallback } from "react";
import Webcam from "react-webcam";
import Layout from "../Layout";
import { useNavigate } from "react-router-dom";

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user",
};

const WebcamCapture = () => {
  const [capturedImage, setCapture] = useState(null);
  const webcamRef = useRef(null);
  let navigate = useNavigate();

  const capture = useCallback(() => {
    console.log(webcamRef);
    const imageSrc = webcamRef.current.getScreenshot();
    setCapture(imageSrc);
  }, [webcamRef]);

  const reset = () => {
    setCapture(null);
  };

  const reportDanger = () => {
    navigate("/result");
  };
  return (
    <Layout className="relative h-screen">
      <div className="m-5 space-y-2">
        <h1 className="text-3xl font-bold w-3/4">
          Can you capture sorrounding?
        </h1>
        <p className="text-xl">It’ll be helpful fo us to get information</p>
      </div>
      {capturedImage ? (
        <img src={capturedImage} />
      ) : (
        <div>
          <Webcam
            audio={false}
            height={400}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={1280}
            videoConstraints={videoConstraints}
          />
          <button className="flex items-center justify-center shadow-lg w-12 h-12 bg-orange-500 text-white rounded-full absolute top-[23em] left-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="icon icon-tabler icons-tabler-outline icon-tabler-camera-rotate"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M5 7h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2" />
              <path d="M11.245 15.904a3 3 0 0 0 3.755 -2.904m-2.25 -2.905a3 3 0 0 0 -3.75 2.905" />
              <path d="M14 13h2v2" />
              <path d="M10 13h-2v-2" />
            </svg>
          </button>
        </div>
      )}
      {capturedImage ? (
        <div className="flex flex-col items-center justify-center mt-5 gap-3">
          <button
            onClick={reset}
            className="border border-red-500 p-3 rounded-full text-center w-11/12 text-red-500"
          >
            Reset photo
          </button>
          <button
            onClick={reportDanger}
            className="bg-red-500 p-3 rounded-full text-center w-11/12 text-white"
          >
            Lanjut
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-5 gap-3">
          <button
            onClick={capture}
            className="bg-red-500 p-3 rounded-full text-center w-11/12 text-white"
          >
            Capture photo
          </button>
        </div>
      )}
    </Layout>
  );
};

export default WebcamCapture;
