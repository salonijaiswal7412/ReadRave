import {Routes,Route} from'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import { AuthProvider } from './context/AuthContext';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import BookDetail from './pages/BookDetail';
import Profile from './pages/Profile';
import EditProfile from './components/EditProfile';
import MyShelf from './pages/MyShelf';
import ChatBot from './components/ChatBot';
import Explore from './pages/Explore';
import GenrePage from './pages/GenrePage';

library.add(fas);


function App(){
  return (
    <>
    <AuthProvider>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/login' element={<Login/>}></Route>
      <Route path='/signup' element={<Signup/>}></Route>
      <Route path="/book/:id" element={<BookDetail />} />
      <Route path='/profile' element={<Profile/>}></Route>
      <Route path="/edit-profile" element={<EditProfile />} />
      <Route path="/my-shelf" element={<MyShelf />} />
      <Route path="/chatbot" element={<ChatBot/>}/>
       <Route path="/explore" element={<Explore />} />
       <Route path='/genre/:genreName' element={<GenrePage/>}/>

    </Routes>

    </AuthProvider>
    </>
  );
}

export default App;
