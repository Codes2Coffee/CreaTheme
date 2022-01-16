import "./loading.scss";
import { XlviLoader } from "react-awesome-loaders";
function Loading({ label = "" }) {
  return (
    <div className="loadCon">
      <h1 style={{ textAlign: "center" }}>{label}</h1>
      <XlviLoader
        boxColors={["#49B78A", "#F59E0B", "#EF4444"]}
        desktopSize={"128px"}
        mobileSize={"100px"}
      />
    </div>
  );
}

export default Loading;
