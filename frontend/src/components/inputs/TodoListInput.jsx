import React, { useState } from "react";
import { HiOutlineTrash} from "react-icons/hi";
import { HiPlus } from "react-icons/hi2";

const TodoListInput = ({ todoList, setTodoList }) => {
  const [option, setOption] = useState([]);

  const handleAddOption = (option) => {
    if (option.trim()) {
      setTodoList([...todoList, option.trim()]);
      setOption("");
    }
  };

  //function to remove an option
  const handleDeleteOption = (index) => {
    const updatedArr = todoList.filter((_, i) => i !== index);
    setTodoList(updatedArr);
  };
  return (
    <div>
      {todoList.map((item, index) => (
        <div
          key={index}
          className="flex justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mb-3 mt-2"
        >
          <p className="text-xs text-black">
            <span className="text-xs text-gray-400 font-semibold mr-2">
              {index < 9 ? `0${index + 1}.` : `${index + 1}.`}
            </span>
            {item}
          </p>
          <button
            className="cursor-pointer"
            type="button"
            onClick={() => handleDeleteOption(index)}
          >
            <HiOutlineTrash className="text-lg text-red-500" />
          </button>
        </div>
      ))}

      <div className=" flex items-center gap-5 mt-4">
        <input
          type="text"
          value={option}
          placeholder="Enter Task"
          className="w-full text-[13px] text-black bg-white rounded-md border border-gray-100 outline-none px-3 py-2 mt-2"
          onChange={(e) => setOption(e.target.value)}
        />
        <button
          className="card-btn text-nowrap"
          type="button"
          onClick={() => handleAddOption(option)}
        >
          <HiPlus className="text-lg" />
          Add
        </button>
      </div>
    </div>
  );
};

export default TodoListInput;
