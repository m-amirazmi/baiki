"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useId } from "react";

import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/contexts/theme";

export default function ThemeSwitcher() {
  const id = useId();
  const { theme, toggleTheme } = useTheme();

  const toggleSwitch = () => toggleTheme();

  return (
    <div
      className="group inline-flex items-center gap-2"
      data-state={theme === "light" ? "checked" : "unchecked"}
    >
      <span
        id={`${id}-off`}
        className="group-data-[state=checked]:text-muted-foreground/70 flex-1 cursor-pointer text-right text-sm font-medium"
        aria-controls={id}
        onClick={() => toggleTheme("dark")}
      >
        <MoonIcon size={16} aria-hidden="true" />
      </span>
      <Switch
        id={id}
        checked={theme === "light"}
        onCheckedChange={toggleSwitch}
        aria-labelledby={`${id}-off ${id}-on`}
        aria-label="Toggle between dark and light mode"
      />
      <span
        id={`${id}-on`}
        className="group-data-[state=unchecked]:text-muted-foreground/70 flex-1 cursor-pointer text-left text-sm font-medium"
        aria-controls={id}
        onClick={() => toggleTheme("light")}
      >
        <SunIcon size={16} aria-hidden="true" />
      </span>
    </div>
  );
}
