import React, { useEffect, useState } from "react";
import styles from "./Header.module.scss";
import { NavLinks } from "./nav-links/NavLinks";
import Menu from "../../assets/icons/menu.svg?react"; // Based on solution https://doray.me/articles/use-svgs-as-react-components-in-astro-MNUvh
import { Drawer } from "./drawer/Drawer";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = window.innerWidth < 768;

  const onPressDrawer = () => {
    console.log("Drawer pressed");
    setIsOpen(!isOpen);
  };
  useEffect(() => {
    if (!isMobile) {
      setIsOpen(false);
    }
  }, [isMobile]);
  return (
    <header>
      <h2>
        <a className={styles["header-logo"]} href="/">
          Hector Matus
        </a>
      </h2>
      {!isMobile && <NavLinks isMobile={false} />}
      {isMobile && (
        <button className={"cursor-pointer"} onClick={onPressDrawer}>
          <Menu />
        </button>
      )}
      {isMobile && <Drawer isOpen={isOpen} />}
    </header>
  );
};
