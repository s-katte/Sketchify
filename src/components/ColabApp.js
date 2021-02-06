import React, { useEffect } from "react";
import { useSocket } from "../contexts/SocketContext";

const ColabApp = () => {
    const { socket } = useSocket();

    useEffect(() => {
        console.log(socket);
    });

    return (
        <>
            <h1>Colab App</h1>
        </>
    );
};

export default ColabApp;
