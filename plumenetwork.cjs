const ethers=require('ethers')
const axios=require('axios')
const bulbaswapWETHABI = require('../config/bulbaswapWETHABI.json');
const bulbaswapNativeRouterABI = require('../config/bulbaswapNativeRouterABI.json');
const {PrivateKeys$18Wallets,PrivateKeys$4Wallets}=require('../util/privateKey.cjs');
const SWAP_UTIL=require('../util/swaptoken.cjs');
const {NewPrivatKeys,sleep,formHexData,formHexData_two,transactionData,walletSendtxData}=require('../util/common.cjs')
const fakeUa = require('fake-useragent');
const { HttpsProxyAgent } = require('https-proxy-agent');
// const chalk = require("chalk");
// import chalk from 'chalk';


// const holesky_PRC='https://g.w.lavanet.xyz:443/gateway/hol1/rpc-http/a175064ed506e16c12597b7e8d24d73e';//'https://ethereum-holesky.publicnode.com';


// const provider=new ethers.JsonRpcProvider(PRC);

//登录网址
const claim_URL='https://faucet.plumenetwork.xyz/api/faucet';
const Plume_Testnet_PRC='https://testnet-rpc.plumenetwork.xyz/http';
const Plume_Testnet_Provider=new ethers.JsonRpcProvider(Plume_Testnet_PRC);//设置链接PRC

//每日签到脚本
async function QianDAO(wallet,maxRetries=3,timeout=3000){
    // console.log(`每天签到。。。。。。。。。。。。。。。。。。。。。`);
    const address=wallet.address;
    const Interacted_contract_Token='0x8Dc5b3f1CcC75604710d9F464e3C5D2dfCAb60d8';
    let txData = {
        to: Interacted_contract_Token, 
        data: `0x183ff085`,
        value: 0,
        nonce:await Plume_Testnet_Provider.getTransactionCount(address),
    };
    await walletSendtxData(wallet,txData)

}
//每日涨幅签到
async function Cypto(wallet){
    // console.log(`每天Cypto签到。。。。。。。。。。。。。。。。。。。。。`);
    const address=wallet.address;
    const Interacted_contract_Token='0x032139f44650481f4d6000c078820B8E734bF253';
  
    let random_num=[0,1,2,6,8];
    let randdata=Math.floor(Math.random()*random_num.length);
    let mm=random_num[randdata];
    let datas=`0xe940f6a9${'0'.repeat(63)}${mm}${'0'.repeat(63)}${mm>5?0:1}`;
    let txData = {
        to: Interacted_contract_Token, 
        data:datas,
        value: 0,
        // nonce:await Plume_Testnet_Provider.getTransactionCount(address),
    };
    await walletSendtxData(wallet,txData);
}
//每日ARC签到

