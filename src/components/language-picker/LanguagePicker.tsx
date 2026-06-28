import React from "react";
import { languages } from "../../i18n/ui";
import { supportedLanguages } from "src/i18n/utils";
import styles from "./LanguagePicker.module.scss";

interface LanguagePickerProps {
  currentLang: string;
  currentPath: string;
}

export const LanguagePicker: React.FC<LanguagePickerProps> = ({
  currentLang,
  currentPath,
}) => {
  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newLang = event.target.value;

    let path = currentPath;

    const pathSegments = path.split("/").filter(Boolean);
    const firstSegment = pathSegments[0];

    if (firstSegment && supportedLanguages.includes(firstSegment)) {
      path = "/" + pathSegments.slice(1).join("/");
      if (path === "/") path = "/";
    }

    const newPath =
      newLang === "en" ? path : `/${newLang}${path === "/" ? "" : path}`;
    window.location.href = newPath;
  };

  return (
    <div className={styles.wrapper}>
      <select
        value={currentLang}
        onChange={handleLanguageChange}
        className={styles.select}
      >
        {Object.entries(languages).map(([langCode, label]) => (
          <option key={langCode} value={langCode}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
};
