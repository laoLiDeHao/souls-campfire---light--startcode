import { useRef } from "react";
import "./index.scss";

export default function About() {
  const input = useRef(null);
  return (
    <div className="AboutView">
      <h1>tell me your name</h1>
      <p>
        <input ref={input} type="text" />
        <button
          onClick={() => {
            let name = input.current.value;
            console.log("nickname", name);
            localStorage.setItem("nickname", name);
          }}
        >
          ok
        </button>
      </p>
      <h1>Case：</h1>

      <h2>
        <a href="/PictureShow"> PictureShow </a>
      </h2>
      <h2>
        <a href="/RingHouse"> RingHouse </a>
      </h2>
    </div>
  );
}
