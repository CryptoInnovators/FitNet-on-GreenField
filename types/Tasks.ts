export interface Task {
    count: number;
    distance: number;
    moving_time: number;
    elapsed_time: number;
    elevation_gain: number;
    achievement_count?: number;
}

export interface FilteredTasks {
    Ride?: Task;
    Run?: Task;
    Swim?: Task;
}