import React, { useEffect, useState } from 'react'
function App() {

  const [query, setQuery] = useState('')
  const [container, setcontainer] = useState([])
  const [endPoint,setEndPoint] = useState('')
  const [updatedFood, setUpdatedFood] = useState('')
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'e0706107ffmsh08901071d94fd2ep161febjsn6cf9c19ac2eb',
      'X-RapidAPI-Host': 'edamam-food-and-grocery-database.p.rapidapi.com'
    }
  };
//FETCH DATA
  useEffect(() => {

  fetch(`https://edamam-food-and-grocery-database.p.rapidapi.com/parser?ingr=+${query}`, options)
    .then(response => {
      return response.json()

    })
    // .then(response => console.log(response))
    .then((data) => setcontainer(data.hints))
    .catch(err => console.error(err));

  },[endPoint])


  

  const onSubmitHandler = e =>{
    e.preventDefault()
    setEndPoint(query)
  }


    const onChangeHandler = (e) => {
      setQuery(e.target.value)

    }
//DELTE HANDLER
    const onDeleteHandler = id => {
      const updatedContainer = container.filter(item => item.food.foodId !== id)
      setcontainer(updatedContainer)
    }
//PATCH REQUEST
  const onPatchHandler = (id, newFood,e) => {
    e.preventDefault();
    const url = `https://edamam-food-and-grocery-database.p.rapidapi.com/products/${id}`
    const options = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': 'e0706107ffmsh08901071d94fd2ep161febjsn6cf9c19ac2eb',
        'X-RapidAPI-Host': 'edamam-food-and-grocery-database.p.rapidapi.com'
      },
      body: JSON.stringify({
        label: newFood
      })
    }
    fetch(url, options)
      .then(response => {
        if (response.ok) {
           // Update the container state with the new food label
          const updatedContainer = container.map(item => {
            if (item.food.foodId === id) {
              return { ...item, food: { ...item.food, label: newFood } }
            }
            return item
          })
          setcontainer(updatedContainer)
          setUpdatedFood('')
        } else {
          throw new Error('Failed to patch')
        }
      })
      .catch(err => console.error(err))
  }
  return (

    <div className='container'>
      <h1 className='heading'>Food App</h1>
      <form onSubmit={onSubmitHandler}>
        <input type="text" value={query} onChange={onChangeHandler} className='input'/>
        <button>Search</button>
      </form>
      <div className='card'>
        {container.map((item) => {
          return (
            <div key={item.food.foodId}>
              <img src={item.food.image} alt=''/>
              <p>{item.food.label}</p>
              <div className='btn'>
                <button onClick={() => onDeleteHandler(item.food.foodId)}>Delete</button>
                <button onClick={() => setUpdatedFood(item.food.label)}>Edit</button>
              </div>
              {updatedFood && item.food.label === updatedFood && (
                <div >
                  <form onSubmit={onSubmitHandler}>
                  <input
                    type='text'
                    value={updatedFood}
                    onChange={e => setUpdatedFood(e.target.value)}
                    
                  /> 
                  </form>
                  
            
                  <button onClick={(e) => onPatchHandler(item.food.foodId, updatedFood, e)}>Update</button>
                </div>
                 
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}


export default App