import {ethers} from 'ethers'
import solidviolet from './Contract/solidviolet.json' assert { type: 'json' };
import RPC from '../../config/runnerRPC-1.json' assert { type: 'json' };
import {PrivateKeys$18Wallets,PrivateKeys$136Wallets} from '../../util/privateKey.js';
import {walletContract, sleep,RPC_provider,walletSendtxData,NewPrivatKeys,getTokenBalance} from '../../util/common.js';
import pLimit from 'p-limit';
import bulbaswapWETHABI from '../../config/bulbaswapWETHABI.json' assert { type: 'json' };

const CONCURRENCY_LIMIT=10;


const main=async(privateKeys)=>{

    console.log(`当前时间是：${new Date()}`);
    const co=`0xbA22114ec75f0D55C34A5E5A3cf384484Ad9e733`;
    for (let index = 0; index <privateKeys.length; index++) {//PrivateKeys$18Wallets.length 1 3-10 14 17 18 1 678910 14
        let Plume_wallet=new ethers.Wallet(privateKeys[index],await RPC_provider(RPC.plumerpc));
        let amount=await getTokenBalance(co,bulbaswapWETHABI,Plume_wallet);
        console.log(`第${index+1}个钱包，地址：${Plume_wallet.address},数量是：${amount}`);
    }
}

main(NewPrivatKeys(PrivateKeys$18Wallets)).catch(error=>{
    console.error(error.message);  
})

