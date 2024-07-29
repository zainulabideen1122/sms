function HOC({children, isFor}) {
    const role = "Admin"
    
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