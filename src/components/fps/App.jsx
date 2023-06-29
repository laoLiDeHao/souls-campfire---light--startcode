import { Stats, Environment } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Game from "./Game";
import Overlay from "./Overlay";
import { Joystick } from "react-joystick-component";
import { useState } from "react";

export default function App({
  
  structure = {
    url: "",
    scale: 2,
    position: [0, 0, 0],
    rotation: [0, 0, 0],
  },
  box = {
    url: "",
    scale: 2,
    position: [0, 0, 0],
    rotation: [0, 0, 0],
  },
}) {
  const [room, setRoom] = useState(null)
  const [chatMsg,setChatMsg] = useState("")
  // let {structure} = props  // url position rotation scale
  const [joypos, setJoypos] = useState({ x: 0, y: 0, active: false });
  return (
    <>
      <Canvas shadows>
        <Environment files="https://campsoul-light-1256331022.cos.ap-nanjing.myqcloud.com/hrds/642fdafa8ca99.hdr" background />
        <Game  room={room} setRoom={setRoom} setChatMsg={setChatMsg} joypos={joypos} structure={structure} box={box} />
        {/* <PointerLockControls /> */}
        <Stats />
      </Canvas>
      <div className="Joystick_container_app">
        <Joystick
          size={100}
          sticky={false}
          baseColor="#747474"
          stickColor="#efefef"
          move={(e) => {
            let { x, y } = e;
            setJoypos({ x, y, active: true });
            console.log("Joystick", e);
          }}
          stop={(e) => {
            setJoypos({ x: 0, y: 0, active: false });
            console.log("Joystick", e);
          }}
        ></Joystick>
      </div>
      <Overlay chatMsg={chatMsg} room={room} />
    </>
  );
}
