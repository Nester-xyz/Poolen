import { createContext, useContext, useState } from "react";

interface SessionContextType {
  sessionClient: any | null;
  setSessionClient: (client: any | null) => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [sessionClient, setSessionClient] = useState<any | null>(null);

  // Add some debugging
  const setSessionWithLogging = (client: any | null) => {
    console.log("Setting session client:", client);
    setSessionClient(client);
  };

  return (
    <SessionContext.Provider 
      value={{ 
        sessionClient, 
        setSessionClient: setSessionWithLogging 
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSessionClient = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSessionClient must be used within a SessionProvider");
  }
  return context;
};
