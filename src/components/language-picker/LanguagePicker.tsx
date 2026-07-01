import React from "react";
import { languages } from "../../i18n/ui";
import styles from "./LanguagePicker.module.scss";

interface LanguagePickerProps {
  currentLang: string;
  currentPath: string;
}

export const LanguagePicker: React.FC<LanguagePickerProps> = ({
  currentLang,
}) => {
  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newLang = event.target.value;
    document.cookie = `lang=${newLang}; path=/; max-age=31536000; samesite=lax`;
    window.location.reload();
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
