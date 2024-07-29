function Table({titles, children}) {
    return ( 
        <table>
            <thead> {/* Table head/titles */}
                <tr>
                    {titles.map(title=>{
                        return(
                            <th>{title}</th>
                        )
                    })}
                </tr>
            </thead>
            {children}
        </table>
     );
}

export default Table;