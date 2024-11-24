import { useRef, useState, useEffect, useCallback } from 'react';
import Webcam from 'react-webcam';
import Layout from '../Layout';
import { useNavigate } from 'react-router-dom';
import useReportStore from '../store/useReportStore';

function base64ToFile(base64String, filename, mimeType) {
  const byteString = atob(base64String.split(',')[1]);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uintArray = new Uint8Array(arrayBuffer);
  for (let i = 0; i < byteString.length; i++) {
    uintArray[i] = byteString.charCodeAt(i);
  }
  const blob = new Blob([arrayBuffer], { type: mimeType });
  return new File([blob], filename, { type: mimeType });
}

const WebcamCapture = () => {
  const [capturedImage, setCapture] = useState(null);
  const [rotate, setRotate] = useState(true);
  const setImage = useReportStore((state) => state.setImage);
  const webcamRef = useRef(null);
  let navigate = useNavigate();

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: rotate ? 'environment' : 'user',
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    const imageBinary = base64ToFile(imageSrc, 'image.jpg', 'image/jpg');
    setCapture(imageSrc);
    setImage(imageBinary);
  }, [webcamRef]);

  const rotateCam = () => {
    setRotate(!rotate);
  };
  const reset = () => {
    setCapture(null);
  };

  const reportDanger = () => {
    console.log('SENT');
    navigate('/result');
  };
  return (
    <Layout className="relative h-screen">
      <div className="h-screen">
        <div className="m-5 space-y-2">
          <h1 className="text-2xl font-bold w-3/4">Can you capture sorrounding?</h1>
          <p className="text-xl">It'll be helpful fo us to get information</p>
        </div>
        {capturedImage ? (
          <img src={capturedImage} className="w-full" />
        ) : (
          <div>
            <Webcam
              audio={false}
              height={400}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={1280}
              videoConstraints={videoConstraints}
              className="w-full"
            />
            <button
              className="flex items-center justify-center shadow-lg w-12 h-12 bg-red-600 text-white rounded-full absolute bottom-36 md:top-72 left-2"
              onClick={rotateCam}
            >
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
          <div className="flex flex-col items-center justify-center mt-5 gap-3 fixed bottom-3 md:relative w-full">
            <button onClick={reset} className="border border-red-500 p-3 rounded-full text-center w-11/12 text-red-500">
              Reset photo
            </button>
            <button onClick={reportDanger} className="bg-red-500 p-3 rounded-full text-center w-11/12 text-white">
              Proceed
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center justify-center mt-5 w-full md:relative">
              <button onClick={capture} className="bg-red-500 p-3 rounded-full text-center w-11/12 text-white">
                Capture photo
              </button>
            </div>
            <div className="flex flex-col items-center justify-center mt-10 w-full md:relative">
              <button onClick={reportDanger} className="border border-red-500 p-2 rounded-md text-red-500 text-center w-fit">
                Skip this step
              </button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default WebcamCapture;
