import React, { useRef, useEffect, useCallback } from "react";
import { Parallax, ParallaxLayer } from "react-spring/renderprops-addons";
import Scene from "./components/Scene";
import VisibilitySensor from "./components/VisibilitySensor";
import { Spring } from "react-spring/renderprops";

import "./App.css";

const items = [
  {
    title: "Lorem ipsum dolor",
    description:
      "Nulla vestibulum orci eu nunc pharetra accumsan. Mauris et nulla tempus, volutpat purus eget, bibendum est.",
  },
  {
    title: "Mauris mollis",
    description:
      "Malesuada nibh euismod ac. Ut bibendum felis justo, vitae vehicula ex mattis vitae. Quisque vulputate justo varius odio viverra",
  },
  {
    title: "Duis vitae",
    description:
      "Morbi pharetra erat nec quam viverra pretium. Nullam in massa et mi condimentum pharetra vitae et risus",
  },
];

var colorArray = [
  "#FF6633",
  "#FFB399",
  "#FF33FF",
  "#FFFF99",
  "#00B3E6",
  "#E6B333",
  "#3366E6",
];

function App() {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isPushed, setIsPushed] = React.useState(false);
  let parallax;

  function onChange(visible, index) {
    console.log(visible);
    console.log(index);
    if (visible) {
      setActiveIndex(index);
    }
  }

  function setPushed(state) {
    setIsPushed(state);
    console.log(isPushed);
  }
  return (
    <>
      <div className="frame">
        <h1 className="frame__title">Click Webgl Shader</h1>
        <div className="frame__links"></div>
        <div className="frame__nav">
          <a
            className="frame__link"
            href="https://isengupt.github.io/fiber-website/"
          >
            Previous
          </a>
          <a className="frame__link" href="#">
            Resume
          </a>
          <a
            className="frame__link"
            href="https://github.com/isengupt/full-distortion"
          >
            GitHub
          </a>
        </div>
      </div>
      <div className="container">
        <Scene
          activeIndex={activeIndex}
          isPushed={isPushed}
          setPushed={setIsPushed}
        />
        <Parallax pages={3} ref={(ref) => (parallax = ref)}>
          {items.map((item, index) => (
            <div>
              <ParallaxLayer
                offset={index}
                speed={1.2}
                factor={1}
                className="parallax__main"
                key={index}
              >
                <VisibilitySensor
                  partialVisibility
                  onChange={(e) => onChange(e, index)}
                >
                  {({ isVisible }) => (
                    <Spring
                      delay={0}
                      to={{
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible
                          ? "translateY(0)"
                          : "translateY(-100px)",
                      }}
                    >
                      {(props) => (
                        <>
                          <h2 style={{ ...props }}>{item.title}</h2>
                          <p style={{ ...props }}>{item.description}</p>
                        </>
                      )}
                    </Spring>
                  )}
                </VisibilitySensor>
              </ParallaxLayer>
            </div>
          ))}
        </Parallax>
      </div>
    </>
  );
}

export default App;
