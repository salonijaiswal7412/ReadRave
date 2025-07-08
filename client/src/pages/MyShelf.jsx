import React,{useContext,useState,useEffect} from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import BookCard from '../components/BookCard';
import CommonFooter from '../components/CommonFooter';
const VITE_API_BASE_URL =import.meta.env.VITE_API_BASE_URL;

function MyShelf() {

    const {token}=useContext(AuthContext);
    const [books,setBooks]=useState([]);
    const[grouped,setGrouped]=useState({
        wantToRead:[],
        currentlyReading:[],
        finishedReading:[]
    });

    useEffect(()=>{
        if(!token) return;

        const fetchShelf=async()=>{
            try{
                const res=await axios.get(`${VITE_API_BASE_URL}/api/reading-list`,{
                    headers:{Authorization: `Bearer ${token}`}
                });

                const groups={
                    wantToRead:[],
                    currentlyReading:[],
                    finishedReading:[]
                };

                for(const i of res.data){
                    groups[i.status].push(i);
                }
                setGrouped(groups);
                setBooks(res.data);
                
            }
            catch(err){
                console.error("failed to load shelf",err);
            }
        };
        fetchShelf();
    },[token]);

    const handleStatusChange= async(googleBookId,newStatus)=>{
        try{
            const res=await axios.patch(`${VITE_API_BASE_URL}/api/reading-list/${googleBookId}`,{
                status:newStatus
            },{
                headers:{Authorization:`Bearer ${token}`}
            });

            setBooks(prevBooks => prevBooks.map(book=>  // ✅ Use functional update
    book.googleBookId === googleBookId
    ?{...book,status:newStatus}:book
));

        }
        catch(err){
            console.error("Failed to update status: ",err.message);
        }

    };

    const handleRemove= async(googleBookId)=>{
        try{
            await axios.delete(`${VITE_API_BASE_URL}/api/reading-list/${googleBookId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setBooks(prev=>
                prev.filter(book=>book.googleBookId !=googleBookId)
            );

        }
        catch(err){
            console.error("Error removing: ",err);
        }
    };

    const renderShelf=(title,status)=>{
        const filtered=books.filter(book=>book.status===status);
        return (
            <div className="mb-6 w-[90%] shadow-[1px_1px_10px] shadow-gray-400 bg-white p-4 m-auto rounded-lg">
                <h2 className='text-3xl font-bold mb-4 text-[#d91c7d] '>{title}</h2>
                {filtered.length===0?(
                    <p className='text-gray-600'>No books added to this shelf yet!</p>
                ):(
                    <div className='flex gap-4'>
                        {filtered.map(item=>(
                             <BookCard
                                key={item.googleBookId}
                                entry={item}
                                onStatusChange={handleStatusChange}
                                onRemove={handleRemove}
                            />
                            
                        ))}
                    </div>

                )} 
            </div>
        );
    };

  return (
    <div>
        <Navbar/>
        <div className='py-12 bg-[#f2d8e5] min-h-screen w-full '>
        <h1 className='text-5xl text-center uppercase font-bold text-[#d91c7d] my-6 tracking-tight '>My Reading Shelf</h1>
        {renderShelf("Want to Read","wantToRead")}
        {renderShelf("Currently Reading","currentlyReading")}
        {renderShelf("Finished Reading","finishedReading")}
        </div>
        <CommonFooter/>
      
    </div>
  )
}

export default MyShelf
