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

    </Routes>

    </AuthProvider>
    </>
  );
}

export default App;
