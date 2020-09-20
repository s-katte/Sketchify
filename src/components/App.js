import React from "react";
import Editor from "./Editor";

function App() {
  return (
    <>
      <div className="pane top-pane">
        <Editor />
        <Editor />
        <Editor />
      </div>
      <div className="pane">
        <iframe
          title="output"
          sandbox="allow-scripts"
          frameborder="0"
          width="100%"
          height="100%"
        />
      </div>
    </>
  );
}

export default App;
