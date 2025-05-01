// =================== FIIT DEX Project =================== //
//        @authors:  Martin Farkaš // Jaroslav Ertl
// ========================================================= //

// TODO: Fill in the authors names.

// Set up Ethers.js
const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
var defaultAccount;

const exchange_name = "Zmenaren"; // TODO: fill in the name of your exchange

const token_name = "ShrekCoin"; // TODO: replace with name of your token
const token_symbol = "SHR"; // TODO: replace with symbol for your token

// =============================================================================
//                          ABIs: Paste Your ABIs Here
// =============================================================================

// TODO: Paste your token and exchange contract ABIs in abi.js!

// TODO: Paste your token contract address here:
const token_address = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const token_abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "disable_mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
const token_contract = new ethers.Contract(
  token_address,
  token_abi,
  provider.getSigner()
);

// TODO: Paste your exchange address here
const exchange_abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "provider",
        type: "address",
      },
    ],
    name: "getProviderShare",
    outputs: [
      {
        internalType: "uint256",
        name: "shareoverload",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "tokenShare",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "ethShare",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "max_exchange_rate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "min_exchange_rate",
        type: "uint256",
      },
    ],
    name: "addLiquidity",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amountTokens",
        type: "uint256",
      },
    ],
    name: "createPool",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "exchange_name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getSwapFee",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "max_exchange_rate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "min_exchange_rate",
        type: "uint256",
      },
    ],
    name: "removeAllLiquidity",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amountETH",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "max_exchange_rate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "min_exchange_rate",
        type: "uint256",
      },
    ],
    name: "removeLiquidity",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "max_exchange_rate",
        type: "uint256",
      },
    ],
    name: "swapETHForTokens",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amountTokens",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "max_exchange_rate",
        type: "uint256",
      },
    ],
    name: "swapTokensForETH",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "token",
    outputs: [
      {
        internalType: "contract Token",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "provider",
        type: "address",
      },
    ],
    name: "getLiquidity",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
const exchange_address = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const exchange_contract = new ethers.Contract(
  exchange_address,
  exchange_abi,
  provider.getSigner()
);

// =============================================================================
//                              Provided Functions
// =============================================================================
// Reading and understanding these should help you implement the above

/*** INIT ***/
async function init() {
  var poolState = await getPoolState();
  console.log("Starting init");
  console.log("Initial pool state:", poolState);
  if (poolState["token_liquidity"] === 0 && poolState["eth_liquidity"] === 0) {
    // Celková zásoba tokenov (100000 tokenov)
    const total_supply = ethers.utils.parseUnits("100000", 18); // 100000 tokenov v jednotkách
    console.log("Minting tokens:", total_supply.toString());
    await token_contract
      .connect(provider.getSigner(defaultAccount))
      .mint(total_supply.div(2));
    await token_contract
      .connect(provider.getSigner(defaultAccount))
      .mint(total_supply.div(2));
    await token_contract
      .connect(provider.getSigner(defaultAccount))
      .disable_mint();

    console.log("Approving tokens:", total_supply.toString());
    const approveTx = await token_contract
      .connect(provider.getSigner(defaultAccount))
      .approve(exchange_address, total_supply);
    await approveTx.wait();

    // Inicializácia poolu s 5000 ETH a 5000 tokenmi
    const poolTokens = ethers.utils.parseUnits("5000", 18); // 5000 tokenov
    const poolEth = ethers.utils.parseEther("5000"); // 5000 ETH
    const createPoolTx = await exchange_contract
      .connect(provider.getSigner(defaultAccount))
      .createPool(poolTokens, { value: poolEth });
    await createPoolTx.wait();

    console.log("Init finished");
  }
}
async function getPoolState() {
  let liquidity_tokens = await token_contract.balanceOf(exchange_address);
  let liquidity_eth = await provider.getBalance(exchange_address);
  const decimals = await token_contract.decimals(); // Počet desatinných miest tokenu (18)

  // Konverzia na desatinné hodnoty pre zobrazenie
  const tokenLiquidity = Number(
    ethers.utils.formatUnits(liquidity_tokens, decimals)
  ); // Napr. 5000
  const ethLiquidity = Number(ethers.utils.formatEther(liquidity_eth)); // Napr. 5000

  // Výpočet výmenných kurzov (používame desatinné hodnoty)
  const tokenEthRate = ethLiquidity === 0 ? 0 : tokenLiquidity / ethLiquidity; // Tokeny za 1 ETH
  const ethTokenRate = tokenLiquidity === 0 ? 0 : ethLiquidity / tokenLiquidity; // ETH za 1 token

  return {
    token_liquidity: tokenLiquidity,
    eth_liquidity: ethLiquidity,
    token_eth_rate: tokenEthRate,
    eth_token_rate: ethTokenRate,
  };
}

