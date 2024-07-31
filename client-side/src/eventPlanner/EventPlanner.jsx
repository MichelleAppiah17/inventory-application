import React, { useState ,useEffect} from "react";
// import {setDocs}

function EventPlanner() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [deadline, setDeadline] = useState("");
  const [allBooks, setAllBooks] = useState([]);

  const handleAddBook = () => {
    if (title && author && deadline) {
      setBooks([...books, { title, author, deadline }]);
      setTitle("");
      setAuthor("");
      setDeadline("");
    } else {
      alert("Please fill in all fields.");
    }
  };

    const apiUrl = "https://inventory-application-zrr6.onrender.com";
    useEffect(() => {
      fetch(`${apiUrl}/all-books`)
        .then((res) => res.json())
        .then((data) => {
          setAllBooks(data);
        });
    }, []);

    // BookRef = doc(....) upload this to firebase database(cloud firestore)
  //  const filteredBooks  = allBooks.filter((paraml))
  

  return (
    <div className='event-planner p-20'>
      <h1>Book Purchase Planner</h1>
      <div className='input-form'>
        <input
          type='text'
          placeholder='Book Title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type='text'
          placeholder='Author'
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <input
          type='date'
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
        <button onClick={handleAddBook}>Add Book</button>
      </div>
      <div className='book-list'>
        <h2>Scheduled Books</h2>
        <ul>
          {books.map((book, index) => (
            <li key={index}>
              <span>
                <strong>Title:</strong> {book.title},{" "}
                <strong>Author:</strong> {book.author}
              </span>
              <span>
                {" "}
                - <strong>Deadline:</strong>{" "}
                {new Date(book.deadline).toLocaleDateString()}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default EventPlanner;
