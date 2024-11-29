import React, { useState } from "react";
import LeftMenu from "../LeftMenu";
import BuildDeckForm from "../BuildDeckForm";
import Summary from "../Summary";
import BuildBlockForm from "../BuildBlockForm";

function InnerPage() {
  const [activeSection, setActiveSection] = useState("buildBlockForm");

  const renderContent = () => {
    switch (activeSection) {
      case "buildBlockForm":
        return <BuildBlockForm />;
      case "buildDeckForm":
        return <BuildDeckForm />;
      case "summary":
        return <Summary />;
      default:
        return <BuildBlockForm />;
    }
  };

  return (
    <div className="inner-page">
      <LeftMenu activeSection={activeSection} onChangeSection={setActiveSection} />
      <div className="content">{renderContent()}</div>
    </div>
  );
}

export default InnerPage;
