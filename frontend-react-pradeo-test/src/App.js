import './App.css';
import UsersList from './Users/UsersList';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import User from './Users/User';
import AppStore from './AppStore/AppStore';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
        <Routes>
          <Route exact path='/' element={<UsersList />} />
          <Route exact path='/user/:id' element={<User />} />
          <Route exact path='/user/:id/secure-store' element={<AppStore />} />
        </Routes>
        </header>
      </div>
    </BrowserRouter>
  );
}

export default App;