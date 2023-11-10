'use client';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/en';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { TimePicker } from "@mui/x-date-pickers";
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, Input, Stack, Typography, Card } from "@mui/joy";
import Timeline from "./timeline";
import { TimeSpan } from "@/lib/timespan";
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { Divider } from '@mui/material';
import { Add } from '@mui/icons-material';

export default function TimeCalculator() {
    let [day, setDay] = useState<TimeSpan>( new TimeSpan(
        dayjs(new Date().setHours(9, 0, 0)),
        dayjs(new Date().setHours(17, 15, 0))
    ));
    let [breaks, setBreaks] = useState<TimeSpan[]>([
        new TimeSpan(
            dayjs(new Date().setHours(12, 0, 0)),
            dayjs(new Date().setHours(13, 0, 0))
        )
    ]);

    const updateBreak = (index: number, value: TimeSpan) => {
        let newBreaks = breaks;
        newBreaks[index] = value;
        setBreaks([...newBreaks]);
    }

    const deleteBreak = (index: number) => {
        console.log(index);
        setBreaks(breaks.toSpliced(index, 1));
    }

    const getBreakTotal = (breaks: TimeSpan[]) => {
        let total = 0;
        breaks.forEach(breakTime => {
            total += breakTime.getSecondsBetween();
        });
        return total;
    }

    const secondsToHoursAndMinutes = (seconds: number) => {
        let hours = Math.floor(seconds / 3600);
        let minutes = Math.floor((seconds % 3600) / 60);
        return {hours, minutes};
    }

    const getWorkTime = (day: TimeSpan, breaks: TimeSpan[]) => {
        let workTime = day.getSecondsBetween();
        workTime -= getBreakTotal(breaks);
        return secondsToHoursAndMinutes(workTime);
    }

    const now = new Date();

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
            <Stack
                direction="column"
                justifyContent="center"
                alignItems="stretch"
                spacing={3}
                className="w-full lg:max-w-3xl"
            >
                <Timeline day={day} breaks={breaks}/>
                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                    <Typography level="h4">
                        Day: {secondsToHoursAndMinutes(day.getSecondsBetween()).hours}h{secondsToHoursAndMinutes(day.getSecondsBetween()).minutes}m
                    </Typography>
                    <Typography level="h4">
                        Work: {getWorkTime(day, breaks).hours}h{getWorkTime(day, breaks).minutes}m
                    </Typography>
                    <Typography level="h4">
                        Breaks: {secondsToHoursAndMinutes(getBreakTotal(breaks)).hours}h{secondsToHoursAndMinutes(getBreakTotal(breaks)).minutes}m
                    </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <TimePicker 
                            label="Start"
                            ampm={false}
                            value={day?.startTime}
                            onChange={(newValue) => {
                                setDay(new TimeSpan(newValue, day?.endTime || dayjs(new Date().setHours(17, 15, 0))));
                            }}
                        />
                        <TimePicker 
                            label="End"
                            ampm={false}
                            value={day?.endTime}
                            onChange={(newValue) => {
                                setDay(new TimeSpan(day?.startTime || dayjs(new Date().setHours(9, 0, 0)),newValue));
                            }}
                        />
                    </Stack>
                    <Button 
                        onClick={() => {
                            setDay(new TimeSpan(
                                dayjs(new Date().setHours(9, 0, 0)),
                                dayjs(new Date().setHours(17, 15, 0))
                            ));
                            setBreaks([
                                new TimeSpan(
                                    dayjs(new Date().setHours(12, 0, 0)),
                                    dayjs(new Date().setHours(13, 0, 0))
                                )
                            ])
                        }}
                        size="lg"
                        startDecorator={<DeleteIcon />}
                        className=''
                        color='danger'
                        variant='outlined'
                    >
                        Reset
                    </Button>
                </Stack>
                <Divider />
                <Stack 
                    direction="column"
                    justifyContent="center"
                    alignItems="stretch"
                    spacing={2}
                    className=""
                >
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="stretch"
                        spacing={1}
                        className=""
                    >
                        <Stack
                            direction="row"
                            justifyContent="start"
                            alignItems="stretch"
                            spacing={1}
                            className=""
                        >
                            <Typography level="h3">Breaks</Typography>
                            <Typography level="h4" className="bg-blue-500 h-8 w-8 rounded-full text-center" textColor={"white"}>{breaks?.length || 0}</Typography>

                        </Stack>
                        <Button 
                            onClick={() => {
                                setBreaks(oldArray => [...oldArray, new TimeSpan(
                                    dayjs(new Date().setHours(12, 0, 0)),
                                    dayjs(new Date().setHours(13, 0, 0))
                                )])
                            }}
                            startDecorator={<Add />}
                            className=''
                        >
                        Add Break
                        </Button>
                    </Stack>
                    {
                        breaks.map(function (value, index, array) {
                            return (
                                <Card key={index}>
                                    <Stack
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        spacing={2}
                                    >
                                        <Stack direction="row" alignItems="center" spacing={2}>
                                            <TimePicker 
                                                label="Start"
                                                ampm={false}
                                                value={breaks[index]?.startTime}
                                                onChange={(newValue) => {
                                                    updateBreak(index, new TimeSpan(newValue, breaks[index]?.endTime || dayjs(new Date().setHours(17, 15, 0))));
                                                }}
                                            />
                                            <TimePicker 
                                                label="End"
                                                ampm={false}
                                                value={breaks[index].endTime}
                                                onChange={(newValue) => {
                                                    updateBreak(index, new TimeSpan(breaks[index]?.startTime || dayjs(new Date().setHours(9, 0, 0)),newValue));
                                                }}
                                            />
                                        </Stack>
                                        <Button 
                                            onClick={() => {
                                                deleteBreak(index);
                                            }}
                                            size="lg"
                                            startDecorator={<DeleteIcon />}
                                            className=''
                                            color='danger'
                                            variant='outlined'
                                        >
                                            Delete
                                        </Button>
                                    </Stack>
                                </Card>
                            );
                        })
                    }
                </Stack>
            </Stack>
        </LocalizationProvider>
    ); 
}