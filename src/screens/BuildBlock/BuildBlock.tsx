import React, { useReducer } from "react";
import InnerPage from "./components/InnerPage";

interface BuildBlockProps {}

const BuildBlock: React.FC<BuildBlockProps> = () => {
  return (
    <main>
      <InnerPage />
    </main>
  );
};

export default BuildBlock;
