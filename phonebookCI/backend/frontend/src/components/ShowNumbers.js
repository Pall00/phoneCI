const ShowNumbers = (props) => {
    return (
        <div>
            <ul>
                {props.filtered.map((person) =>
                    <li key={person.name}> {person.name} {person.number}</li>
                )}
            </ul>
        </div>
    )
}