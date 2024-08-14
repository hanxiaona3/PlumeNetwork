const ethers=require('ethers')
const axios=require('axios')
const bulbaswapWETHABI = require('../../config/bulbaswapWETHABI.json');
const bulbaswapNativeRouterABI = require('../../config/bulbaswapNativeRouterABI.json');
const {PrivateKeys$18Wallets,PrivateKeys$4Wallets}=require('../../util/privateKey.cjs');
const SWAP_UTIL=require('../../util/swaptoken.cjs');
const {NewPrivatKeys,sleep,formHexData_two,transactionData,walletSendtxData}=require('../../util/common.cjs')
const fakeUa = require('fake-useragent');
const { HttpsProxyAgent } = require('https-proxy-agent');
const RPC=require('../../config/runnerRPC-1.json');

// const chalk = require("chalk");
// import chalk from 'chalk';

// const holesky_PRC='https://g.w.lavanet.xyz:443/gateway/hol1/rpc-http/a175064ed506e16c12597b7e8d24d73e';//'https://ethereum-holesky.publicnode.com';

// const provider=new ethers.JsonRpcProvider(PRC);

const Plume_Testnet_PRC='https://testnet-rpc.plumenetwork.xyz/http';
const Plume_Testnet_Provider=new ethers.JsonRpcProvider(Plume_Testnet_PRC);//设置链接PRC
//获取token数量
const RWACategory=[
    {name:"art",count:0,hex:'3268747470733a2f2f6d696c65732e706c756d656e6574776f726b2e78797a2f696d616765732f6172632f6172742e776562700000000000000000000000000000'},
    {name: "collectible-cards",count:1,hex:'4068747470733a2f2f6d696c65732e706c756d656e6574776f726b2e78797a2f696d616765732f6172632f636f6c6c65637469626c652d63617264732e77656270'},
    {name:"farming",count:2,hex:'3668747470733a2f2f6d696c65732e706c756d656e6574776f726b2e78797a2f696d616765732f6172632f6661726d696e672e7765627000000000000000000000'},
    {name:"investment-alcohol",count:3,hex:'4168747470733a2f2f6d696c65732e706c756d656e6574776f726b2e78797a2f696d616765732f6172632f696e766573746d656e742d616c636f686f6c2e7765627000000000000000000000000000000000000000000000000000000000000000'},
    {name:"investment-cigars",count:4,hex:'4068747470733a2f2f6d696c65732e706c756d656e6574776f726b2e78797a2f696d616765732f6172632f696e766573746d656e742d6369676172732e77656270'},
    {name:"investment-watch",count:5,hex:'3f68747470733a2f2f6d696c65732e706c756d656e6574776f726b2e78797a2f696d616765732f6172632f696e766573746d656e742d77617463682e7765627000'},
    {name:"rare-sneakers",count:6,hex:'3c68747470733a2f2f6d696c65732e706c756d656e6574776f726b2e78797a2f696d616765732f6172632f726172652d736e65616b6572732e7765627000000000'},
    {name:"real-estate",count:7,hex:'3a68747470733a2f2f6d696c65732e706c756d656e6574776f726b2e78797a2f696d616765732f6172632f7265616c2d6573746174652e77656270000000000000'},
    {name:"solar-energy",count:8,hex:'3b68747470733a2f2f6d696c65732e706c756d656e6574776f726b2e78797a2f696d616765732f6172632f736f6c61722d656e657267792e776562700000000000'},
    {name:"tokenized-gpus",count:9,hex:'3d68747470733a2f2f6d696c65732e706c756d656e6574776f726b2e78797a2f696d616765732f6172632f746f6b656e697a65642d677075732e77656270000000'},
];
async function QianDAO(wallet){
    // console.log(`每天领取测试代币。。。。。。。。。。。。。。。。。。。。。`);
    const address=wallet.address;
    const Interacted_contract_Token='0x485D972889Ee8fd0512403E32eE94dE5c7a5DC7b';

    let wallet_temp=ethers.Wallet.createRandom();
    let address_temp=wallet_temp.address;
    let array_phrase=wallet_temp.mnemonic.phrase.toLocaleUpperCase().split(' ');
    let wallet_name=array_phrase.find(word =>word.length>4)||''
    // for (let index = 0; index < array_phrase.length; index++) {
    //     if (array_phrase[index].length > 4) {wallet_name=array_phrase[index];}     
    // }
    // let wallet_name=array_phrase[0]+'AAA';
    let randdata=Math.floor(Math.random()*RWACategory.length);
    let datas=`0xe817e2ae${'0'.repeat(62)}a0${'0'.repeat(62)}e0${'0'.repeat(61)}120${'0'.repeat(63)}${randdata}${'0'.repeat(61)}160${'0'.repeat(63)}${randdata}${formHexData_two(convertToHexa(wallet_name))}${'0'.repeat(63)}44954454d${'0'.repeat(119)}${randdata}${formHexData_two(convertToHexa(wallet_name))}${'0'.repeat(62)}${RWACategory[randdata].hex}`
    const txData = {
        to: Interacted_contract_Token, 
        data: datas,
        value: 0,
        // nonce:await Plume_Testnet_Provider.getTransactionCount(address),
    };
    await walletSendtxData(wallet,txData);

}
const convertToHexa = (str = '') =>{
    return `${Buffer.from(str).toString('hex')}`
  }
const main=async()=>{

    for (let index = 14; index < 15; index++) {//PrivateKeys$18Wallets.length
        let Plume_wallet=new ethers.Wallet(PrivateKeys$18Wallets[index],Plume_Testnet_Provider);
        console.log(`第${index+1}个钱包，地址：${Plume_wallet.address}`);
        await QianDAO(Plume_wallet);    
    }
}

main()