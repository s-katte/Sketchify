// import React, { useEffect } from "react";

// const ColabApp = () => {
//     return (
//         <>
//             <h1>Colab App</h1>
//         </>
//     );
// };

// export default ColabApp;
import React, { useState, useEffect, useRef } from "react";
import Editor from "./Editor";
import useLocalStorage from "../hooks/useLocalStorage";
import Split from "react-split";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faDownload,
    faEraser,
    faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { useSocket } from "../contexts/SocketContext";

const introDoc = `<html>
      <body>
        <div style="height: 100vh; background-image: radial-gradient(circle, #263238, #212226);">
        <div style="font-family: 'Lato'" class="intro-text">
        <h1 style="font-size: 25px">
        Welcome to <span style="font-family: 'Rubik'; color:#b8b8b8">Sketchify</span>
        </h1>
        <p style="font-size: 20px">Give your imagination a head-start!</p>
        </div></div>
      </body>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Lato:wght@300&family=Rubik&display=swap');
        * {
            box-sizing: border-box; margin: 0; padding: 0;
        }
        .intro-text {
            color: gray; text-align: center; position: absolute; top: 50%; left: 50%; -ms-transform: translate(-50%, -50%); transform: translate(-50%, -50%);
        }
      </style>
    </html>`;

function ColabApp() {
    // const [html, setHtml] = useLocalStorage("html", "");
    // const [css, setCss] = useLocalStorage("css", "");
    // const [js, setJs] = useLocalStorage("js", "");
    // const [title, setTitle] = useLocalStorage("title", "");
    const [username] = useLocalStorage("username", "");
    const [roomname] = useLocalStorage("roomname", "");
    const [html, setHtml] = useState("");
    const [css, setCss] = useState("");
    const [js, setJs] = useState("");
    const [title, setTitle] = useState("");
    const [srcDoc, setSrcDoc] = useState("");
    const { socket } = useSocket();
    const htmlEditor = useRef(null);
    const cssEditor = useRef(null);
    const jsEditor = useRef(null);
    // HTML
    const downloadHtml = () => {
        let htmlContent = `
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>${title}</title>
        <link rel="stylesheet" href="./styles.css">
    </head>
    <body>${html}</body>
    <script src="./script.js"></script>
</html>
            `;
        let link = document.getElementById("download-btn-html");
        let file = new Blob([htmlContent], { type: "html" });
        let downloadFile = "index.html";
        link.target = "_blank";
        link.href = URL.createObjectURL(file);
        link.download = downloadFile;
    };
    const downloadCss = () => {
        // CSS
        let cssLink = document.getElementById("download-btn-css");
        let cssFile = new Blob([css], { type: "css" });
        let cssDownloadFile = "styles.css";
        cssLink.target = "_blank";
        cssLink.href = URL.createObjectURL(cssFile);
        cssLink.download = cssDownloadFile;
    };
    const downloadJs = () => {
        // JS
        let jsLink = document.getElementById("download-btn-js");
        let jsFile = new Blob([js], { type: "js" });
        let jsDownloadFile = "script.js";
        jsLink.target = "_blank";
        jsLink.href = URL.createObjectURL(jsFile);
        jsLink.download = jsDownloadFile;
    };

    const clearEditor = () => {
        setHtml("");
        setCss("");
        setJs("");
    };

    socket.on("msg", (data) => {
        setHtml(data.html);
        setCss(data.css);
        setJs(data.js);
        setTitle(data.title);
        console.log("FROM", data.username);
    });

    useEffect(() => {
        if (title === "") {
            document.title = "Sketchify - Untitled";
        } else {
            document.title = "Sketchify - " + title;
        }

        if (!(html === "" && css === "" && js === "")) {
            document.getElementById("iframe").classList.remove("disblock");
            document.getElementById("intro").classList.add("disblock");
        }
        const timeout = setTimeout(() => {
            setSrcDoc(`
        <html>
          <body>${html}</body>
          <style>${css}</style>
          <script>${js}</script>
        </html>
      `);
        }, 250);

        return () => clearTimeout(timeout);
    }, [html, css, js, title]);

    useEffect(() => {
        window.addEventListener("beforeunload", (ev) => {
            ev.preventDefault();
            return (
                (ev.returnValue = "Changes you made will not be saved."),
                socket.emit("leave-room", { roomname })
            );
        });
    });

    const sendData = () => {
        console.log("sending", htmlEditor.current.props.value);

        socket.emit("data-to-room", {
            roomname,
            username,
            title,
            html: htmlEditor.current.props.value,
            css: cssEditor.current.props.value,
            js: jsEditor.current.props.value,
        });
    };
    return (
        <div className="wrap-box">
            <nav className="nav-bar box1">
                <div className="logo">Sketchify</div>
                <input
                    className="title"
                    id="title-input"
                    placeholder="Untitled"
                    required="required"
                    value={title}
                    onChange={() =>
                        setTitle(document.getElementById("title-input").value)
                    }
                    autoComplete="off"
                />
                <div className="btn-container">
                    <div className="clearCode" onClick={clearEditor}>
                        <FontAwesomeIcon icon={faEraser} />
                        <div>Clear Code</div>
                    </div>
                    <a
                        href=" "
                        id="download-btn-html"
                        title="Download HTML file"
                        onClick={downloadHtml}>
                        <FontAwesomeIcon icon={faDownload} />
                        <div>HTML</div>
                    </a>
                    <a
                        href=" "
                        id="download-btn-css"
                        title="Download CSS file"
                        onClick={downloadCss}>
                        <FontAwesomeIcon icon={faDownload} />
                        <div>CSS</div>
                    </a>
                    <a
                        href=" "
                        id="download-btn-js"
                        title="Download JS file"
                        onClick={downloadJs}>
                        <FontAwesomeIcon icon={faDownload} />
                        <div>JS</div>
                    </a>
                    <a
                        href="/colabDetails"
                        id="collaborate-btn"
                        title="Collaborate">
                        <FontAwesomeIcon icon={faUsers} />
                        <div>Collaborate</div>
                    </a>
                </div>
            </nav>
            <Split sizes={[50, 50]} direction="vertical" className="box2">
                <Split className="pane top-pane box21" sizes={[33, 34, 33]}>
                    <Editor
                        language="text/html"
                        displayName="HTML"
                        refer={htmlEditor}
                        value={html}
                        onChange={setHtml}
                        performSend={sendData}
                    />
                    <Editor
                        language="css"
                        displayName="CSS"
                        value={css}
                        onChange={setCss}
                        performSend={sendData}
                        refer={cssEditor}
                    />
                    <Editor
                        language="javascript"
                        displayName="JS"
                        value={js}
                        onChange={setJs}
                        performSend={sendData}
                        refer={jsEditor}
                    />
                </Split>
                <div className="pane box22">
                    <iframe
                        srcDoc={srcDoc}
                        title="output"
                        id="iframe"
                        sandbox="allow-scripts"
                        frameBorder="0"
                        width="100%"
                        height="100%"
                        className="disblock"
                    />
                    <iframe
                        srcDoc={introDoc}
                        title="intro"
                        id="intro"
                        sandbox="allow-scripts"
                        frameBorder="0"
                        width="100%"
                        height="100%"
                    />
                </div>
            </Split>
            <a
                href="https://github.com/s-katte/Sketchify"
                target="_blank"
                rel="noopener noreferrer"
                id="github-link"
                className="text-center">
                <FontAwesomeIcon icon={faGithub} />
                <span>&nbsp;GitHub</span>
            </a>
        </div>
    );
}

export default ColabApp;
