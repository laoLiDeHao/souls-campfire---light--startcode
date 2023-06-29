import MessageUi from "./UI/MessageUi";

export default function Overlay({ chatMsg, room }) {
  return (
    <div id="instructions" className="instructions">
      {/* W,A,S,D to move.
      <br />
      Space to jump.
      <br />
      Mouse click to shoot. */}
      <MessageUi chatMsg={chatMsg} room={room} />
    </div>
  );
}
