import React, { useState } from 'react';
import { Button, Label, Select, TextInput, Textarea } from 'flowbite-react';

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
    "Business"
  ]

  const [selectedBookCategory, setSelectedBookCategory] = useState(bookCategories[0]);

  const handleChangeSelectedValue = (event) => {
    setSelectedBookCategory(event.target.value)
  }

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
      bookTitle,authorName,imageUrl,category,bookDescription,bookPdfUrl
    }
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    //send data to DB
    fetch(`${apiUrl}/upload-book`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(bookObject)
    }).then(res => res.json().then(data => {
      alert("Book Uploaded successfully!!!")
      form.reset();
    }))

  }

  return (
    <div className='px-4 my-12'>
      <h2 className='mb-8 text-3xl font-bold'>Upload A Book</h2>

      <form onSubmit={handleBookSubmit} className="flex lg:w-[1180px] flex-col flex-wrap gap-4">
        {/* First row */}
        <div className='flex gap-4'>
          <div className='lg:w-1/2'>
            <div className="mb-2 block">
              <Label htmlFor="bookTitle" value="Book Title" />
            </div>
            <TextInput id="bookTitle" name="bookTitle" type="text" placeholder="Book Name" required className='w-[30em]'/>
          </div>
          {/* Author name */}
          <div className='lg:w-1/2'>
            <div className="mb-2 block">
              <Label htmlFor="authorName" value="Author Name" />
            </div>
            <TextInput id="authorName" name="authorName" type="text" placeholder="Author Name" required className='w-[30em]' />
          </div>
        </div>

        {/* Second row */}
        <div className='flex gap-4'>
          <div className='lg:w-1/2'>
            <div className="mb-2 block">
              <Label htmlFor="imageUrl" value="Book Image Url" />
            </div>
            <TextInput id="imageUrl" name="imageUrl" type="text" placeholder="Book Image URL" required className='w-[30em]' />
          </div>

          {/* Category */}
          <div className='lg:w-1/2'>
            <div className="mb-2 block">
              <Label htmlFor="inputState" value="Book Category" />
            </div>
            <Select
              id='inputState'
              name='category'
              className='w-[30em] rounded'
              value={selectedBookCategory}
              onChange={handleChangeSelectedValue}
            >
              {bookCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {/* third row */}
        <div>
        <div className="mb-2 block">
          <Label htmlFor="bookDescription" value="Book Description" />
        </div>
        <Textarea id="bookDescription"placeholder="Write Your Book Description..." className='w-[70em]' required rows={6} />
      </div>

      {/* book pdf link */}
      <div>
        <div className='lg:w-1/2'>
            <div className="mb-2 block">
              <Label htmlFor="bookPdfUrl" value="Book PDF URL" />
            </div>
            <TextInput id="bookPdfUrl" name="bookPdfUrl" type="text" placeholder="book PDF URL" required />
          </div>
      </div>
      <Button type="submit" className='mt-5 w-[60em]'>Upload Book</Button>
      </form>
    </div>
  )
}

export default UploadBook;