// ============================================================
//                    FUNCTIONS TO IMPLEMENT
// ============================================================

// Note: maxSlippagePct will be passed in as an int out of 100.
// Be sure to divide by 100 for your calculations.
//----------------------------------------------------------------------------------------------//
/*** ADD LIQUIDITY ***/
async function addLiquidity(amountEth, maxSlippagePct) {
  const signer = provider.getSigner(defaultAccount);
  const amountEthValue = ethers.utils.parseEther(amountEth.toString());

  // Kontrola zostatku ETH
  const ethBalance = await provider.getBalance(defaultAccount);
  if (ethBalance.lt(amountEthValue)) {
    alert(
      `Nedostatok ETH! Máte ${ethers.utils.formatEther(
        ethBalance
      )} ETH, ale požadujete ${amountEth} ETH.`
    );
    $("#log").append(`Add liquidity error: Insufficient ETH balance\n`);
    return;
  }

  // Získanie aktuálnych rezerv
  const tokenReserves = await token_contract.balanceOf(exchange_address);
  const ethReserves = await provider.getBalance(exchange_address);
  const decimals = await token_contract.decimals();

  // Kontrola existencie poolu
  if (tokenReserves.eq(0) && ethReserves.eq(0)) {
    alert("Pool nie je inicializovaný!");
    $("#log").append(`Add liquidity error: Pool does not exist\n`);
    return;
  }

  // Výpočet očakávaných tokenov
  const expectedTokens = amountEthValue.mul(tokenReserves).div(ethReserves);

  // Kontrola zostatku tokenov
  const tokenBalance = await token_contract.balanceOf(defaultAccount);
  if (tokenBalance.lt(expectedTokens)) {
    alert(
      `Nedostatok SHR tokenov! Máte ${ethers.utils.formatUnits(
        tokenBalance,
        decimals
      )} SHR, ale požadujete ${ethers.utils.formatUnits(
        expectedTokens,
        decimals
      )} SHR.`
    );
    $("#log").append(`Add liquidity error: Insufficient SHR token balance\n`);
    return;
  }

  // Výpočet max_exchange_rate a min_exchange_rate (v jednotkách tokenov)
  const slippageMultiplier = 100 + maxSlippagePct;
  const slippageDivider = 100 - maxSlippagePct;
  const maxExchangeRate = expectedTokens.mul(slippageMultiplier).div(100); // +slippage
  const minExchangeRate = expectedTokens.mul(slippageDivider).div(100); // -slippage

  // Odoslanie transakcie
  // Schválenie tokenov pre exchange kontrakt
  const approveTx = await token_contract
    .connect(signer)
    .approve(exchange_address, expectedTokens);
  await approveTx.wait();

  // Odoslanie transakcie na pridanie likvidity
  const tx = await exchange_contract
    .connect(signer)
    .addLiquidity(maxExchangeRate, minExchangeRate, {
      value: amountEthValue,
      gasLimit: 200000,
    });
  await tx.wait();
}
//----------------------------------------------------------------------------------------------//
/*** REMOVE LIQUIDITY ***/
async function removeLiquidity(amountEth, maxSlippagePct) {
  const signer = provider.getSigner(defaultAccount);
  const amountEthValue = ethers.utils.parseEther(amountEth.toString());

  const [share, tokenShare, ethShare] =
    await exchange_contract.getProviderShare(defaultAccount);
  if (ethShare.lt(amountEthValue)) {
    alert(
      `Nedostatok likvidity! Máte ${ethers.utils.formatEther(
        ethShare
      )} ETH podiel, ale požadujete ${amountEth} ETH.`
    );
    $("#log").append(`Remove liquidity error: Insufficient liquidity share\n`);
    return;
  }

  // Získanie aktuálnych rezerv
  const tokenReserves = await token_contract.balanceOf(exchange_address);
  const ethReserves = await provider.getBalance(exchange_address);
  const decimals = await token_contract.decimals();

  // Kontrola existencie poolu
  if (tokenReserves.eq(0) && ethReserves.eq(0)) {
    alert("Pool nie je inicializovaný!");
    $("#log").append(`Remove liquidity error: Pool does not exist\n`);
    return;
  }

  // Kontrola dostatočných rezerv
  const expectedTokens = amountEthValue.mul(tokenReserves).div(ethReserves);
  const expectedETH = amountEthValue.mul(amountEthValue).div(ethShare);

  if (ethReserves.lt(expectedETH)) {
    alert(
      `Nedostatok ETH v pooli! Pool má ${ethers.utils.formatEther(
        ethReserves
      )} ETH, ale požadujete ${ethers.utils.formatEther(expectedETH)} ETH.`
    );
    $("#log").append(`Remove liquidity error: Insufficient ETH reserves\n`);
    return;
  }
  if (tokenReserves.lt(expectedTokens)) {
    alert(
      `Nedostatok SHR tokenov v pooli! Pool má ${ethers.utils.formatUnits(
        tokenReserves,
        decimals
      )} SHR, ale požadujete ${ethers.utils.formatUnits(
        expectedTokens,
        decimals
      )} SHR.`
    );
    $("#log").append(
      `Remove liquidity error: Insufficient SHR token reserves\n`
    );
    return;
  }

  // Výpočet max_exchange_rate a min_exchange_rate (v jednotkách tokenov)
  const slippageMultiplier = 100 + maxSlippagePct;
  const slippageDivider = 100 - maxSlippagePct;
  const maxExchangeRate = expectedTokens.mul(slippageMultiplier).div(100); // +slippage
  const minExchangeRate = expectedTokens.mul(slippageDivider).div(100); // -slippage
  const approveTx = await token_contract
    .connect(signer)
    .approve(exchange_address, amountEthValue);
  await approveTx.wait();

  // Odoslanie transakcie na pridanie likvidity
  const tx = await exchange_contract
    .connect(signer)
    .removeLiquidity(amountEthValue, maxExchangeRate, minExchangeRate, {
      gasLimit: 200000,
    });
  await tx.wait();
}
//----------------------------------------------------------------------------------------------//
async function removeAllLiquidity(maxSlippagePct) {
  const signer = provider.getSigner(defaultAccount);

  // Získanie podielu LP
  const [share, tokenShare, ethShare] =
    await exchange_contract.getProviderShare(defaultAccount);
  if (share.eq(0)) {
    alert("Nemáte žiadnu likviditu na odstránenie!");
    $("#log").append(`Remove all liquidity error: No liquidity to remove\n`);
    return;
  }

  // Získanie aktuálnych rezerv
  const tokenReserves = await token_contract.balanceOf(exchange_address);
  const ethReserves = await provider.getBalance(exchange_address);
  const decimals = await token_contract.decimals();

  // Kontrola existencie poolu
  if (tokenReserves.eq(0) && ethReserves.eq(0)) {
    alert("Pool nie je inicializovaný!");
    $("#log").append(`Remove all liquidity error: Pool does not exist\n`);
    return;
  }

  // Kontrola dostatočných rezerv
  const expectedTokens = tokenShare;
  const expectedETH = ethShare;
  if (ethReserves.lt(expectedETH)) {
    alert(
      `Nedostatok ETH v pooli! Pool má ${ethers.utils.formatEther(
        ethReserves
      )} ETH, ale požadujete ${ethers.utils.formatEther(expectedETH)} ETH.`
    );
    $("#log").append(`Remove all liquidity error: Insufficient ETH reserves\n`);
    return;
  }
  if (tokenReserves.lt(expectedTokens)) {
    alert(
      `Nedostatok SHR tokenov v pooli! Pool má ${ethers.utils.formatUnits(
        tokenReserves,
        decimals
      )} SHR, ale požadujete ${ethers.utils.formatUnits(
        expectedTokens,
        decimals
      )} SHR.`
    );
    $("#log").append(
      `Remove all liquidity error: Insufficient SHR token reserves\n`
    );
    return;
  }

  // Výpočet max_exchange_rate a min_exchange_rate (v jednotkách tokenov)
  const slippageMultiplier = 100 + maxSlippagePct;
  const slippageDivider = 100 - maxSlippagePct;
  const maxExchangeRate = expectedTokens.mul(slippageMultiplier).div(100); // +slippage
  const minExchangeRate = expectedTokens.mul(slippageDivider).div(100); // -slippage

  const tx = await exchange_contract
    .connect(signer)
    .removeAllLiquidity(maxExchangeRate, minExchangeRate, {
      gasLimit: 200000,
    });
  await tx.wait();
}
//----------------------------------------------------------------------------------------------//
/*** SWAP ***/
async function swapTokensForETH(amountToken, maxSlippagePct) {
  // Inicializácia signera
  const signer = provider.getSigner(defaultAccount);

  // Získanie počtu desatinných miest tokenu
  const decimals = await token_contract.decimals();

  // Konverzia amountToken na jednotky tokenu (wei ekvivalent pre tokeny)
  const amountTokenWei = ethers.utils.parseUnits(
    amountToken.toString(),
    decimals
  );

  //kontrola či má osoba dostatok tokenov
  const userBalance = await token_contract.balanceOf(defaultAccount);
  if (userBalance.lt(amountTokenWei)) {
    alert(
      `Nedostatok tokenov! Požadujete ${ethers.utils.formatUnits(
        amountTokenWei,
        decimals
      )} tokenov, ale máte iba ${ethers.utils.formatUnits(
        userBalance,
        decimals
      )}.`
    );
    $("#log").append(`Swap tokens for ETH error: Insufficient token balance\n`);
    return;
  }

  // Získanie aktuálnych rezerv poolu
  const tokenReserves = await token_contract.balanceOf(exchange_address);
  const ethReserves = await provider.getBalance(exchange_address);
  const [feeNumerator, feeDenominator] = await exchange_contract.getSwapFee();

  // Check pool existence
  if (tokenReserves.eq(0) || ethReserves.eq(0)) {
    alert("Pool nie je inicializovaný!");
    $("#log").append(`Swap tokens for ETH error: Pool does not exist\n`);
    return;
  }

  const amountTokenAfterFee = amountTokenWei
    .mul(feeDenominator - feeNumerator)
    .div(feeDenominator);
  const numerator = amountTokenAfterFee.mul(ethReserves);
  const denominator = tokenReserves.add(amountTokenAfterFee);
  const expectedETH = numerator.div(denominator);

  const slippageDivider = 100 - maxSlippagePct;
  const minExchangeRate = expectedETH.mul(slippageDivider).div(100);
  // Schválenie tokenov pre exchange kontrakt
  const approveTx = await token_contract
    .connect(signer)
    .approve(exchange_address, amountTokenWei);
  await approveTx.wait(); //musí byť transakcia potvrdená aby sme mohli používať kontrakt

  // Odoslanie transakcie na swap
  const tx = await exchange_contract
    .connect(signer)
    .swapTokensForETH(amountTokenWei, minExchangeRate);
  await tx.wait();
}
//----------------------------------------------------------------------------------------------//
async function swapETHForTokens(amountEth, maxSlippagePct) {
  // Konverzia amountEth na Wei
  const amountEthValue = ethers.utils.parseEther(amountEth.toString());

  // Inicializácia signera
  const signer = provider.getSigner(defaultAccount);

  //Pop up ak osoba nemá dostatok ETH
  const balance = await signer.getBalance();
  if (balance.lt(amountEthValue)) {
    alert(
      `Nedostatok ETH! Požadujete ${ethers.utils.formatEther(
        amountEthValue
      )} ETH, ale máte iba ${ethers.utils.formatEther(balance)} ETH.`
    );
    $("#log").append(`Swap ETH for tokens error: Insufficient ETH balance\n`);
    return;
  }

  // Get pool reserves
  const tokenReserves = await token_contract.balanceOf(exchange_address);
  const ethReserves = await provider.getBalance(exchange_address);
  const decimals = await token_contract.decimals();
  const [feeNumerator, feeDenominator] = await exchange_contract.getSwapFee();

  // Check pool existence
  if (tokenReserves.eq(0) || ethReserves.eq(0)) {
    alert("Pool nie je inicializovaný!");
    $("#log").append(`Swap ETH for tokens error: Pool does not exist\n`);
    return;
  }

  // Calculate expected token output using constant product formula
  const amountEthAfterFee = amountEthValue
    .mul(feeDenominator - feeNumerator)
    .div(feeDenominator);
  const numerator = amountEthAfterFee.mul(tokenReserves);
  const denominator = ethReserves.add(amountEthAfterFee);
  const expectedTokens = numerator.div(denominator);

  // Check sufficient reserves
  if (tokenReserves.lte(expectedTokens)) {
    alert(
      `Nedostatok SHR tokenov v pooli! Pool má ${ethers.utils.formatUnits(
        tokenReserves,
        decimals
      )} SHR, ale požadujete ${ethers.utils.formatUnits(
        expectedTokens,
        decimals
      )} SHR.`
    );
    $("#log").append(
      `Swap ETH for tokens error: Insufficient token reserves\n`
    );
    return;
  }

  const slippageDivider = 100 - maxSlippagePct;
  const minExchangeRate = expectedTokens.mul(slippageDivider).div(100);
  // Odoslanie transakcie na swap
  const tx = await exchange_contract
    .connect(signer)
    .swapETHForTokens(minExchangeRate, {
      value: amountEthValue,
      gasLimit: 200000,
    });

  await tx.wait();
}

