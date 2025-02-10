import { useTheme, Box, Chip, Icon, Paper, Typography } from "@mui/material";
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot, TimelineOppositeContent } from '@mui/lab';
import { type SearchResult } from "../interfaces";

export default function SearchResults(props: {
    results: Array<SearchResult>
}) {

    // Props
    const { results } = props;

    // Theme object
    const theme = useTheme();

    // Render component
    return <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {results.map((elm, i) => <Paper key={i} variant="outlined" sx={{
            padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '16px', overflow: 'hidden',
            [theme.breakpoints.down('sm')]: { flexDirection: 'column', alignItems: 'initial', gap: '4px' }
        }}>

            {elm.carrierLogo ? <Box>
                <img alt={elm.carrierName} src={elm.carrierLogo} width={50} />
            </Box> : null}

            <Box flex={1} sx={{ minWidth: 'fit-content' }}>

                {elm.carrierName ? <Typography variant="body1" component="p" fontWeight={700}>
                    {elm.carrierName}
                </Typography> : null}

                <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>

                    {elm.price ? <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Icon color="success">payment</Icon>
                        <Typography variant="body2" component="p">{elm.price}</Typography>
                    </Box> : null}

                    {elm.duration ? <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Icon color="info">alarm</Icon>
                        <Typography variant="body2" component="p">{elm.duration}</Typography>
                    </Box> : null}

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                        <Icon color="action">place</Icon>
                        <Typography variant="body2" component="p">
                            {!elm.stopCount ? 'Nonstop' : elm.stopCount === 1 ? '1 stop' : `${elm.stopCount} stops`}
                        </Typography>
                    </Box>

                </Box>

                {elm.tags.length > 0 ? <Box sx={{ display: 'flex', gap: '6px', marginTop: '12px' }}>
                    {elm.tags.map((tag, j) => <Chip key={j} label={tag} />)}
                </Box> : null}

            </Box>

            <Timeline position="alternate-reverse">

                {elm.departure && elm.originName ? <TimelineItem>
                    <TimelineOppositeContent color="text.secondary">{elm.departure}</TimelineOppositeContent>
                    <TimelineSeparator>
                        <TimelineDot />
                        <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>{elm.originName}</TimelineContent>
                </TimelineItem> : null}

                {elm.arrival && elm.destinationName ? <TimelineItem>
                    <TimelineOppositeContent color="text.secondary">{elm.arrival}</TimelineOppositeContent>
                    <TimelineSeparator>
                        <TimelineDot />
                        <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>{elm.destinationName}</TimelineContent>
                </TimelineItem> : null}

            </Timeline>

        </Paper>)}

    </Box>;

}
