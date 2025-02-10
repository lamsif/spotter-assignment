import { useEffect, useState } from "react";
import { useTheme, useMediaQuery, Container, Box, Typography, Paper, Skeleton, Icon } from "@mui/material";
import { FormatMinutes, ToCapitalizedCase } from "../utils";
import { type SearchParams, type SearchResult } from "../interfaces";
import CallAPI from "../api";
import HeroImage from '../assets/hero.svg';
import SearchForm from "../components/searchform";
import SearchResults from "../components/searchresults";

// Fetch request's abort controller
var FETCH_CONTROLLER: AbortController|null = null;

export default function Home() {

    // Theme object
    const theme = useTheme();
    // SM breakpoint using media query hook
    const isSM = useMediaQuery(theme.breakpoints.down('sm'), { noSsr: true });

    // Query state
    const [ query, setQuery ] = useState<SearchParams|null>(null);
    // Loading state
    const [ loading, setLoading ] = useState<boolean>(true);
    // Error state
    const [ error, setError ] = useState<string|null>(null);
    // Results state
    const [ results, setResults ] = useState<Array<SearchResult>>([]);

    //Load results
    useEffect(() => {
        if (!query) return;
        if (FETCH_CONTROLLER) FETCH_CONTROLLER.abort();
        FETCH_CONTROLLER = new AbortController();
        setLoading(true);
        setError(null);
        CallAPI.get('/searchFlights', {
            signal: FETCH_CONTROLLER.signal,
            params: {
                sortBy: 'best',
                currency: 'USD',
                ...query
            }
        })
        .then((response) => {
            if (response.data && response.data.data && Array.isArray(response.data.data.itineraries)) {
                setResults(
                    response.data.data.itineraries.map((elm: any) => ({
                        price: elm.price?.formatted ?? elm.price?.raw.toString(),
                        tags: (elm.tags ?? []).map((tag: string) => ToCapitalizedCase(tag.replace('_', ' '))),
                        originName: elm.legs[0]?.origin.name,
                        destinationName: elm.legs[0]?.destination.name,
                        duration: FormatMinutes(elm.legs[0]?.durationInMinutes ?? 0),
                        stopCount: elm.legs[0]?.stopCount,
                        departure: elm.legs[0]?.departure.replace('T', ' '),
                        arrival: elm.legs[0]?.arrival.replace('T', ' '),
                        carrierName: ToCapitalizedCase(elm.legs[0]?.carriers.marketing[0]?.name ?? ''),
                        carrierLogo: elm.legs[0]?.carriers.marketing[0]?.logoUrl
                    }))
                );
            } else {
                setResults([]);
            }
        })
        .catch((error) => {
            if (error.code !== 'ERR_CANCELED') setError('Error: ' + error.message);
        })
        .finally(() => setLoading(false));
    }, [query]);

    // Render page
    return <Container disableGutters={isSM}>

        <Box position="relative" sx={{ [theme.breakpoints.up('sm')]: { marginBottom: '40px' } }}>

            <Box sx={{
                backgroundImage: `url(${HeroImage})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center',
                width: '100%', transition: 'aspect-ratio 500ms, min-height 500ms', aspectRatio: query ? '100/6' : '25/6',
                [theme.breakpoints.down('md')]: { minHeight: query ? '50px' : undefined },
                [theme.breakpoints.down('sm')]: { minHeight: query ? '40px' : '140px' }
            }} />

            <Typography variant="h3" component="h1" position="absolute" bottom={0} left={0} right={0} textAlign="center"
                onClick={query ? () => window.location.reload() : undefined} sx={{
                    cursor: query ? 'pointer' : undefined,
                    [theme.breakpoints.down('md')]: { fontSize: '2.4rem' },
                    [theme.breakpoints.down('sm')]: { fontSize: '1.9rem' }
                }}
            >
                Flights
            </Typography>

        </Box>

        <Box sx={{ margin: 'auto', paddingBottom: '36px', maxWidth: '940px !important',
            [theme.breakpoints.down('md')]: { maxWidth: '720px !important' }
        }}>

            <Paper elevation={isSM ? 2 : 4} sx={{ marginBottom: '48px' }}>
                <SearchForm onSearch={setQuery} />
            </Paper>

            {query ? <Box sx={{ [theme.breakpoints.down('sm')]: { padding: '0 12px' } }}>

                {loading ? <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                    <Skeleton variant="rounded" width="100%" height="80px" />
                    <Skeleton variant="rounded" width="100%" height="80px" />

                </Box> : error ? <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', textAlign: 'center' }}>

                    <Icon color="error" sx={{ fontSize: '48px' }}>error</Icon>
                    <Typography color="error" variant="body1" component="p">{error}</Typography>

                </Box> : results.length === 0 ? <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', textAlign: 'center' }}>

                    <Icon color="info" sx={{ fontSize: '48px' }}>search</Icon>
                    <Typography color="info" variant="body1" component="p">No flights found!</Typography>

                </Box> : <>

                    <SearchResults results={results} />

                </>}

            </Box> : null}

        </Box>

    </Container>;

}