const convertToHexa = (str = '') =>{
    return `${Buffer.from(str).toString('hex')}`
}

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
async function ARC(wallet){
    // console.log(`每天ARC签到。。。。。。。。。。。。。。。。。。。。。`);
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


const goonUSD_address='0x5c1409a46cD113b3A667Db6dF0a8D7bE37ed3BB3';//合约地址
const GOON_address='0xbA22114ec75f0D55C34A5E5A3cf384484Ad9e733';//合约地址
const CrocSwapDex_address='0x4c722A53Cf9EB5373c655E1dD2dA95AcC10152D1';//合约地址

//GOON转化为goonUSD函数
async function GOON_goonUSD_SWAP(GOON_amount,wallet){
    
    console.log(`Swap进行approve。。。。。。。。。。。。。。。。。。`);
    let address=wallet.address;
    let base_address='0x5c1409a46cd113b3a667db6df0a8d7be37ed3bb3';
    let quote_address='0xba22114ec75f0d55c34a5e5a3cf384484ad9e733';
    //approve程序
    let randdata=ethers.parseEther(GOON_amount.toString());//
    let approve_transactionData = `0x095ea7b3${formHexData(CrocSwapDex_address.substring(2))}${formHexData(BigInt(randdata).toString(16))}`;
    let txData = {
        from:address,
        to: GOON_address,
        data: approve_transactionData,
        value: 0,
        // nonce:await Plume_Testnet_Provider.getTransactionCount(address),
    };
    await walletSendtxData(wallet,txData);

    //swap程序
    //随机数量
    //1 GOON =999.08 goonUSD
    randdata=GOON_amount*0.2;
    console.log(`GOON_amount的数量是${randdata}`);
    
    let minOut=randdata*999.08*0.93;
    let qty=ethers.parseEther(randdata.toString());
    let minOut_BIGINT=ethers.parseEther(minOut.toString());
    
    approve_transactionData = `0x3d719cd9${formHexData(base_address.substring(2))}${formHexData(quote_address.substring(2))}${'0'.repeat(60)}8ca0${'0'.repeat(64)}${'0'.repeat(64)}${formHexData(BigInt(qty).toString(16))}${'0'.repeat(64)}${'0'.repeat(59)}10001${formHexData(BigInt(minOut_BIGINT).toString(16))}${'0'.repeat(64)}`;
    txData = {
        from:address,
        to: CrocSwapDex_address,
        data: approve_transactionData,
        value: 0,
        // nonce:await Plume_Testnet_Provider.getTransactionCount(address),
    };
    await walletSendtxData(wallet,txData);
}
async function goonUSD_Stake(LP_amount,wallet){
    console.log(`Stable-LP进行approve。。。。。。。。。。。。。。。。。。`);
    let address=wallet.address;
    let TransparentUpgradeableProxy='0xA34420e04DE6B34F8680EE87740B379103DC69f6';
    let approve_transactionData = `0x095ea7b3${formHexData(TransparentUpgradeableProxy.substring(2))}${formHexData(BigInt(LP_amount).toString(16))}`;
    let txData = {
        from:address,
        to: goonUSD_address,
        data: approve_transactionData,
        value: 0,
        // nonce:await Plume_Testnet_Provider.getTransactionCount(address),
    };
    await walletSendtxData(wallet,txData);

    console.log(`Stable-LP进行stake。。。。。。。。。。。。。。。。。。`);
    txData = {
        to: TransparentUpgradeableProxy, 
        data: `0xa694fc3a${formHexData(BigInt(LP_amount).toString(16))}`,
        value: 0,
        // nonce:await Plume_Testnet_Provider.getTransactionCount(address),
    };
    await walletSendtxData(wallet,txData);
}

const main=async()=>{


    //随机钱包
    const shuffled_PrivateKeys=NewPrivatKeys(PrivateKeys$18Wallets);

    for (let index = 0; index < shuffled_PrivateKeys.length; index++) {//shuffled_PrivateKeys.length
        let Plume_wallet=new ethers.Wallet(shuffled_PrivateKeys[index],Plume_Testnet_Provider);
        console.log(`第${index+1}个钱包，地址：${Plume_wallet.address}`);
        let nn=`${new Date().getMonth()}年${new Date().getDate()}日启动`
        //每日签到暂时先不用这个签到，容易漏
        console.log(`${nn}签到`);
        // await QianDAO(Plume_wallet);
        //每日涨幅签到
        console.log(`${nn}涨幅签到`);
        await Cypto(Plume_wallet);   
        //每日奥运会签到
        console.log(`${nn}ARC签到`);
        await ARC(Plume_wallet) ;
        //swap和stakeing
        console.log(`${nn}swap和staking`);
        const GOON_amount=await SWAP_UTIL.getTokenBalance(GOON_address,bulbaswapWETHABI,Plume_wallet);
        await GOON_goonUSD_SWAP(GOON_amount,Plume_wallet);
        await sleep(3);  

        const goonUSD_Stable_LP_amount=await SWAP_UTIL.getTokenBalance(goonUSD_address,bulbaswapWETHABI,Plume_wallet);
        console.log(`goonUSD_Stable_LP_amount的数量是${goonUSD_Stable_LP_amount}`);
        const LP_goonUSD_amount=ethers.parseEther((Math.floor(goonUSD_Stable_LP_amount)).toString());
        await goonUSD_Stake(LP_goonUSD_amount,Plume_wallet);

        await sleep(3);


    }

}

main()
