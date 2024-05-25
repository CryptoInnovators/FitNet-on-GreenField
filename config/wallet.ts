import { Chain } from "@rainbow-me/rainbowkit";


const greenFieldChain: Chain = {
    id: 5600,
    // network: 'greenfield',
    rpcUrls: {
        default: {
            http: ['https://gnfd-testnet-fullnode-tendermint-ap.bnbchain.org'],
        },
        public: {
            http: ['https://gnfd-testnet-fullnode-tendermint-ap.bnbchain.org'],
        },
    },
    name: 'GreenField',
    nativeCurrency: {
        name: 'BNB',
        symbol: 'BNB',
        decimals: 18,
    },
    iconUrl: 'https://github-production-user-asset-6210df.s3.amazonaws.com/5653652/244453602-44446c8c-5c72-4e89-b8eb-3042ef618eed.svg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20240525%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240525T093438Z&X-Amz-Expires=300&X-Amz-Signature=1162c6b03f4fd78d3c6abc6aca873bfbc93e75f69419218413bef0c2c399610d&X-Amz-SignedHeaders=host&actor_id=0&key_id=0&repo_id=430942608'
};


export { greenFieldChain };