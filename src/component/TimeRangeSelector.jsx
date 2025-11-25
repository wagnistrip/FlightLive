import React from 'react';

const TimeRangeSelector = ({ timeRange, selectedTimeRange, onClick, iconClass, label,traveltype }) => {
    return (
        <div className='col-lg-3 col-md-6 col-6'>
            <span
                className={` ${selectedTimeRange === timeRange ? 'weather-icon1' : 'weather-icon'}`}
                onClick={() => onClick(timeRange,traveltype)}
            >
                <i className={`fas ${iconClass} fa-2x`}></i>
                <p>{label}</p>
            </span>
        </div>
    );
};

export default TimeRangeSelector;
