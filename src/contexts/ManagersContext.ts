import  { createContext } from 'react';

interface Manager {
    name: String,
    email:String
  }

type ManagersType = {
    managers: Manager[];
    setManagers: Function
};

export const ManagersContext = createContext<ManagersType>({managers:[], setManagers:()=>{}})



