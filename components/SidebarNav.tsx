import React, { useState } from 'react';
import { Button, buttonVariants } from './ui/button';
import { cn } from '@/lib/utils';
import { FaSwimmer } from "react-icons/fa";
import { IoIosBicycle } from "react-icons/io";
import { FaRunning } from "react-icons/fa";
import { FilteredTasks } from '@/types/Tasks';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    filteredTasks: any
    selectedKey: keyof FilteredTasks
    onTaskClick: (key: keyof FilteredTasks) => void;
}

const SidebarNav: React.FC<SidebarProps> = ({ onTaskClick, selectedKey, className, filteredTasks }) => {


    const handleClick = (key: keyof FilteredTasks) => {
        onTaskClick(key);
    }

    return (
        <div className={cn("pb-12", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                        Activities
                    </h2>

                    <div className="space-y-1">
                        {Object.keys(filteredTasks).map((key) => (
                            <Button
                                onClick={() => handleClick(key as keyof FilteredTasks)}
                                key={key}
                                variant={selectedKey == key ? "secondary" : "ghost"}
                                className="w-full justify-start capitalize">
                                <div className='px-2'>
                                    {key == "Ride" && <IoIosBicycle size={20} />}
                                    {key == "Swim" && <FaSwimmer size={20} />}
                                    {key == "Run" && <FaRunning size={20} />}
                                </div>
                                {key}
                            </Button>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SidebarNav;