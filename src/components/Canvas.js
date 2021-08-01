import { useRef, useEffect, useState } from "react";
import { Stage, Layer, Line } from "react-konva";

const Canvas = (props) => {
  const [tool, setTool] = useState(props.tool);
  const [lines, setLines] = useState([]);
  const isDrawing = useRef(false);
  const containerRef = useRef(null);

  const [height, setHeight] = useState(400);
  const [width, setWidth] = useState(600);

  //to identify elements
  const [textAreaCounter, setTextAreaCounter] = useState(0);
  const [noteCounter, setNoteCounter] = useState(0);

  useEffect(() => {
    const { offsetHeight, offsetWidth } = containerRef.current;
    setHeight(offsetHeight);
    setWidth(offsetWidth);
  }, []);

  //drop a note on the screen.
  useEffect(() => {
    setTool(props.tool);
    if (tool === "note" && props.popUpText.length > 0) {
      const textArea = document.createElement("textarea");
      textArea.value = props.popUpText;

      textArea.className =
        "textArea textArea rounded-lg bg-pink-500 hover:cursor-pointer hover:border hover:border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-600 resize " +
        noteCounter;
      textArea.style.position = "absolute";
      textArea.style.left = 350 + "px";
      textArea.style.top = 250 + "px";
      containerRef.current.appendChild(textArea);
      // textArea.focus();

      setNoteCounter((prev) => prev + 1);
      props.setTool("");
      props.setPopUpText("");
    }
  }, [props, noteCounter, tool]);

  //handnling textareas with tools
  useEffect(() => {
    const textAreas = document.querySelectorAll(".textArea");
    if (textAreas.length > 0) {
      textAreas.forEach((elem) => {
        elem.addEventListener("click", (e) => {
          if (tool === "eraser") {
            e.target.remove();
          } else if (tool !== "text") {
            
            e.target.readOnly = true;
          } else if (tool === "text") {

            e.target.focus();
            e.target.readOnly = false;
          }
        });
      });
    }
  });

  //dragging
  useEffect(() => {
    if (containerRef.current !== null) {
      containerRef.current.addEventListener("click", (e) => {
        if (e.target && e.target.tagName === "TEXTAREA" && tool !== "eraser") {
          const dragItem = e.target;
          const container = containerRef.current;
          let active = false;
          let currentX;
          let currentY;
          let initialX;
          let initialY;
          let xOffset = 0;
          let yOffset = 0;

          const dragStart = (e) => {
            if (e.type === "touchstart") {
              initialX = e.touches[0].clientX - xOffset;
              initialY = e.touches[0].clientY - yOffset;
            } else {
              initialX = e.clientX - xOffset;
              initialY = e.clientY - yOffset;
            }

            if (e.target === dragItem) {
              active = true;
            }
          };

          const dragEnd = (e) => {
            initialX = currentX;
            initialY = currentY;

            active = false;
          };

          const drag = (e) => {
            if (active) {
              e.preventDefault();

              if (e.type === "touchmove") {
                currentX = e.touches[0].clientX - initialX;
                currentY = e.touches[0].clientY - initialY;
              } else {
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
              }

              xOffset = currentX;
              yOffset = currentY;

              setTranslate(currentX, currentY, dragItem);
            }
          };

          const setTranslate = (xPos, yPos, el) => {
            el.style.transform =
              "translate3d(" + xPos + "px, " + yPos + "px, 0)";
          };

          container.addEventListener("touchstart", dragStart, false);
          container.addEventListener("touchend", dragEnd, false);
          container.addEventListener("touchmove", drag, false);

          container.addEventListener("mousedown", dragStart, false);
          container.addEventListener("mouseup", dragEnd, false);
          container.addEventListener("mousemove", drag, false);
        } else {
        }
      });
    }
  });

  //pen/eraser actions
  const handleMouseDown = (e) => {
    if (tool === "pen" || tool === "eraser") {
      isDrawing.current = true;
      const pos = e.target.getStage().getPointerPosition();
      setLines([...lines, { tool, points: [pos.x, pos.y] }]);
    }
  };
  const handleMouseMove = (e) => {
    if (!isDrawing.current) {
      return;
    }
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    lastLine.points = lastLine.points.concat([point.x, point.y]);
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };
  const handleMouseUp = () => {
    if (tool === "pen" || tool === "eraser") isDrawing.current = false;
  };

  const handlleClicksAndTextArea = (e) => {
    if (tool === "text") {
      const clientX = e.evt.clientX;
      const clientY = e.evt.clientY;

      const textArea = document.createElement("textarea");
      textArea.value = "";
      textArea.className =
        " textArea textArea rounded-lg bg-transparent hover:cursor-pointer hover:border hover:border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-600 " +
        textAreaCounter;
      textArea.style.resize = "none";
      textArea.style.position = "absolute";
      textArea.style.left = clientX + "px";
      textArea.style.top = clientY + "px";
      containerRef.current.appendChild(textArea);

      textArea.focus();
      setTextAreaCounter((prev) => prev + 1);
      props.setTool("");
    }
  };

  return (
    <div
      id="container-parent"
      className="flex-1 h-full w-3/ mx-auto bg-white"
      ref={containerRef}
    >
      <div
        id="pseudo-container"
        className="flex-1 h-full w-3/ mx-auto bg-white"
        onMouseOver={(e) => {
          if (tool === "pen" || tool === "eraser") {
            e.target.style.cursor = "pointer";
          } else if (tool === "text") {
            e.target.style.cursor = "text";
          } else if (tool === "") {
            e.target.style.cursor = "default";
          }
        }}
      >
        <Stage
          width={width}
          height={height}
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onMouseup={handleMouseUp}
          onClick={handlleClicksAndTextArea}
        >
          <Layer>
            {lines.map((line, i) => (
              <Line
                key={i}
                points={line.points}
                stroke="#df4b26"
                strokeWidth={10}
                tension={0.5}
                lineCap="round"
                globalCompositeOperation={
                  line.tool === "eraser" ? "destination-out" : "source-over"
                }
              />
            ))}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default Canvas;
