import React, { useContext, useState } from "react";
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://192.168.1.108:8000/";

const SocketContext = React.createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(socketIOClient(ENDPOINT));

    return (
        <SocketContext.Provider value={{ socket, setSocket }}>
            {children}
        </SocketContext.Provider>
    );
};
