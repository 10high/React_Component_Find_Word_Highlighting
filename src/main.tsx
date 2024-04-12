import React from "react";
import ReactDOM from "react-dom/client";
import TextAreaWithFindHighlighting from "./TextAreaWithFindHighlighting/TextAreaWithFindHighlighting.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <TextAreaWithFindHighlighting
      wordsToHighlight={["test"]}
      isCaseSensitive={false}
      textAreaFormDataName="findWordTextArea"
      useRegularExpression={false}
    />
  </React.StrictMode>
);
