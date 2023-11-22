import React, { useState, useEffect} from 'react'
import BookCards from '../components/BookCards';

const OtherBooks = () => {
  const [books, setBooks] = useState([]);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
    useEffect( () => {
        fetch(`${apiUrl}/all-books`).then(res => res.json()).then(data => setBooks(data.slice(8,16)))
    }, [])
  return (
    <div>
        <BookCards books={books} headline="Other Books"/>
    </div>
  )
}

export default OtherBooks
