"use client"
import { client, selectSp } from '@/client';
import DisplayObject from '@/components/DisplayObject';
import GenerateObject from '@/components/GenerateObject';
import React, { useEffect } from 'react';

const ObjectPage = ({ params }: { params: { bucketName: string } }) => {

    const bucketName = params.bucketName;

    const [objects, setObjects] = React.useState();

    const fetchObjects = async (bucketName: string) => {
        const spInfo = await selectSp();

        try {
            const res = await client.object.listObjects({
                bucketName: bucketName,
                endpoint: spInfo.endpoint,
            });

            if (res.statusCode === 200) {
                setObjects(Object.values(res.body));
                console.log("res.body", res.body, Object.values(res.body));
            }
        } catch (error) {
            console.log("Error in fetching objects", error);
        }

    }

    useEffect(() => {
        if (bucketName) {
            fetchObjects(bucketName);
        }
    }, [bucketName])


    // console.log("objects>>>>>", objects);

    return (
        <div>

            <GenerateObject />

            <div className=''>
                {objects && objects.map((object, index) => {
                    return (
                        <div key={index}>
                            {object.Name}
                            <DisplayObject object={object.Objects} />
                        </div>
                    )
                })}
            </div>

        </div>
    );
};

export default ObjectPage;