import axios from './axios.customize';
const createUserApi = (email: string, password: string) => {
    const URL_API = "/api/auth/register";
    const data = {
        email, password
    }
    return axios.post(URL_API, data)
}
const otpVerify = (email: string, otp: string) => {
    const URL_API = "/api/auth/verify-otp";
    const data = {
        email, otp
    }
    return axios.post(URL_API, data)
}
const loginApi = (email: string, password: string) => {
    const URL_API = "/api/auth/login";
    const data = {
    email, password
    }
    return axios.post(URL_API, data)
}
export {
    createUserApi, loginApi, otpVerify
}