import { useState, useEffect } from "react";
import Layout from "../Layout";
import Shake from "shake.js";
import { useNavigate } from "react-router-dom";

function Home() {
  const [trigger, setTrigger] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [isRunning, setIsRunning] = useState(false);
  let navigate = useNavigate()
  const triggerSOS = () => {
    let count = 0
    let ok = setInterval(()=>{
      count=count+1
      if(count>3){
        clearInterval(ok)
      }
      navigator.vibrate(500);
    },1000)
    setTrigger(true);
    setCountdown(5);
    setIsRunning(true);
  };
  let myShakeEvent = new Shake({
    threshold: 10,
  });
  myShakeEvent.start();
  window.addEventListener("shake", triggerSOS, false);

  const reportDanger = () =>{
    navigate("/record")
  }
  useEffect(() => {
    if (isRunning && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && isRunning) {
      setIsRunning(false);
      reportDanger()
      myShakeEvent.stop();
    }
  }, [countdown, isRunning]);
  return (
    <Layout>
      {trigger ? (
        <div className="h-screen flex flex-col justify-center items-center text-center w-full bg-red-600">
          <div className="py-5 text-center">
            <span className="text-4xl">🚨</span>
            <h1 className="text-5xl flex items-center justify-center text-white font-bold">
              Emergency Detected!
            </h1>
          </div>
          <div className="flex flex-col gap-4 w-8/12">
            <button className="text-white border-white border px-3 py-4 rounded-full" onClick={()=>{
              setTrigger(false)
              setIsRunning(false)
            }}>
              ❌ Cancel
            </button>
            <button className="flex gap-6 items-center bg-white rounded-full px-3 py-2" onClick={reportDanger}>
              <div
                className="flex flex-col items-center justify-center"
                id="spinning"
              >
                <div className="relative w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute text-xl font-bold text-red-500">
                  {countdown > 0 ? countdown : "🚨"}
                </div>
              </div>
              Yes, proceed
            </button>
          </div>
        </div>
      ) : (
        <div className="h-screen flex flex-col items-center text-center gap-9 m-5">
          <h1 className="text-4xl font-semibold mb-5 rounded-full bg-red-500 text-white p-5">
            🚨ReportSOS
          </h1>
          <h1 className="text-2xl font-medium w-9/12">
            Shake your phone to send an emergency alert, or tap the SOS button below.
          </h1>
          <button
            onClick={triggerSOS}
            className="flex items-center justify-center w-52 h-52 bg-red-600 active:bg-red-500 transition-all rounded-full ring-red-600 ring-offset-white ring-offset-4 ring-[3px] animate-pulse"
          >
            <h1 className="text-2xl font-semibold text-white">Help Me!</h1>
          </button>
          <div>Use wisely, report will be sent to 911</div>
        </div>
      )}
    </Layout>
  );
}

export default Home;
