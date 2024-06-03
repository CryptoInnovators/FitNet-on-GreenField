
export const restructureData = (data) => {
    const result = {};

    for (const key in data) {
        if (key.includes('all')) {
            const activityType = key.split('_')[1][0].toUpperCase() + key.split('_')[1].slice(1);
            if (!result[activityType]) {
                result[activityType] = {};
            }
            result[activityType] = data[key];
        }
    }

    return result;
}