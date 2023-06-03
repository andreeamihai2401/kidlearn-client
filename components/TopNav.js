import { useState, useEffect, useContext } from "react";
import { Menu } from "antd";
import Link from "next/link";
import {
  AppstoreOutlined,
  LoginOutlined,
  UserAddOutlined,
  CoffeeOutlined,
  CarryOutOutlined,
  TeamOutlined,
} from "@ant-design/icons";

import { Context } from "../context";
import axios from "axios";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const { Item, SubMenu, ItemGroup } = Menu;

const TopNav = () => {
  const [current, setCurrent] = useState("");

  const { state, dispatch } = useContext(Context);

  const { user } = state;

  const router = useRouter();

  useEffect(() => {
    process.browser && setCurrent(window.location.pathname);
  }, [process.browser && window.location.pathname]);

  const logout = async () => {
    dispatch({ type: "LOGOUT" });
    window.localStorage.removeItem("user");
    const { data } = await axios.get("/api/logout");
    toast(data.message);
    router.push("/login");
  };

  return (
    <Menu mode="horizontal" selectedKeys={[current]} className="menu-style">
      <Item
        key="/"
        onClick={(e) => setCurrent(e.key)}
        icon={<AppstoreOutlined />}
        style={{ color: "white" }}
      >
        <Link legacyBehavior href="/">
          <a style={{ color: "white", textDecoration: "none" }}>App</a>
        </Link>
      </Item>

      {user && user.role && user.role.includes("Instructor") ? (
        <Item
          key="/instructor/course/create"
          onClick={(e) => setCurrent(e.key)}
          icon={<CarryOutOutlined />}
          style={{ color: "white" }}
        >
          <Link legacyBehavior href="/instructor/course/create">
            <a style={{ color: "white", textDecoration: "none" }}>
              Create Course
            </a>
          </Link>
        </Item>
      ) : (
        <Item
          key="/user/become-instructor"
          onClick={(e) => setCurrent(e.key)}
          icon={<TeamOutlined />}
          style={{ color: "white" }}
        >
          <Link legacyBehavior href="/user/become-instructor">
            <a style={{ color: "white", textDecoration: "none" }}>
              Become Instructor
            </a>
          </Link>
        </Item>
      )}

      {user === null && (
        <>
          <Item
            key="/login"
            onClick={(e) => setCurrent(e.key)}
            icon={<LoginOutlined />}
            style={{ color: "white" }}
          >
            <Link legacyBehavior href="/login">
              <a style={{ color: "white", textDecoration: "none" }}>Login</a>
            </Link>
          </Item>

          <Item
            key="/register"
            onClick={(e) => setCurrent(e.key)}
            icon={<UserAddOutlined />}
            style={{ color: "white" }}
          >
            <Link legacyBehavior href="/register">
              <a style={{ color: "white", textDecoration: "none" }}>Register</a>
            </Link>
          </Item>
        </>
      )}

      {user && user.role && user.role.includes("Instructor") && (
        <Item
          key="/instructor"
          onClick={(e) => setCurrent(e.key)}
          icon={<TeamOutlined />}
          style={{
            color: "white",
          }}
        >
          <Link legacyBehavior href="/instructor">
            <a style={{ color: "white", textDecoration: "none" }}>Instructor</a>
          </Link>
        </Item>
      )}

      {user && (
        <SubMenu
          icon={<CoffeeOutlined />}
          title={user && user.name}
          key="submenu"
          style={{
            color: "white",
            textDecoration: "none",
            marginLeft: "auto ",
          }}
        >
          <ItemGroup>
            <Item key="user">
              <Link legacyBehavior href="/user">
                <a style={{ textDecoration: "none" }}>Dashboard</a>
              </Link>
            </Item>
            <Item onClick={logout}>Logout</Item>
          </ItemGroup>
        </SubMenu>
      )}
    </Menu>
  );
};

export default TopNav;
