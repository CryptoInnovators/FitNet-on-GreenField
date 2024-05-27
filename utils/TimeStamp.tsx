import React from 'react';

const TimestampToDate = ({ timestamp }) => {
    const date = new Date(timestamp * 1000);

    // Format the date
    const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div>
            {formattedDate}
        </div>
    );
};


export default TimestampToDate;