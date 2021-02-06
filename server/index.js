const app = require("express")();
const http = require("http").Server(app);

const io = require("socket.io")(http, {
    cors: {
        origin: "*",
    },
});
const cors = require("cors");
const { addUser, getUser, getUsersInRoom } = require("./utils/User");

const corsOpts = {
    origin: "*",
};

app.use(cors(corsOpts));

io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("join", ({ username, room }, callback) => {
        console.log("DATA: ", username, room);
        const { error, user } = addUser({
            id: socket.id,
            name: username,
            room,
        }); // add user with socket id and room info

        if (error) return callback(error);
        console.log(getUsersInRoom(room));

        socket.emit("message", {
            user: "adminX",
            text: `${user.name.toUpperCase()}, Welcome to ${user.room} room.`,
        });

        callback();
    });

    socket.on("disconnect", (reason) => {
        console.log("user disconnected", reason);
    });
});

const PORT = 8000;

http.listen(PORT, () => {
    console.log(`Server listening at ${PORT}`);
});
