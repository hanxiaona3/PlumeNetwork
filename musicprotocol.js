import {ethers} from 'ethers'
import solidviolet from './Contract/solidviolet.json' assert { type: 'json' };
import RPC from '../../config/runnerRPC-1.json' assert { type: 'json' };
import {PrivateKeys$18Wallets,PrivateKeys$136Wallets} from '../../util/privateKey.js';
import {walletContract, sleep,RPC_provider,walletSendtxData,NewPrivatKeys,formHexData} from '../../util/common.js';
import pLimit from 'p-limit';

const CONCURRENCY_LIMIT=10;


async function musicprotocolF(wallet){
    const address=wallet.address;
    console.log(`musicprotocol的approve过程。。。。。。。。。。。。。。。。。。`);
    const Interacted_contract_Token='0x5c1409a46cD113b3A667Db6dF0a8D7bE37ed3BB3';
    const spender=`0x712516e61C8B383dF4A63CFe83d7701Bce54B03e`;
    const randdata=Math.floor(Math.random()*(5-1)+1);
    let txData = {
        to: Interacted_contract_Token, 
        data: `0x095ea7b3${formHexData(spender.substring(2))}${formHexData(BigInt(ethers.parseEther(randdata.toString())).toString(16))}`,
        value: 0,
    };
    await walletSendtxData(wallet,txData);
    console.log(`musicprotocol的deposit过程。。。。。。。。。。。。。。。。。。`);
    txData = {
        to: spender, 
        data: `0xd96a094a${formHexData(BigInt(ethers.parseEther(randdata.toString())).toString(16))}`,
        value: 0,
    };
    await walletSendtxData(wallet,txData); 

}
const main=async(privateKeys)=>{

    console.log(`当前时间是：${new Date()}`);
    const limit = pLimit(CONCURRENCY_LIMIT);
    const tasks=privateKeys.map(privateKey=>
        limit(async ()=>{
            let Plume_wallet=new ethers.Wallet(privateKey,await RPC_provider(RPC.plumerpc));
            console.log(`地址：${Plume_wallet.address}`);
            // console.log(`第${index+1}个钱包，地址：${Plume_wallet.address}`);
            await musicprotocolF(Plume_wallet);    
            await sleep(3);
        })
     );
    await Promise.allSettled(tasks)
    .then(()=>
        console.log(`任务已完成`)
    )
    .catch(error=>{
        console.error(error.message);
    });
}

main(NewPrivatKeys(PrivateKeys$18Wallets)).catch(error=>{
    console.error(error.message);  
})







    // for (let index = 0; index <privateKeys.length; index++) {//PrivateKeys$18Wallets.length 1 3-10 14 17 18 1 678910 14privateKeys.length
    //     let Plume_wallet=new ethers.Wallet(privateKeys[index],await RPC_provider(RPC.plumerpc));
    //     console.log(`第${index+1}个钱包，地址：${Plume_wallet.address}`);
    //     await solidvioletF(Plume_wallet);    
    // }
