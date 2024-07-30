import { jwtDecode } from "jwt-decode";

function HOC({isFor, children}) {
    const role = localStorage.getItem('token') ? jwtDecode(localStorage.getItem('token')).role : ''

    if(isFor.includes(role))
    {
        return children
    }
    else
    {
        return null
    }
}

export default HOC;