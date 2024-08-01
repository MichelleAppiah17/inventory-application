import { useState, useEffect, useContext } from "react";
import {
  collection,
  setDoc,
  getDocs,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebase.config";
import { AuthContext } from "../contexts/AuthProvider";
import { Link } from "react-router-dom";

function EventPlanner() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [deadline, setDeadline] = useState("");
  const [allBooks, setAllBooks] = useState([]);
  const { user, logout } = useContext(AuthContext); //use this once you made an authentication path way for buyers

  // Reference to the Firestore collection
  const scheduledPurchasesRef = collection(db, "scheduledPurchases");

  const apiUrl = "https://inventory-application-zrr6.onrender.com";

  useEffect(() => {
    fetch(`${apiUrl}/all-books`)
      .then((res) => res.json())
      .then((data) => {
        setAllBooks(data);
      })
      .catch((error) => {
        console.error("Error fetching books:", error);
      });

    // Fetch scheduled books from Firestore
    const fetchBooks = async () => {
      try {
        const querySnapshot = await getDocs(scheduledPurchasesRef);
        const q = query(
          querySnapshot,
          where(user.uid, "===", "userId")
        );
        const booksData = q.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setBooks(booksData);
      } catch (error) {
        console.error("Error fetching scheduled books:", error);
      }
    };

    fetchBooks();
  }, [books, scheduledPurchasesRef]);

  const handleAddBook = async () => {
    // alert("hello");
    if (title && author && deadline) {
      // Check if the book exists in allBooks (case-insensitive)
      // eslint-disable-next-line no-unused-vars
      const bookExists = allBooks.some(
        (book) =>
          book.bookTitle.toLowerCase().replace(/\s+/g, "") ===
          title.toLowerCase().replace(/\s+/g, "")
      );

      if (bookExists) {
        const newBook = { title, author, deadline, userId: user.uid };

        try {
          // Generate a unique ID for the document, e.g., using the title or a combination of fields
          const bookId = `${title
            .toLowerCase()
            .replace(/\s+/g, "-")}-${author
            .toLowerCase()
            .replace(/\s+/g, "-")}`;

          // Create a document reference with the specific ID
          const bookDocRef = doc(db, "scheduledPurchases", bookId);

          // Set the document with the new book data
          await setDoc(bookDocRef, newBook);

          // Update local state and clear input fields
          setBooks([...books, { ...newBook, id: bookId }]);
          setTitle("");
          setAuthor("");
          setDeadline("");

          alert("Book added successfully!");
        } catch (error) {
          alert("Error adding book to Firestore: " + error.message);
        }
      } else {
        alert("Book does not exist in the inventory.");
      }
    } else {
      alert("Please fill in all fields.");
    }
  };

  return (
    <div className='event-planner p-20 flex flex-col items-center'>
      <h1 className='text-3xl font-bold'>Book Purchase Planner</h1>
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
          min={new Date().toISOString().split("T")[0]}
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
        <button
          onClick={handleAddBook}
          className='p-2 bg-blue-600 text-white w-36 active:border-2'>
          Add Book
        </button>
      </div>
      <div className='book-list'>
        <h2>Scheduled Books</h2>
        {/* use an Activity loader from radix here */}
        {user !== null ? (
          <ul>
            {books.length > 0
              ? books.map((book, index) => (
                  <li
                    key={index}
                    className='border p-5 rounded-lg my-2'>
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
                ))
              : "You have no scheduled books"}
          </ul>
        ) : (
          <div>
            <p>You are currently logged out</p>
            <Link
              to={"/login"}
              className='underline underline-offset-2'>
              {" "}
              Continue as a buyer
            </Link>{" "}
            or{" "}
            <Link
              to={"/sign-up"}
              className='underline underline-offset-2'>
              {" "}
              Become a registered user
            </Link>
          </div>
        )}
        <button onClick={() => logout()}>Logout</button>
      </div>
    </div>
  );
}

export default EventPlanner;
