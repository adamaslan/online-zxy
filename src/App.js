
import React from "react";

// import Split from "react-split";
import SplitPane from "react-split-pane";
import "./App.css";
import Title from "./Title";
import "./Title.css";
import Footer from "./components/Footer";
import "./components/Footer.css";

function App() {
  return (
    <div className="container">
      <div className="title">
        <Title />
      </div>
      <div className="content">
        <SplitPane
          split="vertical"
          minSize={10}
          maxSize={-100}
          defaultSize={parseInt(localStorage.getItem("splitPos"), 10)}
          onChange={(size) => localStorage.setItem("splitPos", size)}
        >
          <div
            style={{
              backgroundColor: "chartreuse",
              // height: "1000px",
              border: "3% solid green",
              // 1st pane styling here
            }}
          >
            <h2>Nazlie Efe Our Featured Artist</h2>
            <h2>She makes: </h2>
            <h2>
              -installations
              <br />
              -art works with bees wax
              <br />
              -works about her father
              <br />
              -works relating to her turkish heritage
                <br />
                -influenced by their time at Pratt
            </h2>
          </div>
          <div
            style={{
              backgroundColor: "olive",

              font: "utopia_seriff",

              border: "6% solid azue",
            }}
          >
            <h2>
              Check out her website
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://podcasts.apple.com/us/podcast/why-this-universe/id1523312400"
              >
                <p> Naz </p>
              </a>

            </h2>
          </div>
          <div
            style={{
              backgroundColor: "red",

              font: "utopia_seriff",

              border: "3% solid black",
            }}
          >
            Check out more on her insta @
          </div>
        </SplitPane>
      </div>
      <div className="other-guy">
        <p> Stay tuned for the next exhibit in this Online </p>
      </div>
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
}

export default App;
