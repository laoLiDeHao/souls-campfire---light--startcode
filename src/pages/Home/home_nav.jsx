// import { useState } from "react";
import MediaQuery from "react-responsive/";
import "./index.scss";
import {
  GroupOutlined,
  SearchOutlined,
  AlignLeftOutlined,
} from "@ant-design/icons";
import { useState } from "react";
export default function HomeNav({ cover, setCover, curren, setCurren }) {
  const list = [
    {
      name: "HELLO",
      inner: "HELLO",
      url: "hello",
    },
    {
      name: "WORK",
      inner: "WORK",
      url: "work",
    },
    {
      name: "ABOUT",
      inner: "ABOUT",
      url: "about",
    },
    {
      name: "CONTACT",
      inner: "CONTACT",
      url: "contact",
    },
  ];

  const [mshow, setMshow] = useState(false);
  return (
    <>
      <MediaQuery minWidth={770}>
        <div className="home_nav">
          <div>
            <GroupOutlined
              onClick={() => {
                console.log(cover);
                setCover(true);
              }}
            />
          </div>

          <div>
            <ul>
              {
                list.map((item) => (
                  <li
                    className={curren === item.name ? "active" : ""}
                    onClick={() => setCurren(item.name)}
                  >
                    {item.inner}
                  </li>
                ))}
              <li>
                <SearchOutlined />
              </li>
            </ul>
          </div>
        </div>
      </MediaQuery>
      <MediaQuery maxWidth={769}>
        <div className="home_nav_moible">
          <div className="menu">
            <AlignLeftOutlined onClick={() => setMshow(!mshow)} />
            <ul className={["list", mshow ? "list_active" : ""].join(" ")}>
              {list.map((item) => (
                <li
                  className={mshow ? "li_active" : ""}
                  onClick={() => {
                    setCurren(item.name);
                    setMshow(false);
                  }}
                >
                  {item.inner}
                </li>
              ))}
            </ul>
          </div>

          <div className="search">
            <input placeholder="随便搜，啥都没有" type="text" />
          </div>
        </div>
      </MediaQuery>
    </>
  );
}
