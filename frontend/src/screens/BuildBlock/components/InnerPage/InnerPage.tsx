import { useState } from "react";
import LeftMenu from "../LeftMenu";
import Summary from "../Summary";
import BuildBlockForm from "../BuildBlockForm";
import "./../../../../global.css";
import "./InnerPage.css";
import { Routes } from "src/interfaces/routes";

function InnerPage() {
  const [activeSection, setActiveSection] = useState<string>(Routes.BUILDBLOCK_FORM);

  const renderContent = () => {
    switch (activeSection) {
      case Routes.BUILDBLOCK_FORM:
        return <BuildBlockForm setInnerPage={setActiveSection} />;
      case Routes.SUMMARY:
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
