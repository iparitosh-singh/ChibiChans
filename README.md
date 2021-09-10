<p align="center">
  <a href="https://metaplex.com">
    <img alt="Metaplex" src="https://metaplex.com/meta.svg" width="250" />
  </a>
</p>

The ChibiChans website is built on top of Metaplex which allows:

- **Creating/Minting** 540 unique customizable & upgradable Chibi NFTs;
- **Upgrading/Updating** a variety of auctions for primary/secondary sales;
- and **Creating/Minting** random pet NFTs that change their appearance every hour based on the price of Solana.

Metaplex is comprised of two core components: an on-chain program, and a self-hosted front-end web3 application.

## In Depth Developer's Guide

If you want to deep dive on the Architecture, you can do so here:

https://www.notion.so/Metaplex-Developer-Guide-afefbc19841744c28587ab948a08cfac

## Installing

Clone the repo, and run `yarn start` to deploy.

```bash
$ git clone https://github.com/metaplex-foundation/metaplex.git
$ cd metaplex
$ cd js
$ yarn install
$ yarn bootstrap
$ yarn start
```

## Rust Programs

The Rust programs will soon be added to this repo with JavaScript
bindings that allow interactivity.

## Community

We have a few channels for contact:

- [Discord](https://discord.gg/metaplex)
- [@metaplex](https://twitter.com/metaplex) on Twitter
- [GitHub Issues](https://github.com/metaplex-foundation/metaplex/issues)

# Protocol

## Non-fungible tokens

Metaplex's non-fungible-token standard is a part of the Solana Program Library (SPL), and can be characterized as a unique token with a fixed supply of 1 and 0 decimals. We extended the basic definition of an NFT on Solana to include additional metadata such as URI as defined in ERC-721 on Ethereum.
