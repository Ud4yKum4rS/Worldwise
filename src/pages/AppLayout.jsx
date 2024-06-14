// import AppNav from "../components/AppNav";
import Sidebar from "../components/Sidebar";
import Map from "../components/Map";
import User from "../components/User";
import styles from "./AppLayout.module.css";
function AppLayout() {
  return (
    <div className={styles.app}>
      {/* <AppNav /> */}
      <Sidebar />
      <User></User>
      <Map></Map>
    </div>
  );
}

export default AppLayout;
