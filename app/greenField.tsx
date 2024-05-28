import { client, selectSp } from '@/client';
import DisplayBucketData from '@/components/DisplayBucketData';
import { bucketData } from '@/constants/bucketData';
import { BucketMetaWithVGF } from '@bnb-chain/greenfield-js-sdk/dist/esm/types/sp/Common';
import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

const GreenFieldPage = () => {

    const { address, connector } = useAccount();

    const [buckets, setBuckets] = useState<BucketMetaWithVGF[] | undefined>();

    const fetchBuckets = async () => {
        console.log("Address", address, client);
        if (!address) return;

        setBuckets(bucketData);

        // try {
        //     const spInfo = await selectSp();

        //     const res = await client.bucket.listBuckets({
        //         address,
        //         endpoint: spInfo.endpoint,
        //     });
        //     console.log("bucketInfo", res);

        //     if (res.statusCode === 200) {
        //         setBuckets(res.body);
        //     }


        // } catch (error) {
        //     console.log("Error in fetching buckets>>>>", error);
        // }
    }

    useEffect(() => {
        if (client && address) {
            (async () => {
                await fetchBuckets();
            })();
        }

    }, [client, address])


    console.log("buckets", buckets)
    return (
        <div>
            <div className='flex flex-row flex-wrap items-center justify-center gap-8'>
                {buckets && buckets.map((bucket) => (
                    <div key={bucket.CreateTxHash}>
                        <DisplayBucketData bucket={bucket} />
                    </div>
                ))}

            </div>
        </div>
    );
};

export default GreenFieldPage;