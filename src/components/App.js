import React, { useState, useEffect } from "react";
import Editor from "./Editor";
import useLocalStorage from "../hooks/useLocalStorage";
import Split from "react-split";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload } from '@fortawesome/free-solid-svg-icons'

function App() {
    const [html, setHtml] = useLocalStorage("html", "");
    const [css, setCss] = useLocalStorage("css", "");
    const [js, setJs] = useLocalStorage("js", "");
    const [srcDoc, setSrcDoc] = useState("");
    //Title
    const [title, setTitle] = useState(() => {
        const value = localStorage.getItem("codepen-clone-title")
        if (value != null) {
            return value
        }
        else {
            return ""
        }
    })

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

    useEffect(() => {
        if (title === "") {
            document.title = 'Sketchify - Untitled'
        } else {
            document.title = 'Sketchify - ' + title
            localStorage.setItem("codepen-clone-title", title)
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
            return (ev.returnValue = "Changes you made will not be saved.");
        });
    });

    return (
        <div className="wrap-box">
            <nav className='nav-bar box1'>
                <div className='logo'>Sketchify</div>
                <input className='title' id='title-input' placeholder='Untitled' required="required" value={title} onChange={() => setTitle(document.getElementById('title-input').value)} autoComplete='off' />
                <div className='download-btn'>
                    <a href=" " id="download-btn-html" title="Download HTML file" onClick={downloadHtml}>
                        <FontAwesomeIcon icon={faDownload} />
                        <div>HTML</div>
                    </a>
                    <a href=" " id="download-btn-css" title="Download CSS file" onClick={downloadCss}>
                        <FontAwesomeIcon icon={faDownload} />
                        <div>CSS</div>
                    </a>
                    <a href=" " id="download-btn-js" title="Download JS file" onClick={downloadJs}>
                        <FontAwesomeIcon icon={faDownload} />
                        <div>JS</div>
                    </a>
                </div>
            </nav>
            <Split sizes={[50, 50]} direction="vertical" className="box2">
                <Split className="pane top-pane box21" sizes={[33, 34, 33]}>
                    <Editor
                        language="xml"
                        displayName="HTML"
                        value={html}
                        onChange={setHtml}
                    />
                    <Editor
                        language="css"
                        displayName="CSS"
                        value={css}
                        onChange={setCss}
                    />
                    <Editor
                        language="javascript"
                        displayName="JS"
                        value={js}
                        onChange={setJs}
                    />
                </Split>
                <div className="pane box22">
                    <iframe
                        srcDoc={srcDoc}
                        title="output"
                        sandbox="allow-scripts"
                        frameBorder="0"
                        width="100%"
                        height="100%"
                    />
                </div>
            </Split>
        </div>
    );
}

export default App;
