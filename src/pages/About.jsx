import { Suspense } from "react";
import World from "../components/fps/App.jsx";
import Loading from "../components/others/Loading.jsx";
const structureUrl =
  "https://campsoul-light-1256331022.cos.ap-nanjing.myqcloud.com/structures/paintroom1.glb";
const About = () => {
  return (
    <div className="Three_room">
      <Suspense fallback={<Loading></Loading>}>
        <World
          structure={{
            // url: "/structure/paintroom1.glb",
            url: structureUrl,
            scale: [1, 1, 1],
            position: [0, 0, 0],
            rotation: [0, 0, 0],
          }}
          box={{
            // url: "/structure/paintroom1.glb",
            url: structureUrl,
            scale: [1, 1, 1],
            position: [0, 0, 0],
            rotation: [0, 0, 0],
          }}
        />
      </Suspense>
    </div>
  );
};

export default About;
