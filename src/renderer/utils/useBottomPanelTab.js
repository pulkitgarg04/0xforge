import { useEffect, useState } from "react";

const TERMINAL_MENU_ACTIONS = new Set([
  "newTerminal",
  "newTerminalWindow",
  "splitTerminal",
]);

const TEST_MENU_ACTIONS = new Set(["runTests", "runCode"]);

export function useBottomPanelTab(initialTab = "terminal") {
  const [bottomPanelTab, setBottomPanelTab] = useState(initialTab);

  useEffect(() => {
    const unsubscribe = window.electronAPI.onMenuAction((action) => {
      if (TERMINAL_MENU_ACTIONS.has(action)) {
        setBottomPanelTab("terminal");
      } else if (TEST_MENU_ACTIONS.has(action)) {
        setBottomPanelTab("test");
      }
    });

    return () => unsubscribe();
  }, []);

  return {
    bottomPanelTab,
    setBottomPanelTab,
  };
}
