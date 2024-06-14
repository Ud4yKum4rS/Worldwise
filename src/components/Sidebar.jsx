import styles from "./Sidebar.module.css";
import Logo from "./Logo";
import AppNav from "./AppNav";
import { Outlet } from "react-router-dom";
function Sidebar() {
  return (
    <div>
      <div className={styles.sidebar}>
        <Logo></Logo>
        <AppNav></AppNav>
        <Outlet />

        <footer className={styles.footer}>
          <p className={styles.copyright}>
            &copy; Copyright {new Date().getFullYear()} by WorldWise.inc
          </p>
        </footer>
      </div>
    </div>
  );
}

export default Sidebar;
