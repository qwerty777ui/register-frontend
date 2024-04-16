import { useEffect, useState } from "react";
import "../Styles/CategoryChose.css"
import Arrow from "../svg/arrow_up.svg?react";

const CategoryChose = ({ placeHolder, options, setValue }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);

  useEffect(() => {
    const handler = () => setShowMenu(false);

    window.addEventListener("click", handler);
    return() => {
      window.removeEventListener("click", handler);
    };
  });
  const handleInputClick = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const getDisplay = () => {
    if (!selectedValue || selectedValue.length === 0) {
        return placeHolder;
    }
    return selectedValue.label;
};
  
const onItemClick = (option) => {
  setSelectedValue(option);
  if(setValue) setValue(option.value);
};

const isSelected = (option) => {
  if (!selectedValue) {
    return false;
  }

  return selectedValue.value === option.value;
};

    return (
      <div className="dropdown-container">
        <div onClick={handleInputClick} className="dropdown-input">
          {showMenu && (
            <div className="dropdown-menu1">
              {options.map((option) => (
                <div 
                onClick={() => onItemClick(option)}
                key={option.value} 
                className={`dropdown-item ${isSelected(option) && "selected"}`}
                >
                  {option.label}
                </div>
              ))}
            </div>
          )}
          <div className="dropdown-selected-value">{getDisplay()}</div>
          <div className="dropdown-tools">
            <div className="dropdown-tool">
              <Arrow/>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default CategoryChose;