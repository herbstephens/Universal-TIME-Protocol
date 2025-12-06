# Makefile for Smart Contracts
# Private-keys exposed are from Anvil local test node only. Not production.
# contract addresses are examples on local Anvil node, may be regenerated and changed.
deploy:
	forge script script/Deploy.s.sol:DeployScript --rpc-url http://localhost:8545 --broadcast --private-key 0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6
	forge script script/Deploy.s.sol:DeployScript --rpc-url $SEPOLIA_URL --private-key $SEPOLIA_KEY --verify --etherscan-api-key $API_KEY --broadcast
	forge script script/Deploy.s.sol --rpc-url $WORLD_RPC --private-key $P_KEY --broadcast --verify --etherscan-api-key $API_KEY --chain-id 480

propose:
	cast send 0xc6B8FBF96CF7bbE45576417EC2163AcecFA88ECC \
"propose(address,uint256,uint256,uint256[8])" \
0x70997970C51812dc3A010C7d01b50e0d17dc79C8 1 1111 '[0,0,0,0,0,0,0,0]' \
--private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --rpc-url http://localhost:8545

accept:
	cast send 0xc6B8FBF96CF7bbE45576417EC2163AcecFA88ECC \
"accept(address,uint256,uint256,uint256[8])" \
0xF39Fd6e51aad88F6F4ce6aB8827279cffFb92266 1 2222 '[0,0,0,0,0,0,0,0]' \
--private-key 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d --rpc-url http://localhost:8545

get-pending-yield:
	cast call 0xd04fF4A75Edd737A73E92b2F2274Cb887d96E110 "getPendingYield(address,address)" 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 0xF39Fd6e51aad88F6F4ce6aB8827279cffFb92266 --rpc-url http://localhost:8545

claim-yield:
	cast send 0xd04fF4A75Edd737A73E92b2F2274Cb887d96E110 \
"claimYield(address)" 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 \
--private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
--rpc-url http://localhost:8545

divorce:
	cast send 0x0C8E79F3534B00D9a3D4a856B665Bf4eBC22f2ba \
"divorce(address)" 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 \
--private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
--rpc-url http://localhost:8545

check-balances:
	cast call 0x196dBCBb54b8ec4958c959D8949EBFE87aC2Aaaf "balanceOf(address)" 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
	cast call 0x196dBCBb54b8ec4958c959D8949EBFE87aC2Aaaf "balanceOf(address)" 0x70997970C51812dc3A010C7d01b50e0d17dc79C8

check-current-vow-cid:
	cast call 0x12975173B87F7595EE45dFFb2Ab812ECE596Bf84 "imageCID()" --rpc-url http://localhost:8545

update-vow-cid:
	cast send 0x12975173B87F7595EE45dFFb2Ab812ECE596Bf84 "setImageCID(string)" "ipfs://QmYtW588fM3RBMGTmoCRWcA79AZZfhcgTxAYRXSP71XF77" --rpc-url http://localhost:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

checkandmint-milestone:
	cast send 0xc6B8FBF96CF7bbE45576417EC2163AcecFA88ECC "manualCheckAndMint(address)" 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 --rpc-url http://localhost:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

check-milestone-uri:
	cast call 0x196dBCBb54b8ec4958c959D8949EBFE87aC2Aaaf "tokenURI(uint256)" 1 --rpc-url http://localhost:8545
	cast call 0xA15BB66138824a1c7167f5E85b957d04Dd34E468 "tokenURI(uint256)" 2 --rpc-url http://localhost:8545 
	cast call 0x196dBCBb54b8ec4958c959D8949EBFE87aC2Aaaf "ownerOf(uint256)" 1 --rpc-url http://localhost:8545
	cast call 0x196dBCBb54b8ec4958c959D8949EBFE87aC2Aaaf "ownerOf(uint256)" 2 --rpc-url http://localhost:8545
	cast call 0x196dBCBb54b8ec4958c959D8949EBFE87aC2Aaaf "totalSupply()" --rpc-url http://localhost:8545

check-current-block:
	cast block latest --rpc-url http://localhost:8545

fast-forward-oneyear:
	cast rpc evm_increaseTime 31538000 --rpc-url http://localhost:8545
    cast rpc evm_mine --rpc-url http://localhost:8545