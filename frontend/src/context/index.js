import React, { useState } from "react";
const Context = React.createContext();
export const useProvider = () => {
  return React.useContext(Context);
};

export const Provider = ({ children }) => {
  const [id, setId] = useState(-1);
  // const setID = useCallback((itemId) => setId(itemId), []);
  return <Context.Provider value={{ id, setId }}>{children}</Context.Provider>;
};
