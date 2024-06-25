import React from "react";
import PropTypes from "prop-types";
import stylePropType from "react-style-proptype";
import { polyfill } from "react-lifecycles-compat";

import Pane from "./Pane";
import Resizer, { RESIZER_DEFAULT_CLASSNAME } from "./Resizer";

function unFocus(document, window) {
  if (document.selection) {
    document.selection.empty();
  } else {
    try {
      window.getSelection().removeAllRanges();
    } catch (e) {}
  }
}

function getDefaultSize(defaultSize, minSize, maxSize, draggedSize) {
  if (typeof draggedSize === "number") {
    const min = typeof minSize === "number" ? minSize : 0;
    const max =
      typeof maxSize === "number" && maxSize >= 0 ? maxSize : Infinity;
    return Math.max(min, Math.min(max, draggedSize));
  }
  if (defaultSize !== undefined) {
    return defaultSize;
  }
  return minSize;
}

function removeNullChildren(children) {
  return React.Children.toArray(children).filter((c) => c);
}

class SplitPane extends React.Component {
  constructor(props) {
    super(props);

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);

    // order of setting panel sizes.
    // 1. size
    // 2. getDefaultSize(defaultSize, minsize, maxSize)

    const { size, defaultSize, minSize, maxSize, primary, split } = props;

    const initialSize = size !== undefined
      ? size
      : getDefaultSize(defaultSize, minSize, maxSize, null);

    const defaultPaneSize = split === "vertical" ? window.innerWidth * 0.5 : window.innerHeight * 0.5;

