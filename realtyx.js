import {ethers} from 'ethers'
import solidviolet from './Contract/solidviolet.json' assert { type: 'json' };
import RPC from '../../config/runnerRPC-1.json' assert { type: 'json' };
import {PrivateKeys$18Wallets,PrivateKeys$136Wallets} from '../../util/privateKey.js';
import {walletContract, sleep,RPC_provider,walletSendtxData,NewPrivatKeys,formHexData} from '../../util/common.js';
import pLimit from 'p-limit';

const CONCURRENCY_LIMIT=10;


async function realtyxF(wallet){
    const address=wallet.address;
    console.log(`realtyx ust的approve过程。。。。。。。。。。。。。。。。。。`);
    let Interacted_contract_Token='0x5c1409a46cD113b3A667Db6dF0a8D7bE37ed3BB3';
    let spender=`0x67268653D34F7b95008DF76cd80DA7a0087572B2`;
    // const randdata=Math.floor(Math.random()*(5-1)+1);
    let txData = {
        to: Interacted_contract_Token, 
        data: `0x095ea7b300000000000000000000000067268653d34f7b95008df76cd80da7a0087572b20000000000000000000000000000000000000000000000008ac7230489e80000`,
        value: 0,
    };
    await walletSendtxData(wallet,txData);
    console.log(`realtyx ust的deposit过程。。。。。。。。。。。。。。。。。。`);
    txData = {
        to: spender, 
        data: `0xa6b26387`,
        value: 0,
    };
    await walletSendtxData(wallet,txData); 

    Interacted_contract_Token='0xFB28084E8145976122A7d4415e1E41e7E4dB8531';
    spender=`0x67268653D34F7b95008DF76cd80DA7a0087572B2`;
    // const randdata=Math.floor(Math.random()*(5-1)+1);
    txData = {
        to: spender, 
        data: `0x095ea7b3000000000000000000000000fb28084e8145976122a7d4415e1e41e7e4db853100000000000000000000000000000000000000000000000002c68af0bb140000`,
        value: 0,
    };
    await walletSendtxData(wallet,txData);
    console.log(`realtyx的deposit过程。。。。。。。。。。。。。。。。。。`);
    txData = {
        to: Interacted_contract_Token, 
        data: `0xa0712d6800000000000000000000000000000000000000000000000002c68af0bb140000`,
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
            await realtyxF(Plume_wallet);    
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
