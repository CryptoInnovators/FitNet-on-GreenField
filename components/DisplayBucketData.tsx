import { BucketMetaWithVGF } from '@bnb-chain/greenfield-js-sdk/dist/esm/types/sp/Common';
import React from 'react';
import { GrStorage } from "react-icons/gr";
import { IoCreateSharp } from "react-icons/io5";
import { MdOutlinePayment } from "react-icons/md";


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
import AddressLabel from '@/utils/AddressLabel';
import TimestampToDate from '@/utils/TimeStamp';

const DisplayBucketData = ({
    bucket
}: BucketMetaWithVGF) => {

    console.log("Bucket Data>>", bucket);

    return (
        <section className=" py-4 sm:py-4">
            <Card
                className={"shadow-black/10 drop-shadow-xl dark:shadow-white/10 min-w-[400px]"}
            >
                <CardHeader>
                    <CardTitle className="item-center flex justify-between gap-4 capitalize mb-8">
                        {bucket.BucketInfo.BucketName}
                        <Badge variant="secondary" className="text-sm text-primary">
                            <AddressLabel address={bucket.BucketInfo.Owner} character={4} />
                        </Badge>
                    </CardTitle>

                    <div className='flex items-center justify-between'>
                        <span className="text-md font-bold">Last Updated Time</span>
                        <span className="text-muted-foreground">
                            <TimestampToDate timestamp={bucket.UpdateTime} />

                        </span>
                    </div>

                    <CardDescription className='text-md flex flex-col gap-6'>
                        <div className='flex flex-col'>
                            <div>Created Tx Hash</div>
                            <Badge variant="secondary" className="p-2 rounded-lg text-sm text-primary">
                                <AddressLabel address={bucket.CreateTxHash} showBlockExplorerLink isTransactionAddress />
                            </Badge>

                        </div>
                        <div className='flex flex-col'>
                            <div>Updated Tx Hash</div>
                            <Badge variant="secondary" className="p-2 text-sm text-primary">
                                <AddressLabel address={bucket.UpdateTxHash} showBlockExplorerLink isTransactionAddress />
                            </Badge>
                        </div>
                    </CardDescription>
                </CardHeader>

                <hr className="w-4/5 m-auto mb-4" />

                <CardContent>

                    <div className="flex flex-col w-full mx-auto gap-8 ">
                        <div className="flex flex-col gap-4">
                            <h3 className="text-xl font-semibold tracking-tight">
                                Bucket Details
                            </h3>
                            <div className='flex items-center justify-between'>
                                <div className='flex gap-1 items-center'>
                                    <div className='p-[10px] rounded-full bg-secondary'>
                                        <IoCreateSharp size={25} />
                                    </div>
                                    <span>Created At:</span>
                                </div>
                                <TimestampToDate timestamp={bucket.BucketInfo.CreateAt} />
                            </div>
                            <div className='flex items-center justify-between'>
                                <div className='flex gap-1 items-center'>
                                    <div className='p-[10px] rounded-full bg-secondary'>
                                        <GrStorage size={25} />
                                    </div>
                                    <span>Storage Size</span>
                                </div>
                                <div>{bucket.StorageSize}</div>
                            </div>
                            <div className='flex items-center justify-between'>
                                <div className='flex gap-1 items-center'>
                                    <div className='p-[10px] rounded-full bg-secondary'>
                                        <MdOutlinePayment size={25} />
                                    </div>
                                    <span>PaymentAddress</span>
                                </div>

                                <AddressLabel address={bucket.BucketInfo.PaymentAddress} showBlockExplorerLink character={4} />
                            </div>
                        </div>
                    </div>

                </CardContent>



                <CardFooter className="flex">
                    <div className="space-y-4"></div>
                </CardFooter>
            </Card>
        </section>
    );
};

export default DisplayBucketData;