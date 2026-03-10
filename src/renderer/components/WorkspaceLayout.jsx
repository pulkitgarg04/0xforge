import Sidebar from "./Sidebar";
import FileExplorer from "./FileExplorer";
import CodeforcesPanel from "./CodeforcesPanel";
import ProblemStatement from "./ProblemStatement";
import CodeEditor from "./CodeEditor";
import BottomPanel from "./BottomPanel";

export default function WorkspaceLayout({
  sidebarActive,
  setSidebarActive,
  handleOpenFolder,
  workspacePath,
  handleFileOpen,
  activeFile,
  workspaceVersion,
  handleFetchProblem,
  codeforcesProblem,
  closeCodeforcesProblem,
  openFiles,
  handleSwitchFile,
  handleCloseFile,
  bottomPanelTab,
  setBottomPanelTab,
  testCases,
}) {
  return (
    <div className="flex-1 flex overflow-hidden relative z-10">
      <Sidebar
        active={sidebarActive}
        onSelect={setSidebarActive}
        onOpenFolder={handleOpenFolder}
      />

      {sidebarActive === "files" && workspacePath && (
        <FileExplorer
          workspacePath={workspacePath}
          onFileOpen={handleFileOpen}
          activeFile={activeFile}
          refreshVersion={workspaceVersion}
        />
      )}

      {sidebarActive === "codeforces" && (
        <CodeforcesPanel onFetchProblem={handleFetchProblem} />
      )}

      <div className="flex-1 flex overflow-hidden relative">
        {codeforcesProblem && (
          <ProblemStatement
            problem={codeforcesProblem}
            onClose={closeCodeforcesProblem}
          />
        )}

        <div className="flex-1 flex flex-col overflow-hidden">
          <CodeEditor
            openFiles={openFiles}
            activeFile={activeFile}
            onSwitchFile={handleSwitchFile}
            onCloseFile={handleCloseFile}
          />

          <BottomPanel
            bottomPanelTab={bottomPanelTab}
            setBottomPanelTab={setBottomPanelTab}
            testCases={testCases}
            workspacePath={workspacePath}
          />
        </div>
      </div>
    </div>
  );
}
