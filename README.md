<img src='public/website.PNG' width='700' >

# ZeniNFTs 

A website to mint one of the unique NFTs from the collection ZeniNFTs modeled after Zenitsu, the Dachshund. The smart contract, an ERC721, was published to the rinkeby network. The images were drawn using the MediBang app and the unique images were generated with the hashlips art engine. The images are hosted on Pinata. 

## Technologies 
- Hardhat
- React
- Ethersjs
- Solidity
- Bootstrap

https://zeni-nfts.netlify.app/

## Run locally

1. Clone the repo

```sh
git clone https://github.com/jhoan2/ZeniNFTs.git
```

2. Install the dependencies

```sh
npm install

# or

yarn
```

3. Start the local test node

```sh
npx hardhat node
```

4. Deploy the contract

```sh
npx hardhat run scripts/deploy.js --network localhost
```

5. Update __src/App.js__ with the values of your contract addresses (`greeterAddress` and `tokenAddress`)

6. Run the app

```sh
npm start
```
