import Moralis from "moralis";
import React, { useEffect } from "react";
import { useMoralis, useMoralisWeb3Api } from "react-moralis";
import {
  BannerStrip,
  NFTBalance,
  ConnectButton,
  useNotification,
  Widget,
  Todo,
  Credentials,
  Typography,
} from "web3uikit";
import { ConnectWallet } from "./ConnectWallet";

export const Dashboard = () => {
  const dispatch = useNotification();
  const Web3Api = useMoralisWeb3Api();
  const { isAuthenticated, user } = useMoralis();
  // Current user's wallet address
  const userAddress = user?.get("ethAddress");

  // Token balance of the current user
  const [mainnetBalance, setMainnetBalance] = React.useState("0");
  const [kovanBalance, setKovanBalance] = React.useState("0");
  const [rinkebyBalance, setRinkebyBalance] = React.useState("0");
  const [goerliBalance, setGoerliBalance] = React.useState("0");
  const [ropstenBalance, setRopstenBalance] = React.useState("0");

  // Notification handler
  const handleNewNotification = ({ type, title, message, position }) => {
    dispatch({
      type: type || "info",
      message: message || "",
      title: title || "New Notification",
      position: position || "topR",
    });
  };

  // Get the balance of the current user
  const fetchTokenBalances = async (chain) => {
    const options = { chain, address: userAddress };
    const result = await Web3Api.account.getNativeBalance(options);
    return result.balance;
  };

  // Fetch all token balances of the current user
  const fetchBalances = async () => {
    const balances = await Promise.all([
      fetchTokenBalances("mainnet"),
      fetchTokenBalances("kovan"),
      fetchTokenBalances("rinkeby"),
      fetchTokenBalances("goerli"),
      fetchTokenBalances("ropsten"),
    ]);

    // Balance of the current user on each chain
    const mainnetBalance = balances[0];
    const kovanBalance = balances[1];
    const rinkebyBalance = balances[2];
    const goerliBalance = balances[3];
    const ropstenBalance = balances[4];

    // Convert the balance from Wei to Ether
    // https://docs.moralis.io/moralis-dapp/tools/moralis-units
    const mainnetBalanceEther = Moralis.Units.FromWei(mainnetBalance);
    const kovanBalanceEther = Moralis.Units.FromWei(kovanBalance);
    const rinkebyBalanceEther = Moralis.Units.FromWei(rinkebyBalance);
    const goerliBalanceEther = Moralis.Units.FromWei(goerliBalance);
    const ropstenBalanceEther = Moralis.Units.FromWei(ropstenBalance);

    // Set the ETH balance of the current user
    setMainnetBalance(mainnetBalanceEther);
    setKovanBalance(kovanBalanceEther);
    setRinkebyBalance(rinkebyBalanceEther);
    setGoerliBalance(goerliBalanceEther);
    setRopstenBalance(ropstenBalanceEther);
  };

  useEffect(() => {
    if (isAuthenticated) {
      // Notification object
      const notificationData = {
        types: "info",
        title: "Wallet Connected 🤝",
        position: "bottomR",
      };

      // Show notification
      handleNewNotification(notificationData);

      // Fetches all token balances of the current user
      fetchBalances();
    }
  }, [isAuthenticated]);

  return (
    <React.Fragment>
      <header>
        {/* Dapp Header Banner */}
        <BannerStrip
          text={
            isAuthenticated
              ? "Welcome back 👋"
              : "You are not connected to the dApp. Please connect to the dApp to see your NFT balance."
          }
          height='40px'
          className='dapp-header-banner'
        />

        {/* Dapp Authentication */}
        <section className='container topnav'>
          <Typography variant='h2'>My Web3 Dashboard</Typography>
          <ConnectButton signingMessage='Connect wallet' />
        </section>
      </header>
      <main>
        {isAuthenticated ? (
          <section className='container'>
            {/* Dapp Balance Widget */}
            <section className='wallet-balance-widget'>
              <Widget
                title='MAINNNET'
                info={`${mainnetBalance.slice(0, 10)} ETH`}
              />
              <Widget
                title='RINKEBY'
                info={`${rinkebyBalance.slice(0, 10)} ETH`}
              />
              <Widget title='KOVAN' info={`${kovanBalance.slice(0, 10)} ETH`} />
              <Widget
                title='GOERLI'
                info={`${goerliBalance.slice(0, 10)} ETH`}
              />
              <Widget
                title='ROPSTEN'
                info={`${ropstenBalance.slice(0, 10)} ETH`}
              />
            </section>

            {/* Wallet Address  */}
            <section className='my-secret-credential'>
              <Credentials
                icon='info'
                text={userAddress}
                title='Wallet Address:'
              />
            </section>

            {/* Dapp Todo */}
            <section className='todo-container'>
              <Todo
                label='Enter Todo'
                onChange={function noRefCheck() {}}
                todos={[]}
              />
            </section>

            {/* Dapp NFT Owned by user */}
            <section className='my-nfts-section'>
              <NFTBalance address={userAddress} chain='rinkeby' />
            </section>
          </section>
        ) : (
          // Dapp Connect Wallet
          <ConnectWallet />
        )}
      </main>

      <footer className='container'>
        Powered by <a href='https://moralis.io'>Moralis Web3UIKit</a>
      </footer>
    </React.Fragment>
  );
};
