import React, { useState } from "react";
import Login from "./login";
import Dashboard from "./dashboard";
import "./App.css";

const App: React.FC = () => {
  // Change this to useState(true) to bypass login
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <div className="App">
      {loggedIn ? (
        <Dashboard setLoggedIn={setLoggedIn} />
      ) : (
        <Login setLoggedIn={setLoggedIn} />
      )}
    </div>
  );
};

export default App;
