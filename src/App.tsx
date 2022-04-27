import { useEffect, useState } from "react";
import { AuthContext } from "./stateManagement/context";
import { AppRouter } from "./routes/AppRoute";

function App() {
  const initialValue = {
    _id: "",
    name: "",
    lastname: "",
    fullname: "",
    email: "",
    status: true,
    role: "",
  };

  const [user, setUser] = useState(initialValue);

  useEffect(() => {
    const initialValue = JSON.parse(String(localStorage.getItem("user")));
    setUser(initialValue?.user);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <AppRouter />
    </AuthContext.Provider>
  );
}

export default App;
