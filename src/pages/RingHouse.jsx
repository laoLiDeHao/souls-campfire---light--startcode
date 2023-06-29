
import { Suspense } from "react";
import World from "../components/fps/App.jsx";
import Loading from "../components/others/Loading.jsx";

 const RingHouse = ()=>{
  return (
    <div className="Three_room">
      <Suspense fallback={<Loading></Loading>}>
        <World
          structure={{
            url: "/structure/room.glb",
            scale: [1, 1, 1],
            position: [0, 0, 0],
            rotation: [0, 0, 0],
          }}
          box={{
            // url: "/structure/paintroom1.glb",
            url: "/structure/room.glb",
            scale: [1, 1, 1],
            position: [0, 0, 0],
            rotation: [0, 0, 0],
          }}
        />
      </Suspense>
    </div>
  );
}

export default RingHouse