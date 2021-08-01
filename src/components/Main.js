import { useState } from "react";

import Canvas from "./Canvas";
import PopUpNote from "./PopUpNote";
const Main = () => {
  const [tool, setTool] = useState();
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [popUpText, setPopUpText] = useState(false);

  return (
    <main className="my-5 flex flex-row h-screen">
      <div className="flex-none w-12 px-2 max-w-xs ml-5 my-10 bg-white border-2 border-grey-500 rounded-3xl hover:border-blue-300">
        <div className="text-center h-full flex flex-col justify-evenly ">
          <img
            className="cursor-pointer"
            src="/pen-fill.svg"
            alt="a pen"
            placeholder="a pen"
            onClick={() => {
              setTool("pen");
            }}
          />
          <img
            className="cursor-pointer"
            src="/textarea-t.svg"
            alt="a textarea"
            onClick={() => {
              setTool("text");
            }}
          />
          <img
            className="cursor-pointer"
            src="/sticky.svg"
            alt="a Post-It Note"
            onClick={() => {
              setTool("note");
              setIsPopUpOpen(true);
            }}
          />
          <img
            className="cursor-pointer"
            src="/eraser-fill.svg"
            alt="an eraser"
            onClick={() => {
              setTool("eraser");
            }}
          />
        </div>
      </div>
      <div className=" mx-auto ">
        <Canvas
          tool={tool}
          setTool={setTool}
          popUpText={popUpText}
          setPopUpText={setPopUpText}
        />
        {isPopUpOpen && (
          <PopUpNote
            setIsPopUpOpen={setIsPopUpOpen}
            setPopUpText={setPopUpText}
          />
        )}
      </div>
    </main>
  );
};

export default Main;
