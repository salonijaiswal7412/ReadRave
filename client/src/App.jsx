import {Routes,Route} from'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import { AuthProvider } from './context/AuthContext';


function App(){
  return (
    <>
    <AuthProvider>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/login' element={<Login/>}></Route>
      <Route path='/signup' element={<Signup/>}></Route>
    </Routes>
    </AuthProvider>
    </>
  );
}

export default App;