// =============================================================================
//                                      UI
// =============================================================================

// This sets the default account on load and displays the total owed to that
// account.
provider.listAccounts().then((response) => {
  defaultAccount = response[0];
  // Initialize the exchange
  init().then(() => {
    // fill in UI with current exchange rate:
    getPoolState().then((poolState) => {
      $("#eth-token-rate-display").html(
        "1 ETH = " + poolState["token_eth_rate"] + " " + token_symbol
      );
      $("#token-eth-rate-display").html(
        "1 " + token_symbol + " = " + poolState["eth_token_rate"] + " ETH"
      );

      $("#token-reserves").html(
        poolState["token_liquidity"] + " " + token_symbol
      );
      $("#eth-reserves").html(poolState["eth_liquidity"] + " ETH");
    });
  });
});

// Allows switching between accounts in 'My Account'
provider.listAccounts().then((response) => {
  var opts = response.map(function (a) {
    return (
      '<option value="' + a.toLowerCase() + '">' + a.toLowerCase() + "</option>"
    );
  });
  $(".account").html(opts);
});

// This runs the 'swapETHForTokens' function when you click the button
$("#swap-eth").click(function () {
  defaultAccount = $("#myaccount").val(); //sets the default account
  swapETHForTokens($("#amt-to-swap").val(), $("#max-slippage-swap").val()).then(
    (response) => {
      updateUI(); // refreshes the page after add_IOU returns and the promise is unwrapped
    }
  );
});

