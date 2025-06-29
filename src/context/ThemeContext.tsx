import React, { createContext, useContext, useState, useEffect } from "react";

// Theme structure
const darkTheme = {
  colors: {
    background: "#111827", // gray-900
    surface: "#1f2937", // gray-800
    primary: "#e50914", // red-600
    primaryHover: "#f51a25", // red-700
    text: "#ffffff",
    textSecondary: "#9ca3af", // gray-400
    border: "#374151", // gray-700
    success: "#16a34a", // green-600
  },
};

const lightTheme = {
  colors: {
    background: "#ffffff",
    surface: "#f3f4f6", // gray-100
    primary: "#e50914",
    primaryHover: "#c5111a",
    text: "#111827",
    textSecondary: "#4b5563", // gray-600
    border: "#d1d5db", // gray-300
    success: "#15803d", // green-700
  },
};

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? saved === "dark" : true; // Default to dark mode
  });

  useEffect(() => {
    localStorage.setItem("theme", isDark ? "dark" : "light");
    // Set data-bs-theme attribute on the html tag for Bootstrap's dark mode
    document.documentElement.setAttribute("data-bs-theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
