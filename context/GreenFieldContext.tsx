import { ReactNode, createContext } from "react";
import { Client } from '@bnb-chain/greenfield-js-sdk';

export const GreenFieldContext = createContext({});

type GreenFieldContextProviderProps = {
    children: ReactNode;
};

export const GreenFieldContextProvider: React.FC<GreenFieldContextProviderProps> = ({ children }) => {

    const num = 1;

    const client = Client.create('https://gnfd-testnet-fullnode-tendermint-ap.bnbchain.org', '5600');




    return (
        <GreenFieldContext.Provider value={{
            client
        }}>
            {children}
        </GreenFieldContext.Provider>
    )
}

