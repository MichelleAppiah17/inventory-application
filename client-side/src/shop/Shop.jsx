import { useState, useEffect } from "react";
import { Card } from "flowbite-react";
import { usePaystackPayment } from "react-paystack";

const Shop = () => {
  const [books, setBooks] = useState([]);
  const intializePayment = usePaystackPayment({
    publicKey: "pk_live_9db33b4cf4d600296775c60a71030c7a176c4ae0",
    currency: "GHS",
    email: "michelle@gmail.com",
    channels: ["mobile_money"],
    phone: "0593009511",
    amount: 100 * 100, //multiply by 100 the price of the book
  });

  const apiUrl = "https://inventory-application-zrr6.onrender.com";
  useEffect(() => {
    fetch(`${apiUrl}/all-books`)
      .then((res) => res.json())
      .then((data) => {
        setBooks(data);
      });
  }, []);
  return (
    <div className='mt-28 px-4 lg:px-24'>
      <h2 className='text-5xl font-bold text-center'>
        All Books are here
      </h2>

      <div className='grid gap-8 my-12 lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 grid-cols-1'>
        {books.map((book, index) => (
          <Card className='' key={index}>
            <img src={book.imageUrl} alt='' className='h-96' />
            <h5 className='text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
              <p>{book.bookTitle}</p>
            </h5>
            <p className='font-normal text-gray-700 dark:text-gray-400'>
              <p>{book.bookDescription}</p>
            </p>
            <button
              className='bg-blue-700 font-semibold text-white py-2 rounded'
              onClick={() =>
                intializePayment({
                  onSuccess: (e) => console.log(e),
                  onClose: (e) => console.log(e),
                })
              }>
              Buy Now
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Shop;
