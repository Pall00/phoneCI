import { useState, useEffect } from 'react'
import personService from './services/persons'


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

const AddPerson = (props) => {
  return (
    <form onSubmit={props.addPerson}>
      <div>
        name: <input
          value={props.newName}
          onChange={props.handlePersonChange}
        />
        <div>
          number: <input
            value={props.newNumber}
            onChange={props.handleNumberChange}
          /></div>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Notification = ({ message, messageType }) => {
  if (message === null) {
    return null
  }
  return (
    <div className={messageType}>
      {message}
    </div>
  )
}

const ShowPerson = (props) => {
  return (<div>
    {props.name} {props.number}
    <button onClick={() => props.removePerson(props.id)}> del </button>
  </div>)

}

const ShowNumbers = (props) => {
  return (
    <div >
      {props.filtered.map(person =>
        <ShowPerson key={person.name} name={person.name} number={person.number} id={person.id} removePerson={props.removePerson} />
      )}
    </div>
  )
}

const App = function () {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [showFilter, setFiltered] = useState('')
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState(null)

  const filtered = persons.filter(person =>
    person.name.toLocaleLowerCase().includes(showFilter.toLocaleLowerCase()))

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])


  const removePerson = (id) => {
    if (window.confirm("Haluatko varmasti poista tiedot")) {
      personService
        .remove(id)
        .then(setPersons(persons.filter(p => {
          setMessageType('succes')
          setMessage(
            `Person was removed from server!`
          )
          setTimeout(() => {
            setMessage(null)
            setMessageType(null)
          }, 5000)
          return p.id !== id
        }
        )
        ))
        .catch(error => {
          setMessageType('error')
          setMessage(
            `Person was removed from server already`
          )
          setTimeout(() => {
            setMessage(null)
            setMessageType(null)
          }, 5000)
        })
    }

  }

  const addPerson = (event) => {
    event.preventDefault()
    const onList = persons.filter(person => person.name === newName)
    console.log('Onlist', onList)
    if (onList.length === 0) {
      const personObject = {
        name: newName,
        number: newNumber
      }
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          setMessageType('error')
          setMessage(error.response.data.error)

          setTimeout(() => {
            setMessage(null)
            setMessageType(null)
          }, 5000)
        })
      setMessageType('succes')
      setMessage(
        `Added '${newName}' on server`
      )
      setTimeout(() => {
        setMessage(null)
        setMessageType(null)
      }, 3000)

    } else {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const id = onList[0].id
        const newpersonNumber = {
          name: newName,
          number: newNumber
        }
        personService
          .update(id, newpersonNumber)
        setMessageType('succes')
        setMessage(
          `Number changed for '${newName}' on server`
        )
        setTimeout(() => {
          setMessage(null)
          setMessageType(null)
        }, 3000)
        setNewName('')
        setNewNumber('')
      }
    }
  }

  const handlePersonChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setFiltered(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} messageType={messageType} />
      <Filter showFilter={showFilter} handleFilterChange={handleFilterChange} />
      <h2>Add a new</h2>
      <AddPerson addPerson={addPerson} newName={newName} handlePersonChange={handlePersonChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <ShowNumbers filtered={filtered} removePerson={removePerson} />
    </div>
  )
};

export default App