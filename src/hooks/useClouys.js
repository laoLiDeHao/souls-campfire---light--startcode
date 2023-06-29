import { Client } from "colyseus.js";

const dummyProxies = new Map();
const touchServe = async (
  { dummy, setCustoms, setRoom, setChatMsg },
  roomname = "my_room"
) => {
  console.log("init", dummy);

  const client = new Client("ws://192.168.0.23:2567");

  // mounted
  const room = await client.joinOrCreate(roomname);
  setRoom(room);
  console.log("game room", room);
  room.state.players.onAdd = (player, sessionId) => {
    console.log("player join", sessionId, player);

    const isMe = room.sessionId === sessionId;
    if (isMe) {
      console.log("it's me");
      return;
    }

    // other
    // dummyProxies[sessionId] = dummy;
    dummyProxies.set(sessionId, player);
    // console.log("customs", [...dummyProxies]);
    setCustoms([...dummyProxies]);
    player.onChange = () => {
      console.log("player change", player);
      // Object.assign(dummy,player)
      setCustoms([...dummyProxies]);
    };
  };

  room.state.players.onRemove = (player, sessionId) => {
    console.log("player remove", sessionId);
    dummyProxies.delete(sessionId);
    setCustoms([...dummyProxies]);
  };

  // let handle = setInterval(() => {
  //   // console.log("can't send now", dummy);
  //   if (!dummy.active) return;
  //   const { x, y, z, rotationX, rotationY, rotationZ } = dummy;
  //   room.send("updatePlayer", {
  //     x,
  //     y,
  //     z,
  //     rotationX,
  //     rotationY,
  //     rotationZ,
  //   });
  // }, 10);

  // // Unmounted
  // cleanup(() => {
  //   clearInterval(handle)
  // })
  room.onMessage("chatMessage", (data) => {
    let msg = JSON.parse(data);

    console.log("send valuecome", msg);

    setChatMsg(msg);
  });

  return dummyProxies;
};

export default touchServe;
