import  { useState, useEffect } from "react";

const DashBoard = () => {
  const [allBooks, setAllBooks] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  const apiUrl = "https://inventory-application-zrr6.onrender.com";

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(`${apiUrl}/all-books`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setAllBooks(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='dashboard flex-1 p-10'>
      <h1 className='text-3xl font-bold mb-4'>Dashboard</h1>

      <div className='all-books-section mb-8'>
        <h2 className='text-2xl font-semibold mb-4'>All Books</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 group'>
          {allBooks.length > 0 ? (
            allBooks.map((book) => (
              <div
                key={book._id}
                className={`book-card text-white border rounded shadow-sm bg-no-repeat bg-top bg-cover h-52`}
                style={{
                  backgroundImage: `url(${book.imageUrl})`,
                }}>
                  <div className="opacity-0 hover:opacity-100 hover:bg-[#3333338f] w-full h-full p-2 flex-1 rounded-lg transition-all">
                <h3 className='text-xl font-semibold'>
                  {book.bookTitle}
                </h3>
                <p className='text-sm text-slate-50 '>
                  Author: {book.authorName}
                </p>
                <p className='text-sm text-slate-50 '>
                  Sold: {book.sold}
                </p>
                <p className='text-sm text-slate-50 '>
                  Rating: {book.rating}
                </p>
                <p className='text-sm text-slate-50 '>
                  Comments: {book.comments?.length}
                </p>
                </div>
              </div>
            ))
          ) : (
            <p>No books available</p>
          )}
        </div>
      </div>

      <div className='summary-section'>
        <h2 className='text-2xl font-semibold mb-4'>Summary</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='summary-card p-4 border rounded shadow-sm'>
            <h3 className='text-xl font-semibold'>
              Total Books Sold
            </h3>
            <p className='text-lg'>
              {allBooks.reduce((total, book) => total + book.sold, 0)}
            </p>
          </div>
          <div className='summary-card p-4 border rounded shadow-sm'>
            <h3 className='text-xl font-semibold'>Average Rating</h3>
            <p className='text-lg'>
              {(
                allBooks.reduce(
                  (total, book) => total + book.rating,
                  0
                ) / allBooks.length
              ).toFixed(1)}
            </p>
          </div>
          <div className='summary-card p-4 border rounded shadow-sm'>
            <h3 className='text-xl font-semibold'>Total Comments</h3>
            <p className='text-lg'>
              {allBooks.reduce(
                (total, book) => total + (book.comments?.length || 0),
                0
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
