import { NotificationProvider } from "web3uikit";
import { MoralisProvider } from "react-moralis";
import { Dashboard } from "./component/Dashboard";

function App() {
  return (
    <MoralisProvider
      serverUrl={process.env.REACT_APP_MORALIS_SERVER_URL}
      appId={process.env.REACT_APP_MORALIS_APP_ID}
    >
      <NotificationProvider>
        <Dashboard />
      </NotificationProvider>
    </MoralisProvider>
  );
}

export default App;
