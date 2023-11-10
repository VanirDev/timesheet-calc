"use client";

import * as React from 'react';
import Button from '@mui/joy/Button';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import { Card, Divider, Grid, IconButton, Stack} from '@mui/joy';

import CalculateIcon from '@mui/icons-material/Calculate';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import PauseIcon from '@mui/icons-material/Pause';

import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/en';

enum CalcMode {
    Add = "add",
    Subtract = "subtract"
}

enum CalcStage { 
    Initial = "initial",
    Normal = "normal"
}

export default function CalculatorModal() {
    const [open, setOpen] = useState<boolean>(false);
    const [stored, setStored] = useState<number | null>(null);
    const [operand, setOperand] = useState<number | null>(null);
    const [mode, setMode] = useState<CalcMode>(CalcMode.Add);
    const [stage, setStage] = useState<CalcStage>(CalcStage.Initial);
    const [input, setInput] = useState<number | null> (null);

    const toTime = (seconds: number) => {
        let hours = Math.floor(seconds / 3600);
        let minutes = Math.floor((seconds % 3600) / 60);
        return {hours, minutes};
    }

    const toTimeString = (seconds: number) => {
        let time = toTime(seconds);
        return `${time.hours.toFixed(0).padStart(2, "0")} : ${time.minutes.toFixed(0).padStart(2, "0")}`;
    }

    const newVal = (value: number) => {
        if (stage === CalcStage.Initial) {
            setStored(value);
        } else {
            setOperand(mode === CalcMode.Add ? value : -value);
        }
    }

    const add = () => {
        setStored(result());
        setOperand(null);
        setMode(CalcMode.Add);
        setStage(CalcStage.Normal);
        setInput(null);
    }

    const subtract = () => {
        setStored(result());
        setOperand(null);
        setMode(CalcMode.Subtract);
        setStage(CalcStage.Normal);
        setInput(null);
    }

    const clear = () => {
        setStored(null);
        setOperand(null);
        setMode(CalcMode.Add);
        setStage(CalcStage.Initial);
        setInput(null);
    }

    const result = () => {
        return (stored || 0) + (operand || 0);
    }

    const equals = () => {
        setStored(result());
        setOperand(null);
        setMode(CalcMode.Add);
        setStage(CalcStage.Initial);
        setInput(null);
    }

    return (
        <React.Fragment>
            <IconButton className="rounded-full w-20" variant="soft" onClick={() => setOpen(true)}>
                <CalculateIcon fontSize='large' className=""/>
            </IconButton>
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
                <Sheet
                    variant="outlined"
                    sx={{
                        maxWidth: 500,
                        borderRadius: 'md',
                        p: 3,
                        boxShadow: 'lg',
                    }}
                    className="lg:max-w-3xl"
                >
                    <ModalClose variant="plain" sx={{ m: 1 }} />
                    <Typography
                        component="h2"
                        id="modal-title"
                        level="h4"
                        textColor="inherit"
                        fontWeight="lg"
                        mb={1}
                    >
                        Quick Calculator
                    </Typography>
                    <Stack
                        direction="column"
                        justifyContent="center"
                        alignItems="stretch"
                        spacing={2}
                        className="mt-8"
                    >
                        <Card>
                            <Typography level='h4'>
                                <Stack direction="column" spacing={1}>
                                    <Stack direction="row" alignItems="center" className={stage === CalcStage.Initial ? "text-blue-500" : ""}>
                                        {stored !== null && stored < 0 ? <RemoveIcon className="w-6" /> : <div className='w-6'/>}
                                        {toTimeString(Math.abs(stored || 0))}
                                    </Stack>
                                    <Stack direction="row" alignItems="end" className={stage === CalcStage.Normal ? "text-blue-500" : ""}>
                                        {stage === CalcStage.Normal ? mode === CalcMode.Subtract ? <RemoveIcon className="w-6" /> : <AddIcon className="w-6" /> : <div className='w-6'/>}
                                        {toTimeString(Math.abs(operand || 0))}
                                    </Stack>
                                    <Divider />
                                    <Stack direction="row" alignItems="center">
                                        {result() !== null && result() < 0 ? <RemoveIcon className="w-6" /> : <div className='w-6'/>}
                                        {toTimeString(Math.abs(result() || 0))}
                                    </Stack>
                                </Stack>
                            </Typography>
                        </Card>
                        <Card>
                            <Stack
                                direction="row"
                                alignItems="center"
                                justifyContent="space-between"
                                spacing={2}
                            >

                                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
                                    <TimePicker 
                                        label="Time"
                                        ampm={false}
                                        value={input}
                                        onChange={(newValue) => {
                                            newVal(dayjs(newValue).diff(dayjs(new Date().setHours(0, 0, -1)), "seconds"));
                                        }}
                                    />
                                </LocalizationProvider>
                                <Stack direction="row"  spacing={0.5}>
                                    <Stack direction="column" spacing={0.5}>
                                        <IconButton variant="solid" color="primary" onClick={add} disabled={stage===CalcStage.Initial && stored === null || stage===CalcStage.Normal && operand === null}>
                                            <AddIcon />
                                        </IconButton>
                                        <IconButton variant="solid" color="primary" onClick={subtract} disabled={stage===CalcStage.Initial && stored === null || stage===CalcStage.Normal && operand === null}>
                                            <RemoveIcon />
                                        </IconButton>
                                    </Stack>
                                    <Stack direction="column"  spacing={0.5}>
                                        <IconButton variant="solid" color="primary" onClick={clear}>
                                            <DeleteIcon />
                                        </IconButton>
                                        <IconButton variant="solid" color="primary" onClick={equals}>
                                            <PauseIcon className='rotate-90'/>
                                        </IconButton>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Card>
                    </Stack>
                </Sheet>
            </Modal>
        </React.Fragment>
    );
}