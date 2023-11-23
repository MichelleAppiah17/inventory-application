import React, { useState, useEffect} from 'react'
import BookCards from '../components/BookCards';

const OtherBooks = () => {
  const apiUrl = 'https://inventory-application-zrr6.onrender.com';
  const [books, setBooks] = useState([]);

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
