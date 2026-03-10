import { useCallback, useState } from "react";
import { languageConfigs, sampleTestCases as defaultTestCases } from "../constants";

function normalizeSampleTests(sampleTests) {
  if (!Array.isArray(sampleTests)) {
    return [];
  }

  return sampleTests
    .filter(
      (testCase) =>
        testCase &&
        typeof testCase.input === "string" &&
        typeof testCase.expected === "string",
    )
    .map((testCase, index) => ({
      id: index + 1,
      input: testCase.input,
      expected: testCase.expected,
      status: "idle",
    }));
}

async function getPreferredLanguage() {
  let preferredLanguage = await window.electronAPI.getStore("preferredLanguage");

  if (!preferredLanguage || !languageConfigs[preferredLanguage]) {
    preferredLanguage = "cpp";
    await window.electronAPI.setStore("preferredLanguage", preferredLanguage);
  }

  return preferredLanguage;
}

async function ensureFolder(folderPath, name) {
  const created = await window.electronAPI.createFolder(folderPath);
  if (!created) {
    throw new Error(`Failed to create ${name}: ${folderPath}`);
  }
}

async function ensureSolutionFile(filePath, boilerplate) {
  const existingContent = await window.electronAPI.readFile(filePath);
  if (existingContent !== null) {
    return;
  }

  const fileWritten = await window.electronAPI.writeFile(filePath, boilerplate);
  if (!fileWritten) {
    throw new Error(`Failed to create solution file: ${filePath}`);
  }

  const createdContent = await window.electronAPI.readFile(filePath);
  if (createdContent === null) {
    throw new Error(`Solution file was not readable after creation: ${filePath}`);
  }
}

export function useCodeforcesIntegration({
  workspacePath,
  refreshWorkspace,
  handleFileOpen,
  setBottomPanelTab,
}) {
  const [codeforcesProblem, setCodeforcesProblem] = useState(null);
  const [testCases, setTestCases] = useState(defaultTestCases);

  const closeCodeforcesProblem = useCallback(() => {
    setCodeforcesProblem(null);
  }, []);

  const handleFetchProblem = useCallback(
    async (problemData) => {
      setCodeforcesProblem(problemData);
      setTestCases(normalizeSampleTests(problemData.sampleTests));
      setBottomPanelTab("test");

      if (!workspacePath) {
        window.alert(
          "Please open a folder (File > Open Folder) first to auto-save solutions.",
        );
        return;
      }

      if (!problemData.contestId || !problemData.problemLetter) {
        window.alert(
          "Could not determine the contest ID or problem code from this Codeforces link.",
        );
        return;
      }

      try {
        const preferredLanguage = await getPreferredLanguage();
        const config =
          languageConfigs[preferredLanguage] || languageConfigs["cpp"];

        const contestId = String(problemData.contestId).trim();
        const problemLetter = String(problemData.problemLetter)
          .trim()
          .toUpperCase();

        const contestFolderPath = await window.electronAPI.pathJoin(
          workspacePath,
          contestId,
        );
        await ensureFolder(contestFolderPath, "contest folder");

        const problemFolderPath = await window.electronAPI.pathJoin(
          contestFolderPath,
          problemLetter,
        );
        await ensureFolder(problemFolderPath, "problem folder");

        const filePath = await window.electronAPI.pathJoin(
          problemFolderPath,
          `solution.${config.ext}`,
        );

        await ensureSolutionFile(filePath, config.boilerplate);

        refreshWorkspace();
        handleFileOpen({ path: filePath, isDirectory: false });
      } catch (error) {
        console.error("Failed to auto-create solution file:", error);
        window.alert(
          `Codeforces file creation failed: ${error.message || String(error)}`,
        );
      }
    },
    [
      workspacePath,
      refreshWorkspace,
      handleFileOpen,
      setBottomPanelTab,
      setCodeforcesProblem,
      setTestCases,
    ],
  );

  return {
    codeforcesProblem,
    testCases,
    handleFetchProblem,
    closeCodeforcesProblem,
  };
}
