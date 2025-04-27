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
    uint private token_provider_reserves = 0;
    uint private eth_provider_reserves = 0;

    mapping(address => uint) private lps; // LP shares (in wei, proportional to contribution)
     
    // Needed for looping through the keys of the lps mapping
    address[] private lp_providers;                     

    // liquidity rewards
    uint private swap_fee_numerator = 3;                
    uint private swap_fee_denominator = 100;

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
        uint numerator = msg.value * token_reserves;
        uint denominator = eth_reserves + msg.value;
        uint expectedTokens = numerator / denominator;
        //Kontrola poctu tokenov
        require(token.balanceOf(msg.sender) >= expectedTokens, "Not enough SHR tokens");

        //Kontrola slippage
        require(max_exchange_rate >= expectedTokens, "Exchange rate exceeds max");
        require(expectedTokens >= min_exchange_rate, "Exchange rate below min");
        //Uprava poolov
        eth_provider_reserves += msg.value;
        eth_reserves += msg.value;
        token_provider_reserves += expectedTokens;
        token_reserves += expectedTokens;
        if (!isAlreadyLP(msg.sender)) {
            lp_providers.push(msg.sender);
        }
        lps[msg.sender] += msg.value;
        token.transferFrom(msg.sender, address(this), expectedTokens);

        k = token_reserves * eth_reserves;
    }


    // Function removeLiquidity: Removes liquidity given the desired amount of ETH to remove.
    // You can change the inputs, or the scope of your function, as needed.
    function removeLiquidity(uint max_exchange_rate, uint min_exchange_rate)
        public 
        payable
    {
        require(msg.value > 0, "Cant withdraw 0 ETH");
        
        uint numerator = msg.value * token_reserves;
        uint denominator = eth_reserves + msg.value;
        uint expectedTokens = numerator / denominator;

        require(max_exchange_rate >= expectedTokens, "Exchange rate exceeds max");
        require(expectedTokens >= min_exchange_rate, "Exchange rate below min");

        require(lps[msg.sender] >= msg.value, "Can't withdraw more ETH than staked");
        require(eth_provider_reserves - msg.value > 0, "Can't withdraw ETH to drain reserves");
        require(token_provider_reserves - expectedTokens > 0, "Can't withdraw SHR to drain reserves");

        console.log("ETH: ", eth_reserves);
        eth_provider_reserves -= msg.value;
        eth_reserves -= msg.value;
        token_provider_reserves -= expectedTokens;
        token_reserves -= expectedTokens;

        lps[msg.sender] -= msg.value;
        
        if(lps[msg.sender] == 0){
            for(uint i = 0; i < lp_providers.length; i++){
                if(lp_providers[i] == msg.sender){
                    removeLP(i);
                    break;
                }
            } 
        }
        console.log("removing: ", msg.value);
        console.log("adres:", msg.sender);
        token.transfer(msg.sender, expectedTokens);
        uint amountETH = msg.value * eth_reserves / token_reserves;
        //payable(msg.sender).transfer(msg.value);
        payable(msg.sender).transfer(amountETH);
        console.log("ETH AFTER: ", eth_reserves);
        k = token_reserves * eth_reserves;
    }

    // Function removeAllLiquidity: Removes all liquidity that msg.sender is entitled to withdraw
    // You can change the inputs, or the scope of your function, as needed.
    function removeAllLiquidity(uint max_exchange_rate, uint min_exchange_rate)
        external
        payable
    {
        uint value = lps[msg.sender];
        uint numerator = value * token_reserves;
        uint denominator = eth_reserves + value;
        uint expectedTokens = numerator / denominator;

        require(max_exchange_rate >= expectedTokens, "Exchange rate exceeds max");
        require(expectedTokens >= min_exchange_rate, "Exchange rate below min");

        require(eth_provider_reserves - value > 0, "Can't withdraw ETH to drain reserves");
        require(token_provider_reserves - expectedTokens > 0, "Can't withdraw SHR to drain reserves");

        eth_provider_reserves -= value;
        eth_reserves -= value;
        token_provider_reserves -= expectedTokens;
        token_reserves -= expectedTokens;

        token.transfer(msg.sender, expectedTokens);
        payable(msg.sender).transfer(value);
        lps[msg.sender] = 0;

        for(uint i = 0; i < lp_providers.length; i++){
            if(lp_providers[i] == msg.sender){
                removeLP(i);
                break;
            }
        }
        k = token_reserves * eth_reserves;
    }
    /***  Define additional functions for liquidity fees here as needed ***/


    /* ========================= Swap Functions =========================  */ 

    // Function swapTokensForETH: Swaps your token with ETH
    // You can change the inputs, or the scope of your function, as needed.
    function swapTokensForETH(uint amountTokens, uint max_exchange_rate)
        external 
        payable
    {
        // Kontrola, či je zadané množstvo tokenov nenulové
        require(amountTokens > 0, "Need tokens to swap");

        // Kontrola, či pool existuje
        require(token_reserves > 0 && eth_reserves > 0, "Pool does not exist");

        // Kontrola, či má používateľ dostatok tokenov
        require(amountTokens <= token.balanceOf(msg.sender), "Not enough tokens to swap");

        // Výpočet aktuálneho výmenného kurzu (ETH za 1 token)
        uint current_rate = eth_reserves / token_reserves;

        // Kontrola slippage (max_exchange_rate je minimálny kurz ETH za 1 token)
        require(current_rate >= max_exchange_rate, "Exchange rate below min");

        // Výpočet množstva ETH na poslanie (zachovanie x * y = k)
        uint amountETH = amountTokens * eth_reserves / token_reserves;
        require(amountETH < eth_reserves, "No ETH to swap");

        // Kontrola, či zostane aspoň 1 ETH a 1 token v pooli
        require(eth_reserves - amountETH >= 1, "Must leave at least 1 ETH");
        require(token_reserves + amountTokens >= 1, "Must leave at least 1 token");

        // Aktualizácia rezerv
        token_reserves += amountTokens;
        eth_reserves -=  amountETH;
        // Aktualizácia k (kvôli zaokrúhľovaniu)
        k = token_reserves * eth_reserves;

        // Transfer tokenov do kontraktu a ETH používateľovi
        token.transferFrom(msg.sender, address(this), amountTokens);
        payable(msg.sender).transfer(amountETH);

        // Logovanie pre debugging (voliteľné)
        console.log("Swapped tokens:", amountTokens, "for ETH:", amountETH);
    }

    // Function swapETHForTokens: Swaps ETH for your tokens
    // ETH is sent to contract as msg.value
    // You can change the inputs, or the scope of your function, as needed.
    function swapETHForTokens(uint max_exchange_rate) external payable 
    {
        // Kontrola, či je zadané množstvo ETH nenulové
        require(msg.value > 0, "Need ETH to swap");

        // Kontrola, či pool existuje
        require(token_reserves > 0 && eth_reserves > 0, "Pool does not exist");

        // Výpočet aktuálneho výmenného kurzu (tokeny za 1 ETH)
        uint current_rate = token_reserves / eth_reserves;

        // Kontrola slippage (max_exchange_rate je maximálny kurz tokenov za 1 ETH)
        require(current_rate <= max_exchange_rate, "Exchange rate exceeds max");

        // Výpočet množstva tokenov na poslanie (zachovanie x * y = k)
        uint amountTokens = msg.value * token_reserves / eth_reserves;
        require(amountTokens < token_reserves, "No tokens to swap");

        // Kontrola, či zostane aspoň 1 ETH a 1 token v pooli
        require(token_reserves - amountTokens >= 1, "Must leave at least 1 ETH");
        require(eth_reserves + msg.value >= 1, "Must leave at least 1 token");

        // Aktualizácia rezerv
        token_reserves -= amountTokens;
        eth_reserves += msg.value;

        // Aktualizácia k (kvôli zaokrúhľovaniu)
        k = token_reserves * eth_reserves;

        // Transfer tokenov používateľovi (ETH už bolo prijaté cez msg.value)
        token.transfer(msg.sender, amountTokens);

        // Logovanie pre debugging (voliteľné)
        console.log("Swapped ETH:", msg.value, "for tokens:", amountTokens);
    }
}
