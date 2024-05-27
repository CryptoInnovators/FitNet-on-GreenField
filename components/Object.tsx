import React, { ChangeEvent, useState } from 'react';
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "./ui/input"
import { useAccount } from 'wagmi';
import { client, selectSp } from '@/client';
import { ReedSolomon } from '@bnb-chain/reed-solomon';
import { RedundancyType, VisibilityType, Long, bytesFromBase64, OnProgressEvent } from '@bnb-chain/greenfield-js-sdk';
import { getOffchainAuthKeys } from '@/utils/offchainAuth';


const ObjectPage = () => {

    const { address, connector } = useAccount();

    const [createObjectInfo, setCreateObjectInfo] = useState({
        bucketName: '',
        objectName: '',
    });
    const [file, setFile] = useState<File>();
    const [txHash, setTxHash] = useState<string>();


    const handleCreateTx = async () => {
        if (!address || !file) {
            alert('Please select a file or address');
            return;
        }

        const rs = new ReedSolomon();
        const fileBytes = await file.arrayBuffer();
        const expectCheckSums = rs.encode(new Uint8Array(fileBytes));

        const createObjectTx = await client.object.createObject({
            bucketName: createObjectInfo.bucketName,
            objectName: createObjectInfo.objectName,
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

        if (res.code === 0) {
            alert('create object tx success');

            setTxHash(res.transactionHash);
        }
    }


    const handleUpload = async () => {
        if (!address || !file) return;
        console.log(file);

        const provider = await connector?.getProvider();
        const offChainData = await getOffchainAuthKeys(address, provider);
        if (!offChainData) {
            alert('No offchain, please create offchain pairs first');
            return;
        }

        const uploadRes = await client.object.uploadObject(
            {
                bucketName: createObjectInfo.bucketName,
                objectName: createObjectInfo.objectName,
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

    const fetchObjects = async () => {

        const spInfo = await selectSp();

        const res = await client.object.listObjects({
            bucketName: 'abhishek-test-2',
            endpoint: spInfo.endpoint,
        });

        console.log("Bucket Objects", res);
    }

    const downloadFile = async () => {
        if (!address) return;

        const spInfo = await selectSp();
        console.log('spInfo', spInfo);

        const provider = await connector?.getProvider();
        const offChainData = await getOffchainAuthKeys(address, provider);
        if (!offChainData) {
            alert('No offchain, please create offchain pairs first');
            return;
        }

        const res = await client.object.downloadFile(
            {
                bucketName: 'abhishek-test-2',
                objectName: 'test-2-object-1',
            },
            {
                type: 'EDDSA',
                address,
                domain: window.location.origin,
                seed: offChainData.seedString,
            },
        );

        console.log(res);
    }

    const handlePreviewURL = async () => {
        if (!address) return;
        const provider = await connector?.getProvider();
        const offChainData = await getOffchainAuthKeys(address, provider);
        if (!offChainData) {
            alert('No offchain, please create offchain pairs first');
            return;
        }

        const res = await client.object.getObjectPreviewUrl(
            {
                bucketName: 'abhishek-test-2',
                objectName: 'test-2-object-1',
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

        console.log(res);
    }



    return (
        <>
            <div onClick={fetchObjects}>Fetch Object</div>
            <div onClick={downloadFile}>Download</div>
            <div onClick={handlePreviewURL}>Generate PReview URL</div>
            <section id="pricing" className="container py-24 sm:py-32">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <Card
                        className={"drop-shadow-xl shadow-black/10 dark:shadow-white/10"}
                    >
                        <CardHeader>
                            <CardTitle className="flex item-center justify-between">
                                Bucket Title
                                <Badge variant="secondary" className="text-sm text-primary">
                                    Bucket
                                </Badge>
                            </CardTitle>
                            <div>
                                <span className="text-3xl font-bold">$5</span>
                                <span className="text-muted-foreground"> /month</span>
                            </div>

                            <CardDescription>
                                Bucket created by Bnb Green Field
                            </CardDescription>
                        </CardHeader>

                        <hr className="w-4/5 m-auto mb-4" />

                        <CardContent>

                            <div className="flex flex-col w-full mx-auto gap-8 ">
                                <div className="flex flex-col gap-4">
                                    <label>Bucket Details</label>
                                    <Input
                                        placeholder="Enter bucket name"
                                        className="bg-muted/50 dark:bg-muted/80 "
                                        aria-label="text"
                                        value={createObjectInfo.bucketName}
                                        onChange={(e) => {
                                            setCreateObjectInfo({ ...createObjectInfo, bucketName: e.target.value });
                                        }}
                                    />
                                </div>
                                <div className="flex flex-col gap-4">
                                    <label>Object Details</label>
                                    <Input
                                        placeholder="Enter Object name"
                                        className="bg-muted/50 dark:bg-muted/80 "
                                        aria-label="text"
                                        value={createObjectInfo.objectName}
                                        onChange={(e) => {
                                            setCreateObjectInfo({ ...createObjectInfo, objectName: e.target.value });
                                        }}
                                    />
                                </div>
                                <div className="flex flex-col gap-4">
                                    <label>Upload File</label>
                                    <Input
                                        type="file"
                                        placeholder="select a file"
                                        className="bg-muted/50 dark:bg-muted/80 "
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                            if (e.target.files) {
                                                setFile(e.target.files[0]);
                                            }
                                        }}
                                    />
                                </div>
                                <Button onClick={handleCreateTx} className="w-full">
                                    create object tx
                                </Button>
                                <Button onClick={handleUpload} className="w-full">
                                    upload
                                </Button>
                            </div>


                        </CardContent>



                        <CardFooter className="flex">
                            <div className="space-y-4"></div>
                        </CardFooter>
                    </Card>
                </div>
            </section>
        </>
    );
};

export default ObjectPage;