import { useCallback, useEffect, useState } from "react";

export function useUserProfile() {
  const [hasOnboarded, setHasOnboarded] = useState(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const checkProfile = async () => {
      const profile = await window.electronAPI.getStore("userProfile");
      if (profile && profile.name) {
        setUserName(profile.name);
        setHasOnboarded(true);
      } else {
        setHasOnboarded(false);
      }
    };

    checkProfile();
  }, []);

  const handleOnboardingComplete = useCallback((profileData) => {
    setUserName(profileData.name);
    setHasOnboarded(true);
  }, []);

  return {
    hasOnboarded,
    userName,
    handleOnboardingComplete,
  };
}
