const app = require("express")();
const http = require("http").Server(app);

const io = require("socket.io")(http, {
    cors: {
        origin: "*",
    },
});
const cors = require("cors");
const {
    addUser,
    getUser,
    getUsersInRoom,
    getAllData,
    removeUser,
} = require("./utils/User");

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
        // console.log(getUsersInRoom(room));

        socket.emit("message", {
            user: "adminX",
            text: `${user.name.toUpperCase()}, Welcome to ${user.room} room.`,
        });

        socket.to(room).emit("message", {
            user: "adminX",
            text: `${user.name.toUpperCase()} has joined the room.`,
        });

        callback();
    });

    socket.on("leave-room", (data) => {
        socket.leave(data.roomname);
        removeUser(socket.id);
        console.log("LEAVING:", getAllData());
    });

    socket.on("data-to-room", (data) => {
        console.log("ADAPTER", socket.adapter.rooms);
        console.log("USERNAME", data.username, socket.id);
        console.log("USEDATA", getUsersInRoom(data.roomname));
        // console.log(data);
        // socket.to(data.roomname).emit("msg", "msg msg");
        const allInRoom = getUsersInRoom(data.roomname);
        allInRoom.map((user) => {
            if (user.name != data.username)
                socket.to(user.id).emit("msg", data);
        });
    });
});

const PORT = 8000;

http.listen(PORT, () => {
    console.log(`Server listening at ${PORT}`);
});