// This runs the 'swapTokensForETH' function when you click the button
$("#swap-token").click(function () {
  defaultAccount = $("#myaccount").val(); //sets the default account
  swapTokensForETH($("#amt-to-swap").val(), $("#max-slippage-swap").val()).then(
    (response) => {
      updateUI(); // refreshes the page after add_IOU returns and the promise is unwrapped
    }
  );
});

// This runs the 'addLiquidity' function when you click the button
$("#add-liquidity").click(function () {
  console.log("Account: ", $("#myaccount").val());
  defaultAccount = $("#myaccount").val(); //sets the default account
  addLiquidity($("#amt-eth").val(), $("#max-slippage-liquid").val()).then(
    (response) => {
      updateUI(); // refreshes the page after add_IOU returns and the promise is unwrapped
    }
  );
});

// This runs the 'removeLiquidity' function when you click the button
$("#remove-liquidity").click(function () {
  defaultAccount = $("#myaccount").val(); //sets the default account
  removeLiquidity($("#amt-eth").val(), $("#max-slippage-liquid").val()).then(
    (response) => {
      updateUI(); // refreshes the page after add_IOU returns and the promise is unwrapped
    }
  );
});

// This runs the 'removeAllLiquidity' function when you click the button
$("#remove-all-liquidity").click(function () {
  defaultAccount = $("#myaccount").val(); //sets the default account
  removeAllLiquidity($("#max-slippage-liquid").val()).then((response) => {
    updateUI(); // refreshes the page after add_IOU returns and the promise is unwrapped
  });
});

