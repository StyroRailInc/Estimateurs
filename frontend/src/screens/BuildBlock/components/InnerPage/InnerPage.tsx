import React, { useState } from "react";
import LeftMenu from "../LeftMenu";
import Summary from "../Summary";
import BuildBlockForm from "../BuildBlockForm";
import "./../../../../global.css";
import "./InnerPage.css";

function InnerPage() {
  const [activeSection, setActiveSection] = useState("buildBlockForm");

  const renderContent = () => {
    switch (activeSection) {
      case "buildBlockForm":
        return <BuildBlockForm setInnerPage={setActiveSection} />;
      case "summary":
        return <Summary />;
      default:
        return <BuildBlockForm setInnerPage={setActiveSection} />;
    }
  };

  return (
    <div className="inner-page">
      <div className="left-menu-container">
        <LeftMenu activeSection={activeSection} onChangeSection={setActiveSection} />
      </div>
      <div className="content">{renderContent()}</div>
      <div className="right-menu" />
    </div>
  );
}

export default InnerPage;
