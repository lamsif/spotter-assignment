import { useState } from "react";
import { type SearchParams, type PlaceOption } from "../interfaces";
import { type Dayjs } from "dayjs";
import { useTheme, Box, Select, MenuItem, TextField, Icon, Menu, IconButton, Badge, Button } from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers';
import { toast } from "react-toastify";
import { DateToString } from "../utils";
import CallAPI from "../api";
import SearchInput from "./searchinput";

// Search request's abort controller
var SEARCH_CONTROLLER: AbortController|null = null;

export default function SearchForm(props: {
    onSearch: (query: SearchParams) => void
}) {

    // Props
    const { onSearch } = props;

    // Theme object
    const theme = useTheme();

    // Cabin class options
    const cabinOptions = [
        { value: 'economy', label: 'Economy' },
        { value: 'business', label: 'Business' },
        { value: 'first', label: 'First' }
    ];

    // Journey type options
    const journeyOptions = [
        { value: 'one_way', label: 'One Way' }
    ];

    // Paramters state
    const [ adultsAnchorEl, setAdultsAnchorEl ] = useState<HTMLElement|null>(null);
    const [ adults, setAdults ] = useState<number>(1);
    const [ cabinClass, setCabinClass ] = useState<string>(cabinOptions[0].value);
    const [ journeyType, setjourneyType ] = useState<string>(journeyOptions[0].value);

    // Date state
    const [ date, setDate ] = useState<Dayjs|null>(null);

    // Origin state
    const [ originLoading, setOriginLoading ] = useState<boolean>(false);
    const [ originOptions, setOriginOptions ] = useState<Array<PlaceOption>>([]);
    const [ originPlace, setOriginPlace ] = useState<PlaceOption|null>(null);

    // Destination state
    const [ destinationLoading, setDestinationLoading ] = useState<boolean>(false);
    const [ destinationOptions, setDestinationOptions ] = useState<Array<PlaceOption>>([]);
    const [ destinationPlace, setDestinationPlace ] = useState<PlaceOption|null>(null);

    // Handle adults count input
    const handleAdultsChange = (e: any) => {
        setAdults(e.target.value && parseInt(e.target.value) > 0 ? parseInt(e.target.value) : 1);
    }

    // Handle input search
    const handleInputSearch = (term: string, setLoading: Function, setOptions: Function) => {
        if (!term) {
            setLoading(false);
            setOptions([]);
            return;
        }
        if (SEARCH_CONTROLLER) SEARCH_CONTROLLER.abort();
        SEARCH_CONTROLLER = new AbortController();
        setLoading(true);
        CallAPI.get('/searchAirport', {
            signal: SEARCH_CONTROLLER.signal,
            params: { query: encodeURIComponent(term), locale: 'en-US' }
        })
        .then((response) => {
            if (response.data && Array.isArray(response.data.data)) {
                setOptions(
                    response.data.data.map((elm: any) => ({
                        skyId: elm.skyId,
                        entityId: elm.entityId,
                        placeType: elm.navigation.entityType,
                        title: elm.presentation.suggestionTitle || elm.presentation.title
                    }))
                );
            } else {
                setOptions([]);
            }
            setLoading(false);
        })
        .catch((error) => {
            if (error.code !== 'ERR_CANCELED') {
                toast.error('Error: ' + error.message);
                setLoading(false);
            }
        });
    }

    // Handle search button
    const handleSearchAction = () => {
        if (!adults || !cabinClass) return;
        if (!date) {
            toast.error('Departure date required!');
            return;
        }
        if (!originPlace) {
            toast.error('Departure place required!');
            return;
        }
        if (!destinationPlace) {
            toast.error('Destination place required!');
            return;
        }
        onSearch({
            adults: adults.toString(),
            cabinClass,
            date: DateToString(date.toDate()),
            originSkyId: originPlace.skyId,
            originEntityId: originPlace.entityId,
            destinationSkyId: destinationPlace.skyId,
            destinationEntityId: destinationPlace.entityId
        });
    }

    // Render component
    return <Box position="relative" display="flex" flexDirection="column" gap="12px" padding="12px 10px 42px 10px">

        <Box display="flex" gap="8px" overflow="hidden" paddingTop="4px">

            <Select size="small" value={journeyType} onChange={(e) => setjourneyType(e.target.value)} sx={{ width: 120 }}>
                {journeyOptions.map((elm) => <MenuItem key={elm.value} value={elm.value}>{elm.label}</MenuItem>)}
            </Select>

            <Select size="small" value={cabinClass} onChange={(e) => setCabinClass(e.target.value)} sx={{ width: 120 }}>
                {cabinOptions.map((elm) => <MenuItem key={elm.value} value={elm.value}>{elm.label}</MenuItem>)}
            </Select>

            <IconButton onClick={(e) => setAdultsAnchorEl(e.currentTarget)}>
                <Icon>people</Icon>
                <Badge badgeContent={adults} color="primary" overlap="circular" sx={{ top: '-12px', right: '-6px' }} />
            </IconButton>

            <Menu anchorEl={adultsAnchorEl} open={!!adultsAnchorEl} onClose={() => setAdultsAnchorEl(null)}>
                <TextField label="Adults" type="number" value={adults} onChange={handleAdultsChange} sx={{ margin: '8px 16px' }} />
            </Menu>

        </Box>

        <Box display="flex" gap="16px" sx={{ [theme.breakpoints.down('sm')]: { flexDirection: 'column', gap: '12px' } }}>

            <Box display="flex" gap="8px" flex={5}>
                <SearchInput label="Departure" loading={originLoading} setLoading={setOriginLoading} options={originOptions}
                    setOptions={setOriginOptions} value={originPlace} setValue={setOriginPlace} onInputChange={handleInputSearch} />
                <SearchInput label="Destination" loading={destinationLoading} setLoading={setDestinationLoading}
                    options={destinationOptions} setOptions={setDestinationOptions} value={destinationPlace}
                    setValue={setDestinationPlace} onInputChange={handleInputSearch} />
            </Box>

            <DatePicker label="Departure date" value={date} onChange={setDate} sx={{ flex: 2 }} />

        </Box>

        <Box position="absolute" bottom="-18px" left={0} right={0} display="flex" justifyContent="center">
            <Button onClick={handleSearchAction} variant="contained" startIcon={<Icon>search</Icon>} sx={{ borderRadius: 24 }}>
                Search
            </Button>
        </Box>

    </Box>;

}
