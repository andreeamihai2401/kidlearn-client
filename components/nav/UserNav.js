import Link from "next/link";
import { useState, useEffect } from "react";

const UserNav = () => {
  const [current, setCurrent] = useState("");

  useEffect(() => {
    process.browser && setCurrent(window.location.pathname);
  }, [process.browser && window.location.pathname]);

  return (
    <div className="user-nav">
      <div className="nav flex-column nav-pills">
        <Link legacyBehavior href="/user">
          <a className={`nav-link ${current === "/user" && "active"}`}>
            Dashboard
          </a>
        </Link>
      </div>
    </div>
  );
};

export default UserNav;
