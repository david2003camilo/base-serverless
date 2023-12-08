import axios from "axios";
import { configUri } from "./constants";

const ClientStrava = axios.create({
    baseURL: configUri.url,
    timeout: 8000,
    headers: {
        Accept: 'application/json',
    }
})

export default ClientStrava;