import axios from "axios";



const config = {
    baseURL: `${process.env.NEXT_PUBLIC_CORE_BASE_URL || "https://classregbot.mentorader.ir/api"}`,
    headers: {
        "Content-Type": "application/json",
    },
    // withCredentials: true,
    validateStatus: function (status: number) {
        return status >= 200 && status < 400;
    },
    paramsSerializer: {
        indexes: null // by default: false
    },
}


// **********************
// axios server
const axiosServer = axios.create(config)
axiosServer.interceptors.response.use(
    (response: any) => {
        return response;
    },
    (error: any) => {
        return Promise.reject(error.response.data)
    },
);
export {axiosServer}

