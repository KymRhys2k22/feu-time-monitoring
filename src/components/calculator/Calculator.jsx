import React from "react";
import Calculator from "react-cute-calculator/dist/index.esm.js";

const AppCalculator = () => {
  return (
    <Calculator
      theme="blue"
      initialValue=""
      precision={0}
      disableKeyboard={false}
      showHeader={true}
      headerText="Calculator"
      fontSize="40px"
      className="my-shadow"
    />
  );
};

export default AppCalculator;
