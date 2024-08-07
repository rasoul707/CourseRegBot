import axios from "axios";
import {toast} from "@/lib/toast";


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


// ======================================================> error handlers

//
// export const handleFieldsError = (error: any, setError: any) => {
//     // if (error?.response?.status === 400) {
//     let _err = error?.errors
//     if (!_err) return
//     let _errKeys = Object.keys(_err)
//     for (let i = 0; i < _errKeys.length; i++) {
//         const c = Object.keys(_err[_errKeys[i]]);
//         for (let j = 0; j < c.length; j++) {
//             setError(_errKeys[i], {
//                 type: "manual",
//                 message: _err[_errKeys[i]][c[j]],
//             });
//         }
//     }
//     // }
// }


export const handleToastError = (error: any) => {
    console.log("Err", error);
    const response = error.response
    const messages = [];
    if (!response) {
        messages.push("خطای شبکه");
    } else {
        messages.push(response?.data?.message || response?.data?.error || `خطای ناشتاخته: ${response.status}`);
    }
    // show messages
    messages.map(message => toast(message, "error"));
};




