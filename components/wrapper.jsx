import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ModuleComposant } from "./modale-composant";
import { NavBar } from "./navbar";
const Wrapper = () => {
  const [showModale, setShowModale] = useState(false);
  return (
    <div>
      <NavBar
        OpenModale2={() => setShowModale(true)}
        OpenModale1={() => setShowModale(true)}
      />

      {showModale &&
        createPortal(
          <ModuleComposant CloseModale={() => setShowModale(false)} />,
          document.body
        )}
    </div>
  );
};

export default Wrapper;
