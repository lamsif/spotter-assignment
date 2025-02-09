import { useTheme, useMediaQuery, Container, Box, Typography, Paper } from "@mui/material";
import HeroImage from '../assets/hero.svg';

export default function Home() {

    // Theme object
    const theme = useTheme();
    // SM breakpoint using media query hook
    const isSM = useMediaQuery(theme.breakpoints.down('sm'));

    // Render page
    return <Container disableGutters={isSM}>

            <Box position="relative" sx={{ [theme.breakpoints.up('sm')]: { marginBottom: '40px' } }}>

                <Box sx={{
                    backgroundImage: `url(${HeroImage})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center',
                    width: '100%', aspectRatio: '25/6', [theme.breakpoints.down('sm')]: { minHeight: 140 }
                }} />

                <Typography variant="h3" component="h1" position="absolute" bottom={0} left={0} right={0} textAlign="center" sx={{
                    [theme.breakpoints.down('md')]: { fontSize: '2.4rem' },
                    [theme.breakpoints.down('sm')]: { fontSize: '1.9rem' }
                }}>
                    Flights
                </Typography>

            </Box>

            <Paper elevation={isSM ? 2 : 4} sx={{
                margin: 'auto', maxWidth: '940px !important', [theme.breakpoints.down('md')]: { maxWidth: '720px !important' },
            }}>
                Form
            </Paper>

    </Container>;

}
