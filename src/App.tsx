import { useState } from "react";
import { AuthContext } from "./stateManagement/context";
import { AppRouter } from "./routes/AppRoute";

function App() {
  const initialValue = JSON.parse(String(localStorage.getItem("user")));

  const [user, setUser] = useState<any>(
    initialValue ? initialValue.user : null
  );

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <AppRouter />
    </AuthContext.Provider>
  );
}

export default App;
