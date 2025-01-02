import axios from 'axios';
import qs from 'qs';

//https://vite.dev/config/shared-options.html#base
const baseURL = import.meta.env.DEV ? `http://0.0.0.0:8000/` : `${import.meta.env.BASE_URL}api`;

export default axios.create({
    baseURL: baseURL,
    paramsSerializer: params => {
        return qs.stringify(params, { arrayFormat: 'repeat' });
    }
});