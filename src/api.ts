import axios from "axios";
import { setupCache, buildWebStorage } from "axios-cache-interceptor";

const CallAPI = setupCache(
    axios.create({
        baseURL: import.meta.env.VITE_X_RAPIDAPI_API,
        headers: {
		    'x-rapidapi-host': import.meta.env.VITE_X_RAPIDAPI_HOST,
            'x-rapidapi-key': import.meta.env.VITE_X_RAPIDAPI_KEY
        }
    }),
    {
        storage: buildWebStorage(localStorage, 'axios-cache:')
    }
);

export default CallAPI;
