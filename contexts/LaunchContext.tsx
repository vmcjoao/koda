import React, { createContext, useContext } from 'react';

const LaunchContext = createContext(true);

/** True after the boot brand overlay has finished. */
export function LaunchProvider({
  ready,
  children,
}: {
  ready: boolean;
  children: React.ReactNode;
}) {
  return <LaunchContext.Provider value={ready}>{children}</LaunchContext.Provider>;
}

export function useLaunchReady() {
  return useContext(LaunchContext);
}
