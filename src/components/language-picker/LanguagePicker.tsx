import React from "react";
import { languages } from "../../i18n/ui";
import { supportedLanguages } from "src/i18n/utils";

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

    // Remove current language from path if it exists
    let path = currentPath;
    if (supportedLanguages.includes(path)) {
      path = path.replace(`/${currentLang}`, "") || "/";
    }

    // Add new language prefix (except for default language 'en')
    const newPath = newLang === "en" ? path : `/${newLang}${path}`;
    window.location.href = newPath;
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
      }}
    >
      <select
        value={currentLang}
        onChange={handleLanguageChange}
        style={{
          background: "transparent",
          border: "1px solid #D3E97A",
          borderRadius: "6px",
          padding: "0.5rem",
          color: "#ffffff",
          fontSize: "0.875rem",
          cursor: "pointer",
          transition: "all 0.2s ease",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.borderColor = "#E5F066";
          e.currentTarget.style.background = "rgba(211, 233, 122, 0.1)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.borderColor = "#D3E97A";
          e.currentTarget.style.background = "transparent";
        }}
      >
        {Object.entries(languages).map(([langCode, label]) => (
          <option
            key={langCode}
            value={langCode}
            style={{
              background: "#1a1a1a",
              color: "#ffffff",
            }}
          >
            {label}
          </option>
        ))}
      </select>
    </div>
  );
};
