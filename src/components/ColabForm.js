import React, { useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { useSocket } from "../contexts/SocketContext";
import { useHistory } from "react-router-dom";

const ColabForm = () => {
    const [join, setJoin] = useState(true);
    const [username, setUsername] = useLocalStorage("username", "");
    const [roomname, setRoomname] = useLocalStorage("roomname", "");
    const { socket } = useSocket();
    const history = useHistory();

    const createRoom = (e) => {
        e.preventDefault();
        console.log(socket);
        history.push("/colab-app");
    };

    return (
        <>
            <div className="colab-container">
                <h1>Colab form</h1>
                {(join && (
                    <form>
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
