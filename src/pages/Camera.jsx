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
  let navigate = useNavigate()

  const capture = useCallback(() => {
    console.log(webcamRef)
    const imageSrc = webcamRef.current.getScreenshot();
    setCapture(imageSrc)
  }, [webcamRef]);

  const reset = () => {
    setCapture(null);
  };

  const reportDanger = () => {
    navigate("/result")
  }
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
        <Webcam
          audio={false}
          height={400}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={1280}
          videoConstraints={videoConstraints}
        />
      )}
      {capturedImage ? (
        <>
        <button
          onClick={reset}
          className="bg-red-500 p-3 rounded-full text-center w-8/12 text-white absolute bottom-2"
        >
          Reset photo
        </button>
        <button onClick={reportDanger}>Lanjut</button>
        </>
      ) : (
        <button
          onClick={capture}
          className="bg-red-500 p-3 rounded-full text-center w-10/12 text-white absolute bottom-2"
        >
          Capture photo
        </button>
      )}
    </Layout>
  );
};

export default WebcamCapture;
