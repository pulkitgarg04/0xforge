import { useState } from "react";
import AppTitleBar from "./components/AppTitleBar";
import StatusBar from "./components/StatusBar";
import WelcomeScreen from "./components/WelcomeScreen";
import OnboardingScreen from "./components/OnboardingScreen";
import WorkspaceLayout from "./components/WorkspaceLayout";
import { useWorkspace } from "./utils/useWorkspace";
import { useBottomPanelTab } from "./utils/useBottomPanelTab";
import { useCodeforcesIntegration } from "./utils/useCodeforcesIntegration";
import { useUserProfile } from "./utils/useUserProfile";

export default function App() {
  const [sidebarActive, setSidebarActive] = useState("files");
  const { bottomPanelTab, setBottomPanelTab } = useBottomPanelTab("terminal");

  const {
    workspacePath,
    openFiles,
    activeFile,
    activeFileName,
    showWelcome,
    handleOpenFolder,
    handleNewFile,
    handleCloneRepo,
    handleFileOpen,
    handleSwitchFile,
    handleCloseFile,
    refreshWorkspace,
    workspaceVersion,
  } = useWorkspace();

  const { hasOnboarded, userName, handleOnboardingComplete } = useUserProfile();
  const {
    codeforcesProblem,
    testCases,
    handleFetchProblem,
    closeCodeforcesProblem,
  } = useCodeforcesIntegration({
    workspacePath,
    refreshWorkspace,
    handleFileOpen,
    setBottomPanelTab,
  });

  if (hasOnboarded === null) {
    return null;
  }

  if (!hasOnboarded) {
    return (
      <div className="h-screen w-screen overflow-hidden">
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      </div>
    );
  }

  if (showWelcome) {
    return (
      <div className="h-screen w-screen overflow-hidden">
        <WelcomeScreen
          userName={userName}
          onOpenFolder={handleOpenFolder}
          onNewFile={handleNewFile}
          onCloneRepo={handleCloneRepo}
        />
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden relative">
      <div className="ambient-bg" />

      <AppTitleBar activeFileName={activeFileName} />

      <WorkspaceLayout
        sidebarActive={sidebarActive}
        setSidebarActive={setSidebarActive}
        handleOpenFolder={handleOpenFolder}
        workspacePath={workspacePath}
        handleFileOpen={handleFileOpen}
        activeFile={activeFile}
        workspaceVersion={workspaceVersion}
        handleFetchProblem={handleFetchProblem}
        codeforcesProblem={codeforcesProblem}
        closeCodeforcesProblem={closeCodeforcesProblem}
        openFiles={openFiles}
        handleSwitchFile={handleSwitchFile}
        handleCloseFile={handleCloseFile}
        bottomPanelTab={bottomPanelTab}
        setBottomPanelTab={setBottomPanelTab}
        testCases={testCases}
      />

      <StatusBar workspacePath={workspacePath} activeFile={activeFile} />
    </div>
  );
}
