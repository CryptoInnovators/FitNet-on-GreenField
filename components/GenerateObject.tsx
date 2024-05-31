import React from 'react';
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
import { client } from '@/client';
import { ReedSolomon } from '@bnb-chain/reed-solomon';
import { RedundancyType, VisibilityType, Long, bytesFromBase64, OnProgressEvent } from '@bnb-chain/greenfield-js-sdk';

const GenerateObject = () => {
    const { address, connector } = useAccount()
    const [open, setOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);

    const [info, setInfo] = React.useState<{
        bucketName: string
        objectName: string
        file: File | null
    }>({
        bucketName: "",
        objectName: "",
        file: null,
    })

    const [createObjectInfo, setCreateObjectInfo] = React.useState({
        bucketName: '',
        objectName: '',
    });
    const [file, setFile] = React.useState<File>();
    const [txHash, setTxHash] = React.useState<string>();

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


    return (
        <div className='mt-4 flex justify-center'>
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogTrigger asChild>
                    <Button variant="outline">Create Object</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Create Object</AlertDialogTitle>
                        <div className="mx-auto flex w-full flex-col gap-8 ">
                            <div className="flex flex-col gap-4">
                                <label>Object Details</label>
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
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <Button
                            disabled={isLoading}
                            // onClick={handleCreateBucket}
                            className=""
                        >
                            {isLoading ? 'Loading...' : 'Create Bucket'}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default GenerateObject;