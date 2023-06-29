import { BrowserRouter, Route, Routes } from "react-router-dom";

// import App from "../App";

import About from "../pages/About";
import Home from "../pages/Home";


/*eslint-disable */


const BaseRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />}>
      </Route>
      <Route path="/PictureShow" element={<About />}></Route>
    </Routes>
  </BrowserRouter>
);
export default BaseRouter;
