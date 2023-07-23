import { use } from "react";
import FormInfoBox from "./FormInfoBox";
import LogoUpload from "./LogoUpload";

const Index = () => {
  return (
    <div className="widget-content">
      <LogoUpload />
      {/* End logo and cover photo components */}

      <FormInfoBox />
      {/* info box */}
    </div>
  );
};

export default Index;
