import {Routes,Route} from'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import { AuthProvider } from './context/AuthContext';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import BookDetail from './pages/BookDetail';

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

    </Routes>

    </AuthProvider>
    </>
  );
}

export default App;
