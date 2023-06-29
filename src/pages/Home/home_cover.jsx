import "./index.scss";
export default function HomeCover({ cover, setCover }) {
  return (
    <div className={["home_cover", cover ? "" : "home_cover_hidden"].join(" ")}>
      <div className="container">
        <div className="home_cover_head">WEB VISUAL DESIGN</div>
        <div className="home_cover_main">
          <p className="top">THREE WEB VISUAL</p>
          <p className="bottom">
            <span onClick={() => setCover(false)} className="line_1">
              DESIGN
            </span>{" "}
            <br />
            <span className="line_2"> WEB VISUAL</span>
            <br />
            <span className="line_2">THREE WEB VISUAL</span>
            <br />
            <span className="line_3">BY EMBER_UB</span>
          </p>
        </div>
        <div className="home_cover_foot">WEB Visual DesignBY EMBER_UB</div>
      </div>
    </div>
  );
}
