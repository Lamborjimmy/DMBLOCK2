// =================== FIIT DEX Project =================== //
//        @authors:  Martin Farkaš // Jaroslav Ertl
// ========================================================= //
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;


import './token.sol';
import "hardhat/console.sol";


contract TokenExchange is Ownable {
    string public exchange_name = 'Zmenaren';

    address tokenAddr = 0x5FbDB2315678afecb367f032d93F642f64180aa3;     // TODO: paste token contract address here
    Token public token = Token(tokenAddr);       //tokenAddr                         

    // Liquidity pool for the exchange
    uint private token_reserves = 0;
    uint private eth_reserves = 0;

    mapping(address => uint) private lps; // LP shares ( proportional to contribution)
    uint public totalShares;
     
    // Needed for looping through the keys of the lps mapping
    address[] private lp_providers;                     

    // liquidity rewards
    uint private swap_fee_numerator = 3;                
    uint private swap_fee_denominator = 100;

    // Unikátna adresa pre počiatočného providera
    address private constant INITIAL_LP_ADDRESS = address(uint160(uint(keccak256(abi.encodePacked("initial_pool_address")))));

    // Constant: x * y = k
    uint private k;

    constructor() {}
    

    // Function createPool: Initializes a liquidity pool between your Token and ETH.
    // ETH will be sent to pool in this transaction as msg.value
    // amountTokens specifies the amount of tokens to transfer from the liquidity provider.
    // Sets up the initial exchange rate for the pool by setting amount of token and amount of ETH.
    function createPool(uint amountTokens) external payable onlyOwner
    {
        // This function is already implemented for you; no changes needed.

        // require pool does not yet exist:
        require (token_reserves == 0, "Token reserves was not 0");
        require (eth_reserves == 0, "ETH reserves was not 0.");

        // require nonzero values were sent
        require (msg.value > 0, "Need eth to create pool.");
        uint tokenSupply = token.balanceOf(msg.sender);
        require(amountTokens <= tokenSupply, "Not have enough tokens to create the pool");
        require (amountTokens > 0, "Need tokens to create pool.");

        token.transferFrom(msg.sender, address(this), amountTokens);
        token_reserves = token.balanceOf(address(this));

        eth_reserves = msg.value;
        lps[INITIAL_LP_ADDRESS] = msg.value;
        totalShares = msg.value;
        lp_providers.push(INITIAL_LP_ADDRESS);
        
        k = token_reserves * eth_reserves;
    }

    // Function removeLP: removes a liquidity provider from the list.
    // This function also removes the gap left over from simply running "delete".
    function removeLP(uint index) private {
        require(index < lp_providers.length, "specified index is larger than the number of lps");
        lp_providers[index] = lp_providers[lp_providers.length - 1];
        lp_providers.pop();
    }

    // Function getSwapFee: Returns the current swap fee ratio to the client.
    function getSwapFee() public view returns (uint, uint) {
        return (swap_fee_numerator, swap_fee_denominator);
    }

    // ============================================================
    //                    FUNCTIONS TO IMPLEMENT
    // ============================================================
    
    /* ========================= Liquidity Provider Functions =========================  */ 

    // Function addLiquidity: Adds liquidity given a supply of ETH (sent to the contract as msg.value).
    // You can change the inputs, or the scope of your function, as needed.
    
    //when adding new liquidity provider, check if they are not already an LP
    function isAlreadyLP(address lp) private view returns (bool) {
        for(uint i = 0; i < lp_providers.length; i++) {
            if (lp_providers[i] == lp) {
                return true;
            }
        }
        return false;
    }

    //calculate the total liquidity in the pool to determine proportional contributions
    function totalLiquidity() public view returns (uint) {
        uint total = 0;
        for(uint i = 0; i < lp_providers.length; i++) {
            total += lps[lp_providers[i]];
        }
        return total == 0 ? 1 : total;
    }
    function getLiquidity(address provider) public view returns (uint){
        return lps[provider];
    }
    function addLiquidity(uint max_exchange_rate, uint min_exchange_rate) 
        external 
        payable
    {   
        //Kontrola mnozstva ETH
        require(msg.value > 0, "Need ETH to add liquidity");
        
        //Vypocet ocakavanych tokenov
        uint expectedTokens = (msg.value * token_reserves) / eth_reserves;
        //Kontrola poctu tokenov
        require(token.balanceOf(msg.sender) >= expectedTokens, "Not enough SHR tokens");

        //Kontrola slippage
        require(max_exchange_rate >= expectedTokens, "Exchange rate exceeds max");
        require(expectedTokens >= min_exchange_rate, "Exchange rate below min");

        // Calculate shares to mint
        uint sharesToMint = (msg.value * totalShares) / eth_reserves;

        //Uprava poolov
        eth_reserves += msg.value;
        token_reserves += expectedTokens;
        lps[msg.sender] += sharesToMint;
        totalShares += sharesToMint;
        if (!isAlreadyLP(msg.sender)) {
            lp_providers.push(msg.sender);
        }

        token.transferFrom(msg.sender, address(this), expectedTokens);

        k = token_reserves * eth_reserves;
    }


    // Function removeLiquidity: Removes liquidity given the desired amount of ETH to remove.
    // You can change the inputs, or the scope of your function, as needed.
    function removeLiquidity(uint amountETH, uint max_exchange_rate, uint min_exchange_rate)
        public 
        payable
    {
        require(amountETH > 0, "Cant withdraw 0 ETH");

        // Výpočet podielov na spálenie
        uint sharesToBurn = (amountETH * totalShares) / eth_reserves;
        require(sharesToBurn <= lps[msg.sender], "Not enough shares");

        // Výpočet očakávaných tokenov
        uint expectedTokens = (amountETH * token_reserves) / eth_reserves;

        // Kontrola slippage
        require(max_exchange_rate >= expectedTokens, "Exchange rate exceeds max");
        require(expectedTokens >= min_exchange_rate, "Exchange rate below min");

        // Výpočet nároku LP
        uint lpShareProportion = (lps[msg.sender] * 1e18) / totalShares; // Škálovanie pre presnosť
        uint lpEthShare = (eth_reserves * lpShareProportion) / 1e18;
        uint lpTokenShare = (token_reserves * lpShareProportion) / 1e18;

        // Kontrola celkového nároku
        require(lpEthShare  >= amountETH, "Insufficient ETH share (including fees)");
        require(lpTokenShare >= expectedTokens, "Insufficient token share (including fees)");

        // Kontrola, aby nedošlo k vyčerpaniu rezerv
        require(eth_reserves > amountETH, "Cannot drain ETH reserves");
        require(token_reserves > expectedTokens, "Cannot drain token reserves");

        // Aktualizácia rezerv a poplatkov
        eth_reserves -= amountETH;
        token_reserves -= expectedTokens;

        // Aktualizácia podielov
        lps[msg.sender] -= sharesToBurn;
        totalShares -= sharesToBurn;

        // Odstránenie LP, ak nemá žiadne podiely
        if (lps[msg.sender] == 0) {
            for (uint i = 0; i < lp_providers.length; i++) {
                if (lp_providers[i] == msg.sender) {
                    removeLP(i);
                    break;
                }
            }
        }

        payable(msg.sender).transfer(amountETH);
        token.transfer(msg.sender, expectedTokens);

        // Aktualizácia konštanty k
        k = token_reserves * eth_reserves;
    }

    // Function removeAllLiquidity: Removes all liquidity that msg.sender is entitled to withdraw
    // You can change the inputs, or the scope of your function, as needed.
    function removeAllLiquidity(uint max_exchange_rate, uint min_exchange_rate)
        external
        payable
    {
        uint value = lps[msg.sender];
        uint amountETH = (value * eth_reserves) / totalShares;
        uint expectedTokens = (amountETH * token_reserves) / eth_reserves;

        require(max_exchange_rate >= expectedTokens, "Exchange rate exceeds max");
        require(expectedTokens >= min_exchange_rate, "Exchange rate below min");

        require(eth_reserves - amountETH > 0, "Can't withdraw ETH to drain reserves");
        require(token_reserves- expectedTokens > 0, "Can't withdraw SHR to drain reserves");
        
        eth_reserves -= amountETH;
        token_reserves -= expectedTokens;
        totalShares -= value;
        lps[msg.sender] = 0;

        for(uint i = 0; i < lp_providers.length; i++){
                if(lp_providers[i] == msg.sender){
                    removeLP(i);
                    break;
                }
            }
    

        token.transfer(msg.sender, expectedTokens);
        payable(msg.sender).transfer(amountETH);
        k = token_reserves * eth_reserves;
    }
    /***  Define additional functions for liquidity fees here as needed ***/


    /* ========================= Swap Functions =========================  */ 

    // Function swapTokensForETH: Swaps your token with ETH
    // You can change the inputs, or the scope of your function, as needed.
    function swapTokensForETH(uint amountTokens, uint min_exchange_rate)
        external 
        payable
    {
        // Kontrola, či je zadané množstvo tokenov nenulové
        require(amountTokens > 0, "Need tokens to swap");

        // Kontrola, či pool existuje
        require(token_reserves > 0 && eth_reserves > 0, "Pool does not exist");

        // Kontrola, či má používateľ dostatok tokenov
        require(amountTokens <= token.balanceOf(msg.sender), "Not enough tokens to swap");

        //calculate fee
        uint fee = (amountTokens * swap_fee_numerator) / swap_fee_denominator;
        uint amountTokensAfterFee = amountTokens - fee;

        // Calculate expected ETH output using constant product formula
        uint expectedETH = (amountTokensAfterFee * eth_reserves) / token_reserves;

        // Check slippage (min_exchange_rate is minimum ETH to receive)
        require(expectedETH >= min_exchange_rate, "Exchange rate below min");
        require(expectedETH < eth_reserves, "No ETH to swap");

        // Kontrola, či zostane aspoň 1 ETH a 1 token v pooli
        require(eth_reserves - expectedETH >= 1, "Must leave at least 1 ETH");
        require(token_reserves + amountTokens >= 1, "Must leave at least 1 token");

        // Aktualizácia rezerv
        token_reserves += amountTokens;
        eth_reserves -=  expectedETH;

        // Transfer tokenov do kontraktu a ETH používateľovi
        token.transferFrom(msg.sender, address(this), amountTokens);
        payable(msg.sender).transfer(expectedETH);

        // Logovanie pre debugging (voliteľné)
        console.log("Swapped tokens:", amountTokens, "for ETH:", expectedETH);
    }

    // Function swapETHForTokens: Swaps ETH for your tokens
    // ETH is sent to contract as msg.value
    // You can change the inputs, or the scope of your function, as needed.
    function swapETHForTokens(uint min_exchange_rate) external payable 
    {
        // Kontrola, či je zadané množstvo ETH nenulové
        require(msg.value > 0, "Need ETH to swap");

        // Kontrola, či pool existuje
        require(token_reserves > 0 && eth_reserves > 0, "Pool does not exist");

        //calculate fees
        uint fee = (msg.value * swap_fee_numerator) / swap_fee_denominator;
        uint ethAfterFee = msg.value - fee;

       // Calculate expected token output using constant product formula Δy= (Δx∗y)/(x+Δx)
        uint expectedTokens = (ethAfterFee * token_reserves) / eth_reserves;

        // Check slippage (min_exchange_rate is minimum tokens to receive)
        require(expectedTokens >= min_exchange_rate, "Exchange rate below min");

        require(expectedTokens < token_reserves, "No tokens to swap");

        // Kontrola, či zostane aspoň 1 ETH a 1 token v pooli
        require(token_reserves - expectedTokens >= 1, "Must leave at least 1 ETH");
        require(eth_reserves + msg.value >= 1, "Must leave at least 1 token");

        // Aktualizácia rezerv
        token_reserves -= expectedTokens;
        eth_reserves += msg.value;

        // Transfer tokenov používateľovi (ETH už bolo prijaté cez msg.value)
        token.transfer(msg.sender, expectedTokens);

        // Logovanie pre debugging (voliteľné)
        console.log("Swapped ETH:", msg.value, "for tokens:", expectedTokens);
    }

    function getProviderShare(address provider)
        external
        view
        returns (uint share, uint tokenShare, uint ethShare)
    {
        share = lps[provider];
        tokenShare = totalShares > 0 ? (share * token_reserves) / totalShares : 0;
        ethShare = totalShares > 0 ? (share * eth_reserves) / totalShares : 0;
    }
}
