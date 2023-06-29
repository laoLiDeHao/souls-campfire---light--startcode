import About from "./About";
import Contact from "./Contact";
import Hello from "./Hello";
import Work from "./Work";
import "./index.scss";
export default function HomeLayout({ curren, setCurren }) {
  const list = [
    {
      name: "HELLO",
      page: <Hello />,
    },
    {
      name: "WORK",
      page: <Work />,
    },
    {
      name: "ABOUT",
      page: <About />,
    },
    {
      name: "CONTACT",
      page: <Contact />,
    },
  ];

  return (
    <>
      <div className="main dark">{list.find(item=>item.name===curren).page}</div>
    </>
  );
}
