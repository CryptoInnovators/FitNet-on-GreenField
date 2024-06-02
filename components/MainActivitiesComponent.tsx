import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { FaSwimmer } from "react-icons/fa";
import { IoIosBicycle } from "react-icons/io";
import { FaRunning } from "react-icons/fa";
import { GiPathDistance } from "react-icons/gi";
import { IoIosSpeedometer } from "react-icons/io";
import { IoMdTimer } from "react-icons/io";
import { GiHealthIncrease } from "react-icons/gi";


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
    athleteActivityData
}) => {
    const activeActitivity = activities[activeKey];

    const athleteActivitydata = athleteActivityData;

    const filteredActivities = athleteActivitydata.filter(activity => activity.type == activeKey);

    function convertSecondsToHMS(seconds) {
        let hours = Math.floor(seconds / 3600);
        let minutes = Math.floor((seconds % 3600) / 60);
        let remainingSeconds = seconds % 60;

        return `${hours}:${minutes}:${remainingSeconds}`;
    }


    return (
        <div>

            <div className='flex flex-col gap-4'>

                <div className='flex flex-row gap-4'>
                    {activeKey == "Rde" && <IoIosBicycle size={30} />}
                    {activeKey == "Swim" && <FaSwimmer size={30} />}
                    {activeKey == "Run" && <FaRunning size={30} />}
                    <h2 className="text-3xl font-bold tracking-tight">
                        {activeKey}
                    </h2>
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
                            </div>
                        )
                    })}
                </div>
            </div>

        </div>
    );
};

export default MainActivitiesComponent;