import axios from "axios";

const apiClient = (token)=>{
    return axios.create({
        baseURL : 'http://localhost:5000',
        headers : {
            'token' : token
        }
    })
}

export default apiClient;