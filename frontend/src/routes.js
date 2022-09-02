import React from "react";
import { Routes, Route } from "react-router-dom";
import { Listas } from "./components/Listas";
import { TrueorFalse } from "./components/TrueorFalse";
import { Mensajes } from "./components/Mensajes";
import Navigation from "./layouts/Navigation";

const routes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigation />}>
        <Route path="lists" element={<Listas />} />
        <Route path="messages" element={<Mensajes />} />
        <Route path="trueorfalse" element={<TrueorFalse />} />
      </Route>
    </Routes>
  );
};

export default routes;
