const Filter = (props) => {
    return (
        <div>
            Filter shown with: <input
                value={props.showFilter}
                onChange={props.handleFilterChange}
            />
        </div>
    )
}