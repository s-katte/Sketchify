import React, { useState, useEffect } from "react";
import Editor from "./Editor";
import useLocalStorage from "../hooks/useLocalStorage";
import Split from "react-split";

function App() {
    const [html, setHtml] = useLocalStorage("html", "");
    const [css, setCss] = useLocalStorage("css", "");
    const [js, setJs] = useLocalStorage("js", "");
    const [title, setTitle] = useState("Untitled")
    const [srcDoc, setSrcDoc] = useState("");

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
        document.title = 'Sketchify - '+title
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
                <input className='title' id='title-input' placeholder = 'Untitled' onChange={() => setTitle(document.getElementById('title-input').value)} autoComplete='off'/>
                <div className='logo'>Sketchify</div>
                <div className='download-btn'>
                    <a href=" " id="download-btn-html" onClick={downloadHtml}>
                        <img src={require('../assets/htmllogo.png')} alt="html-logo" className='button' title="Download .html" />
                    </a>
                    <a href=" " id="download-btn-css" onClick={downloadCss}>
                        <img src={require('../assets/csslogo.png')} alt="css-logo" className='button' title="Download .css" />
                    </a>
                    <a href=" " id="download-btn-js" onClick={downloadJs}>
                        <img src={require('../assets/jslogo.png')} alt="js-logo" className='button' title="Download .js" />
                    </a>
                </div>
            </nav>
            <Split sizes={[50, 50]} direction="vertical" className="box2">
                <Split className="pane top-pane" sizes={[33, 34, 33]}>
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
                <div className="pane">
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
