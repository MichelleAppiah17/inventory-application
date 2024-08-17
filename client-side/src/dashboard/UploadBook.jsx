import React, { useState } from "react";
import {
  Button,
  Label,
  Select,
  TextInput,
  Textarea,
} from "flowbite-react";

const UploadBook = () => {
  const bookCategories = [
    "Fiction",
    "Non-Fiction",
    "Science-Fiction",
    "Fantasy",
    "Comedy",
    "Romance",
    "History",
    "Horror",
    "Business",
  ];

  const [selectedBookCategory, setSelectedBookCategory] = useState(
    bookCategories[0]
  );

  const handleChangeSelectedValue = (event) => {
    setSelectedBookCategory(event.target.value);
  };

  //handle book submission
  const handleBookSubmit = (event) => {
    event.preventDefault();
    const form = event.target;

    const bookTitle = form.bookTitle.value;
    const authorName = form.authorName.value;
    const imageUrl = form.imageUrl.value;
    const category = form.category.value;
    const bookDescription = form.bookDescription.value;
    const bookPdfUrl = form.bookPdfUrl.value;

    const bookObject = {
      bookTitle,
      authorName,
      imageUrl,
      category,
      bookDescription,
      bookPdfUrl,
    };
    const apiUrl = "https://inventory-application-zrr6.onrender.com";
    //send data to DB
    fetch(`${apiUrl}/upload-book`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookObject),
    }).then((res) =>
      res.json().then((data) => {
        alert("Book Uploaded successfully!!!");
        form.reset();
      })
    );
  };

  return (
    <div className='px-4 my-12 w-full'>
      <h2 className='mb-8 text-3xl font-bold text-center'>
        Upload A Book
      </h2>

      <form
        onSubmit={handleBookSubmit}
        className='flex flex-col gap-4 mx-auto w-full max-w-4xl'>
        {/* First row */}
        <div className='flex flex-col md:flex-row gap-4'>
          <div className='w-full'>
            <div className='mb-2 block'>
              <Label htmlFor='bookTitle' value='Book Title' />
            </div>
            <TextInput
              id='bookTitle'
              name='bookTitle'
              type='text'
              placeholder='Book Name'
              required
            />
          </div>
          {/* Author name */}
          <div className='w-full'>
            <div className='mb-2 block'>
              <Label htmlFor='authorName' value='Author Name' />
            </div>
            <TextInput
              id='authorName'
              name='authorName'
              type='text'
              placeholder='Author Name'
              required
            />
          </div>
        </div>

        {/* Second row */}
        <div className='flex flex-col md:flex-row gap-4'>
          <div className='w-full'>
            <div className='mb-2 block'>
              <Label htmlFor='imageUrl' value='Book Image Url' />
            </div>
            <TextInput
              id='imageUrl'
              name='imageUrl'
              type='text'
              placeholder='Book Image URL'
              required
            />
          </div>

          {/* Category */}
          <div className='w-full'>
            <div className='mb-2 block'>
              <Label htmlFor='inputState' value='Book Category' />
            </div>
            <Select
              id='inputState'
              name='category'
              value={selectedBookCategory}
              onChange={handleChangeSelectedValue}>
              {bookCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {/* Third row */}
        <div>
          <div className='mb-2 block'>
            <Label
              htmlFor='bookDescription'
              value='Book Description'
            />
          </div>
          <Textarea
            id='bookDescription'
            name='bookDescription'
            placeholder='Write Your Book Description...'
            required
            rows={6}
          />
        </div>

        {/* Book PDF link */}
        <div>
          <div className='mb-2 block'>
            <Label htmlFor='bookPdfUrl' value='Book PDF URL' />
          </div>
          <TextInput
            id='bookPdfUrl'
            name='bookPdfUrl'
            type='text'
            placeholder='Book PDF URL'
            required
          />
        </div>

        <Button
          type='submit'
          className='mt-5 w-full md:w-full self-center md:self-start'>
          Upload Book
        </Button>
      </form>
    </div>
  );
};

export default UploadBook;
