import { useEffect, useRef, useState } from "react";

export default function MessageUi({ room, chatMsg }) {
  const input = useRef(null);

  const [messages, setMessage] = useState([]);

  useEffect(() => {
    // messages.current
    if (chatMsg) setMessage(() => [chatMsg, ...messages]);
    // eslint-disable-next-line
  }, [chatMsg]);

  return (
    <div className="MessageUi">
      <div className="Inputs">
        <input
          type="text"
          ref={input}
          onFocus={() => {
            window.preventKeyboardEvent = true;
          }}
          onBlur={() => {
            window.preventKeyboardEvent = false;
          }}
        />
        <button
          onClick={() => {
            let value = input.current.value.trim();
            console.log("send value", value);
            if (value && room) {
              room.send("chatMessage", value);
              input.current.value = "";
            }
          }}
        >
          ok
        </button>
      </div>
      <div className="Infos">
        {messages.map((item) => (
          <p>
            <spam className="username">{item.nickname}</spam>:{item.message}
          </p>
        ))}
      </div>
    </div>
  );
}
