import { useEffect } from "react";
import { AuthProvider } from "./auth/AuthContext";
import { AppRouter } from "./app/AppRouter";
import { applyUrbbisTheme, loadUrbbisConfig } from "./features/settings/urbbis-config";

function App() {
  useEffect(() => {
    applyUrbbisTheme(loadUrbbisConfig());
  }, []);

  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
