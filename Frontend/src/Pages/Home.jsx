import React, { useState, useContext } from "react";
import ProductsList from "../Components/ProductsList";
import Form from "../Components/Form.jsx";
import { FaPlus } from "react-icons/fa";

function Home() {
  const [isFormVisible, setIsFormVisible] = useState(false);
  //   const themeData = useContext(ThemeContext);
  //   const { theme, toggleTheme } = themeData;

  const controlFormVisibility = () => {
    setIsFormVisible((prevState) => !prevState);
  };
  return (
    <div className={`home p-8 z-0 relative`}>
      <button
        disabled={isFormVisible}
        onClick={controlFormVisibility}
        className={`${
          isFormVisible ? "cursor-not-allowed" : "cursor-pointer"
        } flex items-center justify-center px-4 absolute top-0 right-4 py-2 bg-slate-400`}
      >
        <FaPlus className="mr-1" />
        New Product
      </button>
      {isFormVisible && (
        <Form
          controlFormVisibility={controlFormVisibility}
          isFormVisible={isFormVisible}
        />
      )}
      <div className={`${isFormVisible === true ? "blur-md" : "blur-none"}`}>
        <ProductsList />
      </div>
    </div>
  );
}

export default Home;
