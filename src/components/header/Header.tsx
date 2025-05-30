import React, { useEffect, useState } from "react";
import styles from "./Header.module.scss";
import { NavLinks } from "./nav-links/NavLinks";
import Menu from "../../assets/icons/menu.svg?react"; // Based on solution https://doray.me/articles/use-svgs-as-react-components-in-astro-MNUvh
import { Drawer } from "./drawer/Drawer";
import { LanguagePicker } from "../language-picker/LanguagePicker";
import { useTranslations } from "../../i18n/utils";
import { ui } from "../../i18n/ui";

interface HeaderProps {
  currentLang?: string;
  currentPath?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang = "en",
  currentPath = "/",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = window.innerWidth < 768;
  const t = useTranslations(currentLang as keyof typeof ui);

  const translations = {
    home: t("nav.home"),
    about: t("nav.about"),
    contact: t("nav.contact"),
  };

  const onPressDrawer = () => {
    setIsOpen(!isOpen);
  };
  const onClickNavs = () => {
    setIsOpen(false);
  };
  useEffect(() => {
    if (!isMobile) {
      setIsOpen(false);
    }
  }, [isMobile]);

  return (
    <header className={styles.headerContainer}>
      <h2>
        <a className={styles["header-logo"]} href="/">
          Hector Matus
        </a>
      </h2>
      <div className={styles.headerRight}>
        {!isMobile && <NavLinks isMobile={false} translations={translations} />}
        <LanguagePicker currentLang={currentLang} currentPath={currentPath} />
        {isMobile && (
          <button
            aria-label="Drawer menu"
            className={"cursor-pointer"}
            onClick={onPressDrawer}
          >
            <Menu />
          </button>
        )}
      </div>
      {isMobile && (
        <Drawer
          isOpen={isOpen}
          onClick={onClickNavs}
          translations={translations}
        />
      )}
    </header>
  );
};
