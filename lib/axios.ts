import axios from "axios";



const config = {
    baseURL: `${process.env.NEXT_PUBLIC_CORE_BASE_URL}`,
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
// A: axios with auth
const axiosAuth = axios.create(config)
axiosAuth.interceptors.response.use(
    (response: any) => {
        return response;
    },
    (error: any) => {
        if (error.response.status === 401) {
            // signOut()
            return Promise.reject(error)
        }
        handleToastError(error);
        return Promise.reject(error.response.data)
    },
);
export {axiosAuth}


// **********************
// B: axios without auth
const axiosNoAuth = axios.create(config)
axiosNoAuth.interceptors.response.use(
    (response: any) => {
        return response;
    },
    (error: any) => {
        handleToastError(error);
        return Promise.reject(error.response.data)
    },
);
export {axiosNoAuth}




// **********************
// C: axios without auth server side
const axiosServer = axios.create(config)
axiosNoAuth.interceptors.response.use(
    (response: any) => {
        return response;
    },
    (error: any) => {
        return Promise.reject(error.response.data)
    },
);
export {axiosServer}






export const handleToastError = (error: any) => {
    console.log("Err", error);
    const response = error.response
    const messages: any[] = [];
    if (!response) {
        messages.push("خطای شبکه");
    } else {
        messages.push(response?.data?.message || response?.data?.error || `خطای ناشتاخته: ${response.status}`);
    }
    // show messages
    import("@/lib/toast").then(widget => {
        messages.map(message => widget.toast(message, "error"));
    });
};




