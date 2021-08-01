import {useRef} from "react";

const PopUpNote = (props) => {
  const textAreaRef = useRef(null);

  const backHandler=()=>{
    props.setIsPopUpOpen(false);
  }
  
  const saveHandler=()=>{
    const t = textAreaRef.current.value;
    console.log (textAreaRef.current.value+ " is our textAreaRef text!");
    props.setPopUpText(t);
    props.setIsPopUpOpen(false);
  }

  return (
    <div className="fixed top-0 left-0 h-screen w-full bg-black bg-opacity-70 flex">
      <div className="relative box w-2/5 h-2/5 my-auto mx-auto bg-white rounded-xl">
        <div className="bg-white h-1/4 pl-2 rounded-xl flex flex-col justify-center">
          Note
        </div>
        <textarea className="my-auto w-full h-1/2 bg-pink-500 resize-none px-2" ref={textAreaRef}>
          
        </textarea>
        <div className="flex flex-row justify-end h-1/4">
          <button className="border rounded-sm my-auto border-gray-400" onClick={backHandler}>
            Back
          </button>
          <button className="border rounded-sm my-auto  mx-2 border-gray-400" onClick={saveHandler}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopUpNote;
