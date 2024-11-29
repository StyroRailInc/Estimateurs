import React, { Children, useState } from "react";
import InnerPage from "./components/InnerPage";

interface BuildBlockProps {}

const BuildBlock: React.FC<BuildBlockProps> = () => {
  return (
    <div>
      <InnerPage />
    </div>
  );
};

export default BuildBlock;
