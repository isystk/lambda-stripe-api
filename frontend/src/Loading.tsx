import React, { useEffect } from "react";

const Loading = ({ loading = false }) => {
  return (
      <div id="loading" className="position-fixed top left w-100 h-100" style={{top: 0, left: 0, zIndex: 99999, display: loading ? 'block': "none"}}>
        <div className="spinner-border text-black position-absolute" style={{width: "50px", height: "50px", bottom: "50px", right: "50px" }} role="status">
          <span className="sr-only"></span>
        </div>
      </div>
  );
};

export default Loading;