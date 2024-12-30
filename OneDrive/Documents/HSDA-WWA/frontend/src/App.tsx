import React from "react";
import { Routes, Route, HashRouter } from "react-router-dom";
import WhereWeAre from "./pages/WhereWeAre";

const App: React.FC = () => {
  console.log("Rendering App with HashRouter");
  return (
    <HashRouter>
      <Routes>
        <Route path="/WhereWeAre" element={<WhereWeAre />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
