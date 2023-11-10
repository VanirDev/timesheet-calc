'use client';

import { TimeSpan } from '@/lib/timespan';
import { Stack, Typography, Tooltip } from '@mui/joy';
import { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';

export default function Timeline(props: {day: TimeSpan | null, breaks: TimeSpan[]}) {
    const [day, setDay] = useState(props.day || null);
    const [breaks, setBreaks] = useState(props.breaks);

    const getPadding = (time: Dayjs) => {
        if (time === null || day?.startTime === null) {
            return 0;
        }
        
        let diff = time.diff(day?.startTime, "seconds");
        let span = day!.getSecondsBetween();

        return (diff / span) * 100;
    }

    const getBarLength = (timeSpan: TimeSpan) => {
        if (timeSpan.startTime === null || timeSpan.endTime === null) {
            return 0;
        }

        let diff = timeSpan.getSecondsBetween();
        let span = day!.getSecondsBetween();

        return (diff / span) * 100;
    }

    useEffect(() => { 
        setDay(props.day || null);
        setBreaks([...props.breaks]);
    }, [props.day, props.breaks]);

    return (
        <div className="w-full flex flex-col gap-2 py-11 px-9">
            <div className="w-full flex flex-col justify-between relative h-5">
                <Tooltip title={day?.startTime?.format("h:mm a").toLocaleUpperCase()} arrow open placement="top" variant="outlined" style={{ zIndex: '1' }}>

                    <div className='h-5 w-5 rounded-full bg-blue-500 absolute -left-2.5 z-30 flex justify-center'/>
                </Tooltip>
                <div className='h-2.5 w-full rounded-full bg-blue-200 my-auto' />
                <Tooltip title={day?.endTime?.format("h:mm a").toLocaleUpperCase()} arrow open placement="top" variant="outlined" style={{ zIndex: '1' }}>
                    <div className='h-5 w-5 rounded-full bg-blue-500 absolute -right-2.5 z-30' />
                </Tooltip>
                {
                    breaks.map((value, index) => {
                        return (
                            <div key={index} className="absolute w-full h-5 overflow-hidden">
                                <div className='relative w-full h-5'>
                                    {value.startTime ? 
                                        <Tooltip title={value?.startTime?.format("h:mm a").toLocaleUpperCase()} arrow variant='outlined' className="absolute my-auto top-0.5 z-20" style={{left: getPadding(value.startTime) + "%"}}>
                                            <div className='-ml-2 bg-red-500 h-4 w-4 rounded-full' />
                                        </Tooltip> : ""
                                    }
                                    {value.endTime ? 
                                        <Tooltip title={value?.endTime?.format("h:mm a").toLocaleUpperCase()} arrow variant='outlined' className="absolute my-auto top-0.5 z-20" style={{left: getPadding(value.endTime) + "%"}} >
                                            <div className='-ml-2 bg-red-500 h-4 w-4 rounded-full' />
                                        </Tooltip> : ""
                                    }
                                    {value.startTime && value.endTime ? <div className="bg-red-200 h-2.5 rounded-full absolute w-10" style={{top:"0.3125rem", left: getPadding(value.startTime) + "%", width: getBarLength(value) + "%"}}/> : ""}
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
}