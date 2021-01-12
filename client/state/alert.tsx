import React, { Dispatch, useState } from "react";

export type alertType = "success" | "danger";

export type AlertState = {
  type: alertType;
  message: string;
};

const defaultState = {} as AlertState;

const AlertContext = React.createContext({});

const AlertDispatchContext = React.createContext((() => {}) as Dispatch<any>);

const AlertProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState(defaultState);

  return (
    <AlertContext.Provider value={state}>
      <AlertDispatchContext.Provider value={setState}>
        {children}
      </AlertDispatchContext.Provider>
    </AlertContext.Provider>
  );
};

export default AlertProvider;
