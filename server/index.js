const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);

io.on("connection", (socket) => {
    console.log("a user connected");
});

const PORT = 8000;

http.listen(PORT, () => {
    console.log(`Server listening at ${PORT}`);
});
