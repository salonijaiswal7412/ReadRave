import React from 'react'
import { useEffect,useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'

const BookDetail = () => {
    const {id}=useParams();
    const [book,setBook]=useState(null);
    const [reviews,setReviews]=useState([]);

    useEffect(()=>{
        axios.get(`https://www.googleapis.com/books/v1/volumes/${id}`)
        .then(res=>setBook(res.data))
        .catch(err=>console.error(err));

        axios.get(`http://localhost:5000/api/reviews/${id}`)
        .then(res=>setReviews(res.data))
        .catch(err=>console.error(err));

    },[id]);

    if(!book){
        return 
        <div>Loading....</div>
    }
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex gap-6">
        {book.volumeInfo.imageLinks?.thumbnail && (
          <img src={book.volumeInfo.imageLinks.thumbnail} alt={book.volumeInfo.title} className="w-32 h-auto" />
        )}
        <div>
          <h1 className="text-2xl font-bold">{book.volumeInfo.title}</h1>
          <p className="text-gray-600">{book.volumeInfo.authors?.join(', ')}</p>
          <p className="mt-4 text-sm text-gray-700">{book.volumeInfo.description?.slice(0, 500)}...</p>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Reviews</h2>
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          reviews.map((rev, index) => (
            <div key={index} className="border-b py-3">
              <p className="font-medium text-[#D91C7D]">{rev.userName}</p>
              <p className="text-yellow-600">⭐ {rev.rating}</p>
              <p className="text-gray-700">{rev.review}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default BookDetail
