import React from 'react';
import Home from './components/Home';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css'

function App() {
  return (
    <div className="App">
       <Header />
        <Home />
       <Footer />
    </div>
  );
}

export default App;