$("#swap-eth").html("Swap ETH for " + token_symbol);

$("#swap-token").html("Swap " + token_symbol + " for ETH");

$("#title").html(exchange_name);

// This is a log function, provided if you want to display things to the page instead of the JavaScript console
// Pass in a discription of what you're printing, and then the object to print
function log(description, obj) {
  $("#log").html(
    $("#log").html() +
      description +
      ": " +
      JSON.stringify(obj, null, 2) +
      "\n\n"
  );
}

const updateUI = async function () {
  try {
    const poolState = await getPoolState();
    $("#eth-token-rate-display").html(
      "1 ETH = " + poolState["token_eth_rate"] + " " + token_symbol
    );
    $("#token-eth-rate-display").html(
      "1 " + token_symbol + " = " + poolState["eth_token_rate"] + " ETH"
    );
    $("#token-reserves").html(
      poolState["token_liquidity"] + " " + token_symbol
    );
    $("#eth-reserves").html(poolState["eth_liquidity"] + " ETH");
    console.log("UI updated with new pool state.");

    // Clear all input fields
    $("#amt-to-swap").val("");
    $("#max-slippage-swap").val("");
    $("#amt-eth").val("");
    $("#max-slippage-liquid").val("");
  } catch (error) {
    console.error("Error updating UI:", error);
  }
};

