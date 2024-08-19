import { useState, useEffect, useContext } from "react";
import {
  collection,
  setDoc,
  doc,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase/firebase.config";
import { AuthContext } from "../contexts/AuthProvider";
import { Link, useNavigate } from "react-router-dom";

function EventPlanner() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [deadline, setDeadline] = useState("");
  const [allBooks, setAllBooks] = useState([]);
  const { user, logout } = useContext(AuthContext);

  const scheduledPurchasesRef = collection(db, "scheduledPurchases");

  const apiUrl = "https://inventory-application-zrr6.onrender.com";
  const navigate = useNavigate();

  useEffect(() => {
    if (user === null) {
      navigate("/login");
      return;
    }

    fetch(`${apiUrl}/all-books`)
      .then((res) => res.json())
      .then((data) => {
        setAllBooks(data);
      })
      .catch((error) => {
        console.error("Error fetching books:", error);
      });

    const fetchBooks = async () => {
      try {
        const q = query(
          scheduledPurchasesRef,
          where("userId", "==", user.uid)
        );
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const booksData = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          setBooks(booksData);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching scheduled books:", error);
      }
    };

    fetchBooks();
  }, [user, scheduledPurchasesRef]);

  const handleAddBook = async () => {
    if (title && author && deadline) {
      const bookExists = allBooks.some(
        (book) =>
          book.bookTitle.toLowerCase().replace(/\s+/g, "") ===
            title.toLowerCase().replace(/\s+/g, "") &&
          book.authorName.toLowerCase().replace(/\s+/g, "") ===
            author.toLowerCase().replace(/\s+/g, "")
      );

      if (bookExists) {
        const newBook = { title, author, deadline, userId: user.uid };

        try {
          const bookId = `${title
            .toLowerCase()
            .replace(/\s+/g, "-")}-${author
            .toLowerCase()
            .replace(/\s+/g, "-")}`;

          const bookDocRef = doc(db, "scheduledPurchases", bookId);

          await setDoc(bookDocRef, newBook, { merge: true });

          setBooks((prevBooks) => [
            ...prevBooks,
            { ...newBook, id: bookId },
          ]);
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
    <div className='event-planner p-20 max-w-screen-lg mx-auto '>
      <h1 className='text-4xl font-extrabold text-center text-gray-800 dark:text-gray-200 mb-8'>
        Book Purchase Planner
      </h1>

      <div className='input-form grid gap-4 sm:grid-cols-2 md:grid-cols-3'>
        <input
          type='text'
          placeholder='Book Title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className='p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
        <input
          type='text'
          placeholder='Author'
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className='p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
        <input
          type='date'
          min={new Date().toISOString().split("T")[0]}
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className='p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
        <button
          onClick={handleAddBook}
          className='col-span-full p-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all'>
          Add Book
        </button>
      </div>

      <div className='book-list mt-10'>
        {books.length > 0 ? (
          <h2 className='text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4'>
            Scheduled Books
          </h2>
        ) : (
          ""
        )}

        {user ? (
          <ul className='space-y-4'>
            {books.length > 0 ? (
              books.map((book, index) => {
              
                return (
                  <li
                    key={index}
                    className='p-4 border rounded-lg shadow-sm bg-gray-50 dark:bg-gray-700 dark:text-gray-300'>
                    <div className='flex justify-between'>
                      <div>
                        <strong>Title:</strong> {book.title} <br />
                        <strong>Author:</strong> {book.author}
                      </div>
                      {/*  */}
                      <div>
                        <strong>Deadline:</strong>{" "}
                        {new Date(book.deadline).toLocaleDateString()}
                      </div>
                    </div>
                  </li>
                );
              })
            ) : (
              <p className='text-gray-500 dark:text-gray-400'>
                You have no scheduled books
              </p>
            )}
          </ul>
        ) : (
          <div className='text-center mt-6'>
            <p className='text-gray-500 dark:text-gray-400 mb-4'>
              You are currently logged out
            </p>
            <Link
              to='/login'
              className='text-blue-600 underline hover:text-blue-800 transition-all'>
              Continue as a buyer
            </Link>{" "}
            or{" "}
            <Link
              to='/sign-up'
              className='text-blue-600 underline hover:text-blue-800 transition-all'>
              Become a registered user
            </Link>
          </div>
        )}
        {user && (
          <div className='text-center mt-6'>
            <button
              onClick={() => logout()}
              className='bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-all'>
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default EventPlanner;
