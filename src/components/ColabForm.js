import React, { useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { useSocket } from "../contexts/SocketContext";
import { useHistory } from "react-router-dom";

const ColabForm = () => {
    const [join, setJoin] = useState(true);
    const [username, setUsername] = useLocalStorage("username", "");
    const [roomname, setRoomname] = useLocalStorage("roomname", "");
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    const { socket } = useSocket();
    const history = useHistory();

    const createRoom = (e) => {
        e.preventDefault();

        socket.emit("join", { username, room: roomname }, (error) => {
            if (error) setError(error);
            else {
                setSuccess(true);
                setTimeout(() => history.push("/colab-app"), 2000);
            }
        });
    };

    const joinRoom = (e) => {
        e.preventDefault();
        socket.emit("join", { username, room: roomname }, (error) => {
            if (error) setError(error);
            else {
                history.push("/colab-app");
            }
        });
    };

    socket.on("message", (data) => console.log(data));

    return (
        <>
            <div className="colab-container">
                <h1>Colab form</h1>
                {(join && (
                    <form onSubmit={joinRoom}>
                        {error && <h3>{error}</h3>}
                        <input
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Username"
                            onChange={(event) =>
                                setUsername(event.target.value)
                            }
                            value={username}
                        />
                        <input
                            type="text"
                            id="roomname"
                            name="roomname"
                            placeholder="Room Name"
                            onChange={(event) =>
                                setRoomname(event.target.value)
                            }
                            value={roomname}
                        />
                        <input type="submit" value="join room" />
                    </form>
                )) || (
                    <form onSubmit={createRoom}>
                        {error && <h3>{error}</h3>}
                        {success && (
                            <h3>
                                The room {roomname} is created successfully!!
                                joining you in 2 short seconds!
                            </h3>
                        )}
                        <input
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Username"
                            onChange={(event) =>
                                setUsername(event.target.value)
                            }
                            value={username}
                        />
                        <input
                            type="text"
                            id="roomname"
                            name="roomname"
                            placeholder="Room Name"
                            onChange={(event) =>
                                setRoomname(event.target.value)
                            }
                            value={roomname}
                        />
                        <input type="submit" value="create room" />
                    </form>
                )}
                OR{" "}
                <button onClick={() => setJoin(!join)}>
                    {(join && "Create Room") || "Join Room"}
                </button>
            </div>
        </>
    );
};

export default ColabForm;
