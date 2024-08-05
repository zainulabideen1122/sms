
function isUnAuth(err, navigate){
    if(err.response != undefined)
    {
        if(err.response.data === 'Unauthorized!' && err.response.status == 403)
        {
            navigate('/unauthorized')
        }
    }

}

export default isUnAuth;