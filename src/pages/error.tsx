import { Container, Typography } from "@mui/material";
import { useRouteError } from "react-router-dom";

export default function ErrorPage() {

    // Error object
    const error: any = useRouteError();

    // Check if not found error
    const is404: boolean = error.status === 404;

    // Render page
    return <Container sx={{ textAlign: 'center', paddingTop: '64px' }}>

        <Typography variant="h2" component="h1" marginBottom="32px">Oops!</Typography>

        {is404 ? <Typography variant="h4" component="p" color="error">404</Typography> : null}

        <Typography variant="body1" component="p" color="error">
            {error.statusText || error.message || 'Sorry, an unexpected error has occurred.'}
        </Typography>

    </Container>;

}
