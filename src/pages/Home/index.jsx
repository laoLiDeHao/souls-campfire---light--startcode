import { useState } from "react";
import HomeCover from "./home_cover";
import "./index.scss";
import HomeNav from "./home_nav";
import HomeLayout from "./home_layout";
export default function Home() {
  const [cover, setCover] = useState(true);
  const [curren, setCurren] = useState("HELLO");
  return (
    <div className="Home light">
      <HomeLayout
        cover={cover}
        setCover={setCover}
        curren={curren}
        setCurren={setCurren}
      />
      <HomeNav
        cover={cover}
        setCover={setCover}
        curren={curren}
        setCurren={setCurren}
      />
      <HomeCover cover={cover} setCover={setCover} />
    </div>
  );
}