// =============================================================================
//                                SANITY CHECK
// =============================================================================
function check(name, swap_rate, condition) {
  if (condition) {
    console.log(name + ": SUCCESS");
    return swap_rate == 0 ? 6 : 10;
  } else {
    console.log(name + ": FAILED");
    return 0;
  }
}

const sanityCheck = async function () {
  var swap_fee = await exchange_contract
    .connect(provider.getSigner(defaultAccount))
    .getSwapFee();
  console.log("Beginning Sanity Check.");

  var accounts = await provider.listAccounts();
  defaultAccount = accounts[0];
  var score = 0;
  var start_state = await getPoolState();
  var start_tokens = await token_contract
    .connect(provider.getSigner(defaultAccount))
    .balanceOf(defaultAccount);

  // No liquidity provider rewards implemented yet
  if (Number(swap_fee[0]) == 0) {
    await swapETHForTokens(100, 1);
    var state1 = await getPoolState();
    var expected_tokens_received = 100 * start_state.token_eth_rate;
    var user_tokens1 = await token_contract
      .connect(provider.getSigner(defaultAccount))
      .balanceOf(defaultAccount);
    score += check(
      "Testing simple exchange of ETH to token",
      swap_fee[0],
      Math.abs(
        start_state.token_liquidity -
          expected_tokens_received -
          state1.token_liquidity
      ) < 5 &&
        state1.eth_liquidity - start_state.eth_liquidity === 100 &&
        Math.abs(
          Number(start_tokens) / 1e18 +
            expected_tokens_received -
            Number(user_tokens1) / 1e18
        ) < 5
    );

    await swapTokensForETH(100, 1);
    var state2 = await getPoolState();
    var expected_eth_received = 100 * state1.eth_token_rate;
    var user_tokens2 = await token_contract
      .connect(provider.getSigner(defaultAccount))
      .balanceOf(defaultAccount);
    score += check(
      "Test simple exchange of token to ETH",
      swap_fee[0],
      state2.token_liquidity === state1.token_liquidity + 100 &&
        Math.abs(
          state1.eth_liquidity - expected_eth_received - state2.eth_liquidity
        ) < 5 &&
        Number(user_tokens2) / 1e18 === Number(user_tokens1) / 1e18 - 100
    );

    await addLiquidity(100, 1);
    var expected_tokens_added = 100 * state2.token_eth_rate;
    var state3 = await getPoolState();
    var user_tokens3 = await token_contract
      .connect(provider.getSigner(defaultAccount))
      .balanceOf(defaultAccount);
    score += check(
      "Test adding liquidity",
      swap_fee[0],
      state3.eth_liquidity === state2.eth_liquidity + 100 &&
        Math.abs(
          state3.token_liquidity -
            (state2.token_liquidity + expected_tokens_added)
        ) < 5 &&
        Math.abs(
          Number(user_tokens3) / 1e18 -
            (Number(user_tokens2) / 1e18 - expected_tokens_added)
        ) < 5
    );

    await removeLiquidity(10, 1);
    var expected_tokens_removed = 10 * state3.token_eth_rate;
    var state4 = await getPoolState();
    var user_tokens4 = await token_contract
      .connect(provider.getSigner(defaultAccount))
      .balanceOf(defaultAccount);
    score += check(
      "Test removing liquidity",
      swap_fee[0],
      state4.eth_liquidity === state3.eth_liquidity - 10 &&
        Math.abs(
          state4.token_liquidity -
            (state3.token_liquidity - expected_tokens_removed)
        ) < 5 &&
        Math.abs(
          Number(user_tokens4) / 1e18 -
            (Number(user_tokens3) / 1e18 + expected_tokens_removed)
        ) < 5
    );

    await removeAllLiquidity(1);
    expected_tokens_removed = 90 * state4.token_eth_rate;
    var state5 = await getPoolState();
    var user_tokens5 = await token_contract
      .connect(provider.getSigner(defaultAccount))
      .balanceOf(defaultAccount);
    score += check(
      "Test removing all liquidity",
      swap_fee[0],
      state5.eth_liquidity - (state4.eth_liquidity - 90) < 5 &&
        Math.abs(
          state5.token_liquidity -
            (state4.token_liquidity - expected_tokens_removed)
        ) < 5 &&
        Math.abs(
          Number(user_tokens5) / 1e18 -
            (Number(user_tokens4) / 1e18 + expected_tokens_removed)
        ) < 5
    );
  }

  // LP provider rewards implemented
  else {
    var swap_fee = swap_fee[0] / swap_fee[1];
    console.log("swap fee: ", swap_fee);

    await swapETHForTokens(100, 1);
    var state1 = await getPoolState();
    var expected_tokens_received =
      100 * (1 - swap_fee) * start_state.token_eth_rate;
    var user_tokens1 = await token_contract
      .connect(provider.getSigner(defaultAccount))
      .balanceOf(defaultAccount);
    score += check(
      "Testing simple exchange of ETH to token",
      swap_fee[0],
      Math.abs(
        start_state.token_liquidity -
          expected_tokens_received -
          state1.token_liquidity
      ) < 5 &&
        state1.eth_liquidity - start_state.eth_liquidity === 100 &&
        Math.abs(
          Number(start_tokens) / 1e18 +
            expected_tokens_received -
            Number(user_tokens1) / 1e18
        ) < 5
    );

    await swapTokensForETH(100, 1);
    var state2 = await getPoolState();
    var expected_eth_received = 100 * (1 - swap_fee) * state1.eth_token_rate;
    var user_tokens2 = await token_contract
      .connect(provider.getSigner(defaultAccount))
      .balanceOf(defaultAccount);
    score += check(
      "Test simple exchange of token to ETH",
      swap_fee[0],
      state2.token_liquidity === state1.token_liquidity + 100 &&
        Math.abs(
          state1.eth_liquidity - expected_eth_received - state2.eth_liquidity
        ) < 5 &&
        Number(user_tokens2) / 1e18 === Number(user_tokens1) / 1e18 - 100
    );

    await addLiquidity(100, 1);
    var expected_tokens_added = 100 * state2.token_eth_rate;
    var state3 = await getPoolState();
    var user_tokens3 = await token_contract
      .connect(provider.getSigner(defaultAccount))
      .balanceOf(defaultAccount);
    score += check(
      "Test adding liquidity",
      swap_fee[0],
      state3.eth_liquidity === state2.eth_liquidity + 100 &&
        Math.abs(
          state3.token_liquidity -
            (state2.token_liquidity + expected_tokens_added)
        ) < 5 &&
        Math.abs(
          Number(user_tokens3) / 1e18 -
            (Number(user_tokens2) / 1e18 - expected_tokens_added)
        ) < 5
    );

    // accumulate some lp rewards
    for (var i = 0; i < 20; i++) {
      await swapETHForTokens(100, 1);
      await swapTokensForETH(100, 1);
    }

    var state4 = await getPoolState();
    var user_tokens4 = await token_contract
      .connect(provider.getSigner(defaultAccount))
      .balanceOf(defaultAccount);
    await removeLiquidity(10, 1);
    // set to 22 for a bit of leeway, could potentially reduce to 20
    var expected_tokens_removed =
      (10 + 22 * 100 * swap_fee) * state3.token_eth_rate;
    var state5 = await getPoolState();
    var user_tokens5 = await token_contract
      .connect(provider.getSigner(defaultAccount))
      .balanceOf(defaultAccount);
    score += check(
      "Test removing liquidity",
      swap_fee[0],
      state5.eth_liquidity === state4.eth_liquidity - 10 &&
        Math.abs(
          state5.token_liquidity -
            (state4.token_liquidity - expected_tokens_removed)
        ) <
          expected_tokens_removed * 1.2 &&
        Math.abs(
          Number(user_tokens5) / 1e18 -
            (Number(user_tokens4) / 1e18 + expected_tokens_removed)
        ) <
          expected_tokens_removed * 1.2
    );

    await removeAllLiquidity(1);
    expected_tokens_removed =
      (90 + 22 * 100 * swap_fee) * state5.token_eth_rate;
    var state6 = await getPoolState();
    var user_tokens6 = await token_contract
      .connect(provider.getSigner(defaultAccount))
      .balanceOf(defaultAccount);
    score += check(
      "Test removing all liquidity",
      swap_fee[0],
      Math.abs(state6.eth_liquidity - (state5.eth_liquidity - 90)) < 5 &&
        Math.abs(
          state6.token_liquidity -
            (state5.token_liquidity - expected_tokens_removed)
        ) <
          expected_tokens_removed * 1.2 &&
        Number(user_tokens6) / 1e18 > Number(user_tokens5) / 1e18
    );
  }
  console.log("Final score: " + score + "/50");
  updateUI();
};

// Sleep 3s to ensure init() finishes before sanityCheck() runs on first load.
// If you run into sanityCheck() errors due to init() not finishing, please extend the sleep time.

setTimeout(function () {
  sanityCheck();
}, 3000);
