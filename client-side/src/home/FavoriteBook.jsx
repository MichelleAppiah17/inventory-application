import React, { useEffect, useState} from 'react'

const FavoriteBook = () => {
    const [books, setBooks] = useState([]);

    useEffect( () => {
        fetch("http://localhost:5000/all-books").then(res => res.json()).then(data => console.log(data))
    }, [])
  return (
    <div>FavoriteBook</div>
  )
}

export default FavoriteBook