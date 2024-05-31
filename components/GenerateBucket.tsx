"use client"
import React, { useState } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from './ui/input';
import { useAccount } from 'wagmi';
import { client, selectSp } from '@/client';
import { getOffchainAuthKeys } from '@/utils/offchainAuth';
import {
    Long,
    OnProgressEvent,
    VisibilityType,
} from "@bnb-chain/greenfield-js-sdk"

const GenerateBucket = () => {
    const { address, connector } = useAccount()
    const [open, setOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);

    const [info, setInfo] = useState<{
        bucketName: string
        objectName: string
        file: File | null
    }>({
        bucketName: "",
        objectName: "",
        file: null,
    })

    const handleCreateBucket = async () => {
        if (!address) return
        if (!info) return

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

        try {
            const createBucketTx = await client.bucket.createBucket({
                bucketName: info.bucketName,
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
                alert("success")
                setOpen(false);
                setIsLoading(false);
            }
        } catch (err) {
            setIsLoading(false);
            console.log("error", err, err.message)
            console.log(typeof err)
            if (err instanceof Error) {
                alert(err.message)
            }
            if (err && typeof err === "object") {
                alert(JSON.stringify(err))
            }
        }

        setIsLoading(false);
    }

    return (
        <div>
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogTrigger asChild>
                    <Button variant="outline">Create Bucket</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Generate Bucket</AlertDialogTitle>
                        <AlertDialogDescription>
                            <div className="flex flex-col w-full mx-auto gap-8 ">
                                <div className="flex flex-col gap-4">
                                    <label>Bucket Details</label>
                                    <Input
                                        placeholder="Enter bucket name"
                                        className="bg-muted/50 dark:bg-muted/80 "
                                        aria-label="text"
                                        value={info.bucketName}
                                        onChange={(e) => {
                                            setInfo({ ...info, bucketName: e.target.value });
                                        }}
                                    />
                                </div>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <Button
                            disabled={isLoading}
                            onClick={handleCreateBucket}
                            className=""
                        >
                            {isLoading ? 'Loading...' : 'Create Bucket'}
                        </Button>

                        {/* <AlertDialogAction onClick={handleCreateBucket}>Create Bucket</AlertDialogAction> */}
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default GenerateBucket;