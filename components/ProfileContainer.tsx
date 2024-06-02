import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { GiWeight } from "react-icons/gi";
import { MdOutlineMyLocation } from "react-icons/md";
import { MdAccountCircle } from "react-icons/md";
import { IoTimeOutline } from "react-icons/io5";
import { Skeleton } from './ui/skeleton';

const options = {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'long',
    day: 'numeric',

};

const ProfileContainer = ({ isLoading, athleteData }) => {

    const resolveDate = new Date(athleteData?.updated_at);
    const resolveDateLocalString = resolveDate.toLocaleString('en-IN', options);

    const createdDate = new Date(athleteData?.created_at);
    const createdDateLocalString = createdDate.toLocaleString('en-IN', options);

    return (
        <div className='px-12 py-8 flex flex-col gap-12'>



            {/* Profile Head Container */}
            <div className='flex flex-row gap-4 items-center'>

                {isLoading && !athleteData ? (
                    <Skeleton className="h-24 w-24 rounded-full" />
                ) : (
                    <Button variant="destructive" className="relative h-24 w-24 rounded-full">
                        <Avatar className="h-24 w-24 bg-transparent">
                            <AvatarImage src={athleteData?.profile ? athleteData?.profile : "https://ui.shadcn.com/avatars/01.png"} alt="@shadcn" />
                        </Avatar>
                    </Button>
                )}

                <div className='flex flex-1 flex-row justify-between items-center'>
                    <div className='flex flex-col gap-2 min-w-[400px]'>

                        {isLoading && !athleteData ? (
                            <>
                                <Skeleton className="h-8 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-6 w-full" />
                            </>
                        ) : (
                            <>
                                <div className='flex flex-col'>
                                    <h2 className="text-3xl font-bold tracking-tight">{athleteData?.firstname}{" "}{athleteData?.lastname}</h2>
                                    <h2 className="text-xl font-[500] text-muted-foregroun">{athleteData?.bio}</h2>

                                </div>
                                <div className='flex gap-2'>
                                    <h3 className="text-lg text-muted-foreground">
                                        Created At:
                                    </h3>
                                    <h3 className="text-lg text-muted-foreground">
                                        {createdDateLocalString}
                                    </h3>

                                </div>
                            </>
                        )}
                    </div>

                    <div className='flex gap-2'>
                        {isLoading && !athleteData ? (
                            <Skeleton className="h-6 w-[150px]" />
                        ) : (
                            <>
                                <h3 className="text-lg text-muted-foreground">
                                    Id:
                                </h3>
                                <h3 className="text-lg text-muted-foreground">
                                    {athleteData?.id}
                                </h3>
                            </>
                        )}


                    </div>

                </div>
            </div>


            {/* Athelete Details */}
            {!isLoading && athleteData && (
                <div className='flex flex-col gap-4'>
                    <h2 className="text-3xl font-bold tracking-tight">User Details</h2>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Weight
                                </CardTitle>
                                <GiWeight />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{athleteData.weight}{" "}kg</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Gender
                                </CardTitle>
                                <MdAccountCircle />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{athleteData.sex === 'M' ? 'Male' : 'Female'}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Address</CardTitle>
                                <MdOutlineMyLocation />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{athleteData.country}</div>
                                <p className="text-xs text-muted-foreground">
                                    {athleteData.city}, {" "} {athleteData.state}
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Last Updated
                                </CardTitle>
                                <IoTimeOutline />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{resolveDateLocalString}</div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ProfileContainer;