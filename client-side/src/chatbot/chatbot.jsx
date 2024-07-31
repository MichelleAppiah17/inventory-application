import React, { useEffect } from "react";

function Chatbot() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.landbot.io/landbot-3/landbot-3.0.0.js";
    script.async = true;
    script.onload = () => {
      const myLandbot = new window.Landbot.Container({
        container: "#landbot-widget",
        configUrl:
          "https://storage.googleapis.com/landbot.online/v3/H-2569706-WO2IQWXN8HN3E8SP/index.json",
      });
    //   replace the configUrl with yours, this is mine, so that you can train it based on the books you have
    };
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <div className='flex-1 p-20'>
      <h1>Book Recommendation Bot</h1>
      <div
        id='landbot-widget'
        style={{
          height: "500px",
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
        }}></div>
    </div>
  );
}

export default Chatbot;
