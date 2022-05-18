import React from "react";
import { ConnectButton, Hero } from "web3uikit";

export const ConnectWallet = () => {
  return (
    <section className='not-connected'>
      <Hero
        backgroundURL='https://moralis.io/wp-content/uploads/2021/06/blue-blob-background-2.svg'
        title='My Web3 Dashboard 🚀'
        height='70vh'
      >
        <ConnectButton signingMessage='Connect wallet' />
      </Hero>
    </section>
  );
};
