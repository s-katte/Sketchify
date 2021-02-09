import { useState, useEffect, useRef } from "react";
import socketIOClient from "socket.io-client";

const ENDPOINT = "http://localhost:3000/";

const ClientSocket = ({ username, room }) => {
    const socketRef = useRef();
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        socketRef.current = socketIOClient(ENDPOINT);

        socketRef.current.emit("join", { username, room }, (error) => {
            if (error) {
                setError(error);
            }
        });

        return () => {
            socketRef.current.emit("disconnect");
        };
    }, [username, room]);

    useEffect(() => {
        socketRef.current.on("roomData", ({ users }) => {
            setUsers(users);
        });
    }, []);

    return { users, error };
};

export default ClientSocket;
