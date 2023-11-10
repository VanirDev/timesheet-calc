import TimeCalculator from '@/components/timeCalculator'
import { Stack, Typography, IconButton } from '@mui/joy'
import CalculateIcon from '@mui/icons-material/Calculate';
import CalculatorModal from '@/components/calculatorModal';

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col gap-14 w-full items-center ">
            <Stack 
                direction="row"
                justifyContent="space-between"
                alignItems="stretch"
                spacing={2}
                className="w-full lg:max-w-3xl lg:mt-24"
            >
                <Stack
                    direction="column"
                    justifyContent="center"
                    alignItems="flex-start"
                    spacing={0}
                    
                >
                    <Typography level="h1">Time Calculator</Typography>
                    <Typography level="h4">Because React is too much fun \o/</Typography>
                </Stack>
                <CalculatorModal />
            </Stack>
            <TimeCalculator />
        </main>
    )
}