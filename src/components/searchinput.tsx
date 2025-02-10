import { useState } from "react";
import { Autocomplete, Box, CircularProgress, Icon, TextField } from "@mui/material";
import { type PlaceOption } from "../interfaces";

export default function SearchInput(props: {
    label: string,
    loading: boolean,
    setLoading: (val: boolean) => void,
    options: Array<PlaceOption>,
    setOptions: (val: Array<PlaceOption>) => void,
    value: PlaceOption|null,
    setValue: (val: PlaceOption|null) => void,
    onInputChange: (term: string, setLoading: Function, setOptions: Function) => void
}) {

    // Props
    const { label, loading, setLoading, options, setOptions, value, setValue, onInputChange } = props;

    // State
    const [ open, setOpen ] = useState<boolean>(false);

    // Handle open
    const handleOpen = () => {
        setOpen(true);
    }

    // Handle close
    const handleClose = () => {
        setOpen(false);
        setOptions([]);
    }

    // Handle search input change
    const handleInputChange = (e: any) => {
        if (!open) return;
        onInputChange(e.target.value, setLoading, setOptions);
    }

    // Render component
    return <Autocomplete
        sx={{ flex: 1 }}
        noOptionsText="No places"
        open={open}
        onOpen={handleOpen}
        onClose={handleClose}
        loading={loading}
        options={options}
        value={value}
        onChange={(_, val) => setValue(val)}
        onInputChange={handleInputChange}
        isOptionEqualToValue={(option, value) => option.skyId === value.skyId && option.entityId === value.entityId}
        getOptionLabel={(option) => option.title}
        filterOptions={(x) => x}
        renderInput={(params) => (
            <TextField {...params} label={label} slotProps={{
                input: {
                    ...params.InputProps,
                    endAdornment: <>
                        {loading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                    </>
                }
            }} />
        )}
        renderOption={(props, option) => {
            const { key, ...optionProps } = props;
            return <Box key={key} {...optionProps} component="li">
                <Icon sx={{ marginRight: '8px' }}>
                    {option.placeType === 'AIRPORT' ? 'flight' : 'place'}
                </Icon>
                {option.title}
            </Box>;
        }}
    />;

}
