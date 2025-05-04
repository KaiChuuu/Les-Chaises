import { useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

type CustomDropdownProps = {
  options: number[];
  onSelect: (option: number) => void;
  initial: number;
};

const CustomDropdown = ({
  options,
  onSelect,
  initial,
}: CustomDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(initial);

  const handleSelect = (option: number) => {
    setSelected(option);
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div className="relative w-60">
      <button
        className="w-20 bg-white font-bold border border-black p-2 text-left flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div>{selected || initial}</div>
        <div className="ml-auto">
          <MdKeyboardArrowDown size={28} />
        </div>
      </button>

      {isOpen && (
        <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 shadow-lg max-h-60 overflow-auto">
          {options.map((option, index) => (
            <li
              className={`p-2 hover:bg-gray-100 cursor-pointer ${
                index === selected - 1 ? "font-bold bg-gray-100" : ""
              }`}
              key={index}
              onClick={() => handleSelect(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomDropdown;