    this.state = {
      active: false,
      resized: false,
      pane1Size: primary === "first" ? (size !== undefined ? initialSize : defaultPaneSize) : undefined,
      pane2Size: primary === "second" ? (size !== undefined ? initialSize : defaultPaneSize) : undefined,

      // these are props that are needed in static functions. ie: gDSFP
      instanceProps: {
        size,
      },
    };
  }

  componentDidMount() {
    document.addEventListener("mouseup", this.onMouseUp);
    document.addEventListener("mousemove", this.onMouseMove);
    document.addEventListener("touchmove", this.onTouchMove);
    this.setState(SplitPane.getSizeUpdate(this.props, this.state));
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return SplitPane.getSizeUpdate(nextProps, prevState);
  }

  componentWillUnmount() {
    document.removeEventListener("mouseup", this.onMouseUp);
    document.removeEventListener("mousemove", this.onMouseMove);
    document.removeEventListener("touchmove", this.onTouchMove);
  }

  onMouseDown(event) {
    const eventWithTouches = Object.assign({}, event, {
      touches: [{ clientX: event.clientX, clientY: event.clientY }],
    });
    this.onTouchStart(eventWithTouches);
  }

  onTouchStart(event) {
    const { allowResize, onDragStarted, split } = this.props;
    if (allowResize) {
      unFocus(document, window);
      const position =
        split === "vertical"
          ? event.touches[0].clientX
          : event.touches[0].clientY;

      if (typeof onDragStarted === "function") {
        onDragStarted();
      }
      this.setState({
        active: true,
        position,
      });
    }
  }

  onMouseMove(event) {
    const eventWithTouches = Object.assign({}, event, {
      touches: [{ clientX: event.clientX, clientY: event.clientY }],
    });
    this.onTouchMove(eventWithTouches);
  }

  onTouchMove(event) {
    const { allowResize, minSize, onChange, split, step } = this.props;
    const { active, position } = this.state;

    if (allowResize && active) {
      unFocus(document, window);
      const isPrimaryFirst = this.props.primary === "first";
      const ref = isPrimaryFirst ? this.pane1 : this.pane2;
      const ref2 = isPrimaryFirst ? this.pane2 : this.pane1;
      if (ref) {
        const node = ref;
        const node2 = ref2;

        if (node.getBoundingClientRect) {
          const width = node.getBoundingClientRect().width;
          const height = node.getBoundingClientRect().height;
          const current = split === "vertical"
            ? event.touches[0].clientX
            : event.touches[0].clientY;
          const size = split === "vertical" ? width : height;
          let positionDelta = position - current;
          if (step) {
            if (Math.abs(positionDelta) < step) {
              return;
            }
            positionDelta = Math.floor(positionDelta / step) * step;
          }
          let sizeDelta = isPrimaryFirst ? positionDelta : -positionDelta;

          const pane1Order = parseInt(window.getComputedStyle(node).order);
          const pane2Order = parseInt(window.getComputedStyle(node2).order);
          if (pane1Order > pane2Order) {
            sizeDelta = -sizeDelta;
          }

          const maxSize = split === "vertical" ? window.innerWidth * 0.9 : window.innerHeight * 0.9;

          let newSize = size - sizeDelta;
          const newPosition = position - positionDelta;

          if (newSize < minSize) {
            newSize = minSize;
          } else if (newSize > maxSize) {
            newSize = maxSize;
          } else {
            this.setState({
              position: newPosition,
              resized: true,
            });
          }

          if (onChange) onChange(newSize);

          this.setState({
            draggedSize: newSize,
            [isPrimaryFirst ? "pane1Size" : "pane2Size"]: newSize,
          });
        }
      }
    }
  }

  onMouseUp() {
    const { allowResize, onDragFinished } = this.props;
    if (allowResize && this.state.active) {
      if (typeof onDragFinished === "function") {
        onDragFinished();
      }
      this.setState({
        active: false,
      });
    }
  }

  merge = (into, obj) => {
    Object.keys(obj).forEach((key) => {
      if (obj[key] && obj[key].constructor === Object) {
        if (!into[key]) {
          into[key] = {};
        }
        this.merge(into[key], obj[key]);
      } else {
        into[key] = obj[key];
      }
    });
    return into;
  };

  render() {
    const {
      children,
      className,
      split,
      allowResize,
      resizerStyle,
      resizerClassName,
      paneStyle,
      pane1Style,
      pane2Style,
      pane1ClassName,
      pane2ClassName,
      onResizerClick,
      onResizerDoubleClick,
      step,
      minSize,
      maxSize,
    } = this.props;
    const { pane1Size, pane2Size } = this.state;
    const disabledClass = allowResize ? "" : "disabled";
    const resizerClassNamesIncludingDefault = resizerClassName
      ? `${resizerClassName} ${RESIZER_DEFAULT_CLASSNAME}`
      : resizerClassName;

    const style = Object.assign(
      {},
      {
        display: "flex",
        flex: 1,
        height: "100%",
        position: "absolute",
        outline: "none",
        userSelect: "text",
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none",
      }
    );

    if (split === "vertical") {
      this.merge(style, {
        flexDirection: "row",
        left: 0,
        right: 0,
      });
    } else {
      this.merge(style, {
        bottom: 0,
        flexDirection: "column",
        minHeight: "100%",
        top: 0,
        width: "100%",
      });
    }

    const pane1StyleWithSize = Object.assign(
      {},
      paneStyle,
      pane1Style,
      pane1Size !== undefined ? { flex: `0 0 ${pane1Size}px` } : {}
    );
    const pane2StyleWithSize = Object.assign(
      {},
      paneStyle,
      pane2Style,
      pane2Size !== undefined ? { flex: `0 0 ${pane2Size}px` } : {}
    );

    const pane1Classes = ["Pane1", split, pane1ClassName];
    const pane2Classes = ["Pane2", split, pane2ClassName];

    const childrenArray = removeNullChildren(children);

    return (
      <div className={`SplitPane ${className}`} style={style}>
        <Pane
          className={pane1Classes.join(" ")}
          key="pane1"
          eleRef={(node) => {
            this.pane1 = node;
          }}
          size={pane1Size}
          split={split}
          style={pane1StyleWithSize}
        >
          {childrenArray[0]}
        </Pane>
        <Resizer
          className={resizerClassNamesIncludingDefault}
          onClick={onResizerClick}
          onDoubleClick={onResizerDoubleClick}
          onMouseDown={this.onMouseDown}
          onTouchStart={this.onTouchStart}
          key="resizer"
          split={split}
          style={resizerStyle || {}}
        />
        <Pane
          className={pane2Classes.join(" ")}
          key="pane2"
          eleRef={(node) => {
            this.pane2 = node;
          }}
          size={pane2Size}
          split={split}
          style={pane2StyleWithSize}
        >
          {childrenArray[1]}
        </Pane>
      </div>
    );
  }

  static getSizeUpdate(props, state) {
    const newState = {};
    const { instanceProps } = state;

    if (instanceProps.size === props.size && props.size !== undefined) {
      return {};
    }

    const maxSize = props.split === "vertical" ? window.innerWidth * 0.9 : window.innerHeight * 0.9;
    const defaultPaneSize = props.split === "vertical" ? window.innerWidth * 0.5 : window.innerHeight * 0.5;

    const newSize = props.size !== undefined
      ? Math.min(props.size, maxSize)
      : getDefaultSize(
          props.defaultSize || defaultPaneSize,
          props.minSize,
          Math.min(props.maxSize, maxSize),
          state.draggedSize
        );

    if (props.size !== undefined) {
      newState.draggedSize = newSize;
    }

    const isPanel1Primary = props.primary === "first";

    newState[isPanel1Primary ? "pane1Size" : "pane2Size"] = newSize;
    newState[isPanel1Primary ? "pane2Size" : "pane1Size"] = undefined;

    newState.instanceProps = { size: props.size };

    return newState;
  }
}

SplitPane.propTypes = {
  allowResize: PropTypes.bool,
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
  className: PropTypes.string,
  minSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  maxSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  onDragFinished: PropTypes.func,
  onDragStarted: PropTypes.func,
  primary: PropTypes.oneOf(["first", "second"]),
  resizerClassName: PropTypes.string,
  resizerStyle: stylePropType,
  split: PropTypes.oneOf(["vertical", "horizontal"]),
  step: PropTypes.number,
  style: stylePropType,
};

SplitPane.defaultProps = {
  allowResize: true,
  minSize: 50,
  primary: "first",
  split: "vertical",
};

export default SplitPane;
