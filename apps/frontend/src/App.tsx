import { useEffect } from "react";
import { LandingPage } from "./components/LandingPage";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { SpendWiseApp } from "./components/SpendWiseApp";
import { useAuth } from "./context/AuthContext";
import { startApiKeepAlive } from "./lib/keepAlive";

function App() {
  const { session, loading: authLoading, signInWithGoogle, signOut } = useAuth();

  useEffect(() => startApiKeepAlive(), []);

  if (authLoading) {
    return <LoadingSpinner className="min-h-screen" />;
  }

  if (!session) {
    return <LandingPage onSignIn={signInWithGoogle} />;
  }

  const userName =
    session.user.user_metadata?.full_name ?? session.user.user_metadata?.name;

  return (
    <SpendWiseApp
      userName={userName}
      userEmail={session.user.email}
      onSignOut={signOut}
    />
  );
}

export default App;
