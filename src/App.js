
import React from "react";

// import Split from "react-split";
import SplitPane from "react-split-pane";
import "./App.css";
import Title from "./Title";
import "./Title.css";
import Footer from "./components/Footer";
import "./components/Footer.css";
import photo from "./assets/roman1.jpeg";
import photo2 from "./assets/roman2.jpeg"
function App() {
  return (
    <div className="container">
      <div className="title">
        <Title />
      </div>
      <img className="photo"
             src={photo2} alt="painting" />
      <div className="content">
        <SplitPane
          split="vertical"
          minSize={10}
          maxSize={-500}
          defaultSize={parseInt(localStorage.getItem("splitPos"), 5)}
          onChange={(size) => localStorage.setItem("splitPos", size)}
        >
          <div
            style={{
              backgroundColor: "#FF00B7",
              // height: "1000px",
              'margin-left': "1rem",
              border: "3% solid green",
              'text-wrap': 'wrap',
              // 1st pane styling here
            }}
          >
             <h2>
              Narratives Re-imagined explores the work of Roman Kalinovski. <br/> <br/> The paintings are inspired from digital and analog video stills bringing yet another new transformation of the original figure <br/>  once optimized for view in a movie theater and now within the confines of oil on canvas.  <br/> <br/>ZXY Gallery adds to this changing experience via its uniquely styled online gallery.
              <br/> <br/>
            Check out Roman's instagram @kalinova828  or check out his website for more information


              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.romankalinovski.com/#/studies-for-an-impossible-portrait/"
              > <u> Here </u>
              </a>
            </h2>
          </div>
          <div
            style={{
              backgroundColor: "#00EAFF",

              font: "utopia_seriff",

              border: "6% solid",
              'margin-right': "3rem",
            }}
          >
            <h2>
            Roman Kalinovski
            is an artist and writer. He has a BFA in painting from Syracuse University and an MFA from Pratt Institute.  
              <br /> <br/>
              Kalinovski’s work has been exhibited at spaces across New York and beyond, <br/> including SHIM Art Network, DigiAna Studio, Space 776, Galerie Manqué, and the Elizabeth Foundation for the Arts. 
              <br /> <br/>
              His writing on art, culture, and technology has been featured in Artcritical, Hyperallergic, Art Spiel, <br/> Quiet Lunch, and Digitally Downloaded, among other publications.
                <br /> <br/>
                He has presented papers at international conferences, including Electronic Literature Organization conferences  <br/>in Victoria, BC, and Montreal, QC, as well as Global Posthuman Symposiums at NYU. <br/> He lives and works in Brooklyn.
                <br /> <br/>
           
            </h2>
         
          </div>
          <div
            style={{
              backgroundColor: "red",

              font: "utopia_seriff",

              border: "3% solid black",
            }}
          >
              <h2>
             </h2>
          </div>
        </SplitPane>
      </div>
      <div className="other-guy2">
        <h2> <span>      </span></h2>
      </div>
      <div className="other-guy">
        <h2> Stay tuned for the next exhibit in ZXY's online gallery</h2>
      </div>
        <img className="photo"
             src={photo} alt="installation" />
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
}

export default App;
