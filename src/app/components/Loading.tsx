import React, { memo } from "react";
import "./styles.css";

const Loading = memo(function Loading() {
  return (
    <>
      <div className="align-balls bouncing-loader">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </>
  );
});

export default Loading;
