"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from '../app/contexts/theme-context'; 
import { Button } from "react-scroll";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
    variant="ghost"
    onClick={toggleTheme}
    size="icon"
    className={`theme-toggle align-items-center ${theme ? "dark" : ""} flex flex-row items-center gap-2`}
    >
      {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </Button>
  );
}