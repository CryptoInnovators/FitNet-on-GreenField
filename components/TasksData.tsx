import React, { useEffect, useState } from 'react';
import SidebarNav from './SidebarNav';
import MainActivitiesComponent from './MainActivitiesComponent';
import { restructureData } from '@/helpers/FilterData';
import { FilteredTasks, Task } from '@/types/Tasks';
import { Button } from './ui/button';

const TasksData = ({
    taskData,
    athlete
}) => {

    const tasks = taskData;

    const filteredTasks: FilteredTasks = restructureData(tasks);

    const [isLoading, setIsLoading] = useState(false);

    const [selectedValue, setSelectedValue] = useState<Task | undefined>(filteredTasks['Run']);
    const [selectedKey, setSelectedKey] = useState<keyof FilteredTasks>('Run');
    const handleSidebarClick = (key: keyof FilteredTasks) => {
        setSelectedValue(filteredTasks[key]);
        setSelectedKey(key);
    }

    const [athleteActivityData, setAthleteActivityData] = useState();
    const getLoggedInAthleteData = async () => {

        const access_token = localStorage.getItem('starva:access_token');

        if (access_token) {
            try {
                setIsLoading(true);

                const url = `https://www.strava.com/api/v3/athlete/activities`

                const options = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${access_token}`
                    },
                };

                const res = await fetch(url, options);
                const response = await res.json();

                if (res.status == 200) {
                    setIsLoading(false);
                    setAthleteActivityData(response);
                }

            } catch (error) {
                console.log("Error", error)
                setIsLoading(false);
            }
        }

    }

    return (
        <div className='my-8'>

            <Button variant="default" onClick={getLoggedInAthleteData}>Load Athlete data</Button>

            {!isLoading && athleteActivityData && (
                <div className="border-t">
                    <div className="bg-background">
                        <div className="grid sm:grid-cols-5">
                            <SidebarNav
                                selectedKey={selectedKey}
                                onTaskClick={handleSidebarClick}
                                filteredTasks={filteredTasks}
                                className=" sm:block" />
                            <div className="col-span-3 sm:border-l lg:col-span-4">
                                <div className="h-full px-4 py-6 lg:px-8">
                                    <MainActivitiesComponent
                                        activeKey={selectedKey}
                                        activities={filteredTasks}
                                        athleteActivityData={athleteActivityData}
                                        athlete={athlete}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TasksData;