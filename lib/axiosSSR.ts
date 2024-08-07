import axios from "axios";

const config = {
    baseURL: `${process.env.NEXT_PUBLIC_BASE_URL}`,
    headers: {
        "Content-Type": "application/json",
    },
    validateStatus: function (status: number) {
        return status >= 200 && status < 400;
    },
}

const axiosSSRNoAuth = axios.create(config)

export {axiosSSRNoAuth}