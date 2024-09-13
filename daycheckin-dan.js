import ethers from 'ethers';
import { PrivateKeys$18Wallets, PrivateKeys$136Wallets } from '../../util/privateKey.js';

// const Plume_Testnet_PRC='https://testnet-rpc.plumenetwork.xyz/http';
// const Plume_Testnet_Provider=new ethers.JsonRpcProvider(Plume_Testnet_PRC);//设置链接PRC
//获取token数量
const provider_url=`https://testnet-rpc.plumenetwork.xyz/http`;
async function walletSendtxData(wallet,txData,maxRetries = 4,timeout=50000){
    let retries = 0;
    let success = false;
    while (retries < maxRetries) {
        try {
            const txPromise = wallet.sendTransaction(txData);
            const transactionResponse= await Promise.race([
                txPromise,
                new Promise((_,reject)=>setTimeout(()=>reject(new Error('TimeOut')),timeout))                
            ]);
            const receipt = await transactionResponse.wait();
            if (receipt.status===1) {
              console.log("交易sucess，hash是:",receipt.hash); 
              retries=maxRetries;
              success=true;
            }else{
              throw new Error(`交易hash是failed，从新进行交易`);              
            }
            await sleep(2)         
            return 0;
        } catch (error) {
            // console.error(`Error occurred: ${error.message}`);//暂时屏蔽掉错误信息
            retries++;
            // console.error(`开始尝试第${retries}次,${error.message}`);
            console.error(`开始尝试第${retries}次`);
            if(retries >= maxRetries){
              console.log(`尝试${maxRetries}次仍然失败，退出交易`);
              // console.error(`kayakfinance领取测试币发生错误,开始尝试第${retries}次`);
              return 1;
                // throw new Error('Max retries exceeded'); 
            }
            await sleep(1);//等待3s时间
        }         
    }
}

//RPC生成器
const RPC_provider=async(rpc)=>{
    let retries=0;
    let maxRetries=4;
    let provider=null;
    while (retries<maxRetries) {
      try {
          provider= new ethers.JsonRpcProvider(rpc);//设置链接PRC
          return provider;//设置链接PRC
      } catch (error) {
          retries++;
          console.error(`网络provider链接失败，开始尝试第${retries}次`);
          await sleep(2);
      } 
    }
    throw new Error("provider连接失败，达到最大重试次数");
  }

async function QianDAO(wallet){
    // console.log(`每天领取测试代币。。。。。。。。。。。。。。。。。。。。。`);
    const Interacted_contract_Token='0x8Dc5b3f1CcC75604710d9F464e3C5D2dfCAb60d8';
    const txData = {
        to: Interacted_contract_Token, 
        data: `0x183ff085`,
        value: 0,
    };
    await walletSendtxData(wallet,txData);
}

const main=async(privateKeys)=>{
    for (let index = 0; index <privateKeys.length; index++) {//PrivateKeys$18Wallets.length
        let Plume_wallet=new ethers.Wallet(privateKeys[index],await RPC_provider(provider_url));
        console.log(`第${index+1}个钱包，地址：${Plume_wallet.address}`);
        await QianDAO(Plume_wallet);    
    }
}

main(PrivateKeys$18Wallets)