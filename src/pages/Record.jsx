import { useState } from "react";
import Layout from "../Layout";
import { useNavigate } from "react-router-dom";

function Record() {
  const [count, setCount] = useState(0);
  let navigate = useNavigate()
  const reportDanger = () =>{
    navigate("/maps")
  }
  return (
    <Layout className={'flex flex-col items-center text-center m-5 gap-9'}>
      <h1 className="text-4xl font-bold mb-3">Describe Emergency on Mic</h1>
      <h1 className="text-xl font-medium w-8/12">
        For precise, please tell us
      </h1>
      <ul className="list-none">
        <li>What is your name</li>
        <li>Whats the emergency</li>
        <li>Where location name</li>
      </ul>
      <div className="flex items-center justify-center">
        <button
          onClick={reportDanger}
          className="animate-pulse flex items-center justify-center w-60 h-60 bg-red-600 active:bg-red-500 transition-all rounded-full ring-red-600 ring-offset- ring-[5px]"
        >
          <h1 className="text-2xl font-semibold text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={8*10}
              height={8*10}
              viewBox="0 0 24 24"
              fill="currentColor"
              class="icon icon-tabler icons-tabler-filled icon-tabler-microphone"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M19 9a1 1 0 0 1 1 1a8 8 0 0 1 -6.999 7.938l-.001 2.062h3a1 1 0 0 1 0 2h-8a1 1 0 0 1 0 -2h3v-2.062a8 8 0 0 1 -7 -7.938a1 1 0 1 1 2 0a6 6 0 0 0 12 0a1 1 0 0 1 1 -1m-7 -8a4 4 0 0 1 4 4v5a4 4 0 1 1 -8 0v-5a4 4 0 0 1 4 -4" />
            </svg>
          </h1>
        </button>
      </div>
    </Layout>
  );
}

export default Record;
