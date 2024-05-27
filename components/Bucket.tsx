"use client"

import React, { useContext, useState } from "react"
import { client, selectSp } from "@/client"
import { GreenFieldContext } from "@/context/GreenFieldContext"
import { getOffchainAuthKeys } from "@/utils/offchainAuth"
import {
    Long,
    OnProgressEvent,
    VisibilityType,
} from "@bnb-chain/greenfield-js-sdk"
import { useAccount } from "wagmi"

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

const BucketPage = () => {
    const { address, connector } = useAccount()
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
            }
        } catch (err) {
            console.log("error", err, err.message)
            console.log(typeof err)
            if (err instanceof Error) {
                alert(err.message)
            }
            if (err && typeof err === "object") {
                alert(JSON.stringify(err))
            }
        }
    }


    const fetchBuckets = async () => {
        console.log("Address", address, client);
        if (!address) return;

        const spInfo = await selectSp();

        const res = await client.bucket.listBuckets({
            address,
            endpoint: spInfo.endpoint,
        });

        console.log("bucketInfo", res);
    }

    return (
        <>
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
                                        value={info.bucketName}
                                        onChange={(e) => {
                                            setInfo({ ...info, bucketName: e.target.value });
                                        }}
                                    />
                                </div>
                                <Button onClick={handleCreateBucket} className="w-full">Create Bucket</Button>
                                <Button onClick={fetchBuckets} className="w-full">Fetch Bucket</Button>
                            </div>


                        </CardContent>



                        <CardFooter className="flex">
                            <div className="space-y-4"></div>
                        </CardFooter>
                    </Card>
                </div>
            </section>
        </>
    )
}

export default BucketPage
