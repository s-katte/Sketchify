import React from "react";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/addon/hint/show-hint.css";

import "codemirror/mode/xml/xml";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/css/css";

import "codemirror/addon/hint/css-hint";
import "codemirror/addon/hint/html-hint";
import "codemirror/addon/hint/javascript-hint";

import "codemirror/addon/hint/show-hint";
import "codemirror/addon/edit/closebrackets";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/lint/lint";
import { Controlled as ControlledEditor } from "react-codemirror2";

const LIST_SUGGESTION_TRIGGERLESS_KEY = ['Shift', 'Enter', 'Tab', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

export default function Editor(props) {
    const { language, displayName, value, onChange } = props;

    function handleChange(editor, data, value) {
        onChange(value);
    }

    function handleKeyDown(editor, event) {
        if (
            !editor.state.completionActive && !LIST_SUGGESTION_TRIGGERLESS_KEY.includes(event.key)
        ) {
            editor.showHint({ completeSingle: false });
        }
    }

    return (
        <div className="editor-container">
            <div className="editor-title">{displayName}</div>
            <ControlledEditor
                onBeforeChange={handleChange}
                onKeyDown={handleKeyDown}
                value={value}
                className="code-mirror-wrapper"
                options={{
                    mode: language,
                    theme: "material",
                    lineWrapping: true,
                    lint: true,
                    lineNumbers: true,
                    autoCloseTags: true,
                    matchBrackets: true,
                    autoCloseBrackets: true
                }}
            />
        </div>
    );
}
