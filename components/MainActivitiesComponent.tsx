import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { FaSwimmer } from "react-icons/fa";
import { IoIosBicycle } from "react-icons/io";
import { FaRunning } from "react-icons/fa";
import { GiPathDistance } from "react-icons/gi";
import { IoIosSpeedometer } from "react-icons/io";
import { IoMdTimer } from "react-icons/io";
import { GiHealthIncrease } from "react-icons/gi";
import { Separator } from './ui/separator';
import { Button } from './ui/button';

import {
    Long,
    OnProgressEvent,
    RedundancyType,
    VisibilityType,
    bytesFromBase64,
} from "@bnb-chain/greenfield-js-sdk"
import { client, selectSp } from '@/client';
import { getOffchainAuthKeys } from '@/utils/offchainAuth';
import { useAccount } from 'wagmi';
import { useToast } from './ui/use-toast';
import { ToastAction } from './ui/toast';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ReedSolomon } from '@bnb-chain/reed-solomon';

const options = {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
};


const MainActivitiesComponent = ({
    activeKey,
    activities,
    athleteActivityData,
    athlete
}) => {
    const { toast } = useToast()
    const activeActitivity = activities[activeKey];

    const athleteActivitydata = athleteActivityData;

    console.log("athleteActivitydata", athleteActivitydata, athlete);

    const filteredActivities = athleteActivitydata.filter(activity => activity.type == activeKey);

    function convertSecondsToHMS(seconds) {
        let hours = Math.floor(seconds / 3600);
        let minutes = Math.floor((seconds % 3600) / 60);
        let remainingSeconds = seconds % 60;

        return `${hours}:${minutes}:${remainingSeconds}`;
    }

    const { address, connector } = useAccount();
    const [isLoading, setIsLoading] = React.useState(false);

    const handleCreateBucket = async (bucketName: string) => {
        console.log("Create bucket ran", bucketName, address);
        if (!address) {
            toast({
                title: "Address Not Found ",
                description: "Wallet is not connected please connect your wallet",
                variant: "destructive",
                action: (
                    <ToastAction altText="Connect Wallet">
                        <ConnectButton />
                    </ToastAction>
                ),
            })
            return
        }

        setIsLoading(true);
        const spInfo = await selectSp()
        console.log("spInfo", spInfo)

        const provider = await connector?.getProvider()
        const offChainData = await getOffchainAuthKeys(address, provider)

        console.log("offChainData", offChainData)
        if (!offChainData) {
            alert("No offchain, please create offchain pairs first")
            return
        }

        const bucket_name = bucketName.toLowerCase() + athlete.id;

        try {
            const createBucketTx = await client.bucket.createBucket({
                bucketName: bucket_name,
                creator: address,
                primarySpAddress: spInfo.primarySpAddress,
                visibility: VisibilityType.VISIBILITY_TYPE_PUBLIC_READ,
                chargedReadQuota: Long.fromString("0"),
                paymentAddress: address,
            })

            console.log("createBucketTx", createBucketTx)

            const simulateInfo = await createBucketTx.simulate({
                denom: "BNB",
            })

            console.log("simulateInfo", simulateInfo)

            const res = await createBucketTx.broadcast({
                denom: "BNB",
                gasLimit: Number(simulateInfo?.gasLimit),
                gasPrice: simulateInfo?.gasPrice || "5000000000",
                payer: address,
                granter: "",
            })

            console.log("Response >>>", res)

            if (res.code === 0) {
                toast({
                    title: "Bucket Created ",
                    description: "Your bucket has been created successfully, now you can add objects",
                })
                setIsLoading(false);
            }
        } catch (err) {
            setIsLoading(false);
            console.log("error in creating bucket", err, err.message)
            toast({
                title: "Bucket Creation Unsuccessful ",
                description: "Check console for more details",
                variant: "destructive"
            })
        }

        setIsLoading(false);
    }

    const [file, setFile] = useState<File>();

    const handleUploadFile = async (bucketName, bucketData) => {
        if (!address || !file) {
            alert('Please select a file or address');
            return;
        }

        const bucket_data = bucketData;
        const bucket_name = bucketName.toLowerCase() + athlete.id;
        const object_name = bucketData.name + "_" + bucketData.id;


        const rs = new ReedSolomon();
        const fileBytes = await file.arrayBuffer();
        const expectCheckSums = rs.encode(new Uint8Array(fileBytes));

        const createObjectTx = await client.object.createObject({
            bucketName: bucket_name,
            objectName: object_name,
            creator: address,
            visibility: VisibilityType.VISIBILITY_TYPE_PRIVATE,
            contentType: file.type,
            redundancyType: RedundancyType.REDUNDANCY_EC_TYPE,
            payloadSize: Long.fromInt(fileBytes.byteLength),
            expectChecksums: expectCheckSums.map((x) => bytesFromBase64(x)),
        });

        const simulateInfo = await createObjectTx.simulate({
            denom: 'BNB',
        });

        console.log('simulateInfo', simulateInfo);

        const res = await createObjectTx.broadcast({
            denom: 'BNB',
            gasLimit: Number(simulateInfo?.gasLimit),
            gasPrice: simulateInfo?.gasPrice || '5000000000',
            payer: address,
            granter: '',
        });

        console.log('res', res);

        let txHash;

        if (res.code === 0) {
            alert('create object tx success');
            txHash = res.transactionHash;

            const provider = await connector?.getProvider();
            const offChainData = await getOffchainAuthKeys(address, provider);
            if (!offChainData) {
                alert('No offchain, please create offchain pairs first');
                return;
            }

            const uploadRes = await client.object.uploadObject(
                {
                    bucketName: bucket_name,
                    objectName: object_name,
                    body: file,
                    txnHash: txHash,
                    duration: 20000,
                    onProgress: (e: OnProgressEvent) => {
                        console.log('progress: ', e.percent);
                    },
                },
                {
                    type: 'EDDSA',
                    domain: window.location.origin,
                    seed: offChainData.seedString,
                    address,
                },
            );
            console.log('uploadRes', uploadRes);

            if (uploadRes.code === 0) {
                alert('success');
            }
        }


    }

    const handleAddObject = async (bucketName, bucketData) => {
        if (!address) {
            alert('Please select a file or address');
            return;
        }

        console.log("Bucket data and Bucket Name", bucketData, typeof (bucketData), bucketName);

        const bucket_data = bucketData;
        const bucket_name = bucketName.toLowerCase() + athlete.id;
        const object_name = bucketData.name + "_" + bucketData.id;

        console.log("Bucket data and Bucket Name >>>>", bucket_data, bucket_name, object_name);


        const rs = new ReedSolomon();
        const jsonString = JSON.stringify(bucket_data);
        const byteLength = new Blob([jsonString]).size;

        // Encode string to Uint8Array
        const encoder = new TextEncoder();
        const uint8Array = encoder.encode(jsonString);
        const expectCheckSums = rs.encode(uint8Array);
        console.log("expectCheckSums", expectCheckSums);

        const createObjectTx = await client.object.createObject({
            bucketName: bucket_name,
            objectName: object_name,
            creator: address,
            visibility: VisibilityType.VISIBILITY_TYPE_PRIVATE,
            contentType: 'json',
            redundancyType: RedundancyType.UNRECOGNIZED,
            payloadSize: Long.fromInt(byteLength),
            expectChecksums: expectCheckSums.map((x) => bytesFromBase64(x)),
        });


        const simulateInfo = await createObjectTx.simulate({
            denom: 'BNB',
        });

        console.log('simulateInfo', simulateInfo);

        const res = await createObjectTx.broadcast({
            denom: 'BNB',
            gasLimit: Number(simulateInfo?.gasLimit),
            gasPrice: simulateInfo?.gasPrice || '5000000000',
            payer: address,
            granter: '',
        });

        console.log('res', res);

        let txHash;

        if (res.code === 0) {
            alert('create object tx success');
            txHash = res.transactionHash;
        }

        const provider = await connector?.getProvider();
        const offChainData = await getOffchainAuthKeys(address, provider);

        console.log("Off chain data >>", offChainData, window.location.origin, address);
        if (!offChainData) {
            alert('No offchain, please create offchain pairs first');
            return;
        }

        const uploadRes = await client.object.uploadObject(
            {
                bucketName: bucket_name,
                objectName: object_name,
                body: bucket_data,
                txnHash: txHash,
                duration: 50000,
                onProgress: (e: OnProgressEvent) => {
                    console.log('progress: ', e.percent);
                },
            },
            {
                type: 'EDDSA',
                domain: window.location.origin,
                seed: offChainData.seedString,
                address,
            },
        );
        console.log('uploadRes', uploadRes);

        if (uploadRes.code === 0) {
            alert('success');
        }

    }

    const delegateUpload = async (bucketName, bucketData) => {

        if (!address) {
            return;
        }

        console.log("Bucket data and Bucket Name", bucketData, typeof (bucketData), bucketName);

        const bucket_data = bucketData;
        const bucket_name = bucketName.toLowerCase() + athlete.id;
        const object_name = bucketData.name + "_" + bucketData.id;


        const provider = await connector?.getProvider();
        const offChainData = await getOffchainAuthKeys(address, provider);
        if (!offChainData) {
            alert('No offchain, please create offchain pairs first');
            return;
        }

        const uploadRes = await client.object.delegateUploadObject(
            {
                bucketName: bucket_name,
                objectName: object_name,
                body: bucket_data,
                delegatedOpts: {
                    visibility: VisibilityType.VISIBILITY_TYPE_PUBLIC_READ,
                },
                onProgress: (e: OnProgressEvent) => {
                    console.log('progress: ', e.percent);
                },
            },
            {
                type: 'EDDSA',
                seed: offChainData.seedString,
                domain: window.location.origin,
                address,
            },
        );
        console.log('uploadRes', uploadRes);

        if (uploadRes.code === 0) {
            alert('success');
        }
    }

    const downloadFile = async (bucketName, bucketData) => {
        const bucket_data = bucketData;
        const bucket_name = bucketName.toLowerCase() + athlete.id;
        const object_name = bucketData.name + "_" + bucketData.id;

        if (!address) return;
        const provider = await connector?.getProvider();
        const offChainData = await getOffchainAuthKeys(address, provider);
        if (!offChainData) {
            alert('No offchain, please create offchain pairs first');
            return;
        }

        const sp = await selectSp();
        const objInfo = await client.object.getObjectMeta({
            bucketName: bucket_name,
            objectName: object_name,
            endpoint: sp.endpoint,
        });
        console.log("objInfo", objInfo);

        const res = await client.object.listObjects({
            bucketName: bucket_name,
            endpoint: sp.endpoint,
        });
        console.log('res', res);

        const response = await client.object.getObjectPreviewUrl(
            {
                bucketName: bucket_name,
                objectName: object_name,
                queryMap: {
                    view: '1',
                    'X-Gnfd-User-Address': address,
                    'X-Gnfd-App-Domain': window.location.origin,
                    'X-Gnfd-Expiry-Timestamp': '2024-03-12T09:39:22Z',
                },
            },
            {
                type: 'EDDSA',
                address,
                domain: window.location.origin,
                seed: offChainData.seedString,
            },
        );

        console.log(response);


        const download = await client.object.downloadFile(
            {
                bucketName: bucket_name,
                objectName: object_name,
            },
            {
                type: 'EDDSA',
                address,
                domain: window.location.origin,
                seed: offChainData.seedString,
            },
        );
    }


    return (
        <div>

            <div className='flex flex-col gap-4'>

                <div className='flex flex-row gap-4'>
                    {activeKey == "Ride" && <IoIosBicycle size={30} />}
                    {activeKey == "Swim" && <FaSwimmer size={30} />}
                    {activeKey == "Run" && <FaRunning size={30} />}
                    <h2 className="text-3xl font-bold tracking-tight">
                        {activeKey}
                    </h2>
                </div>

                {/* <input
                    type="file"
                    placeholder="select a file"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        if (e.target.files) {
                            setFile(e.target.files[0]);
                        }
                    }}
                /> */}

                <div className='flex justify-end'>
                    <Button disabled={isLoading} onClick={() => {

                        if (!address) {
                            console.log("No address found")
                            toast({
                                title: "Address Not Found ",
                                description: "Wallet is not connected please connect your wallet",
                                variant: "destructive",

                                action: (
                                    <ToastAction altText="Connect Wallet">
                                        <ConnectButton />
                                    </ToastAction>
                                ),
                            })
                        } else {
                            handleCreateBucket(activeKey);
                        }
                    }}>{isLoading ? 'Loading ...' : ' Create Bucket'}</Button>
                </div>


                <div className='flex flex-col gap-8 mt-12'>
                    {filteredActivities.map((activity) => {
                        const resolveDate = new Date(activity?.start_date);
                        const resolveDateLocalString = resolveDate.toLocaleString('en-IN', options);

                        let elapsedTime = convertSecondsToHMS(activity.elapsed_time);
                        console.log("elapsedTime", elapsedTime);
                        return (
                            <div key={activity.id} className='flex flex-col gap-4'>
                                <h2 className="text-2xl font-semibold tracking-tight">{resolveDateLocalString}</h2>
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">
                                                Distance
                                            </CardTitle>
                                            <GiPathDistance />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">{activity.distance / 1000} km</div>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">
                                                Average Speed
                                            </CardTitle>
                                            <IoIosSpeedometer />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">{activity.average_speed} km/h</div>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">Time Elapsed</CardTitle>
                                            <IoMdTimer />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">{elapsedTime}</div>

                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">
                                                Elevation Gain
                                            </CardTitle>
                                            <GiHealthIncrease />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">{activity.total_elevation_gain}</div>
                                        </CardContent>
                                    </Card>
                                </div>

                                <div className='flex justify-end'>
                                    <Button
                                        onClick={() => {

                                            const bucketData = {
                                                distance: `${activity.distance / 1000}km`,
                                                avergae_speed: activity.average_speed,
                                                time_elapsed: elapsedTime,
                                                elevation_gain: activity.average_elevation_gain,
                                                id: activity.id,
                                                gear_id: activity.gear_id,
                                                moving_time: activity.moving_time,
                                                name: activity.name
                                            }

                                            if (!address) {

                                            } else {
                                                handleAddObject(activeKey, bucketData)
                                            }
                                        }}
                                        variant="outline">Add to Bucket</Button>
                                </div>

                                <Separator className="my-4" />
                            </div>
                        )
                    })}
                </div>
            </div>

        </div>
    );
};

export default MainActivitiesComponent;