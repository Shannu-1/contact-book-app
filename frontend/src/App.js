import React from 'react';
import ContactForm from './components/ContactForm';
import ContactList from './components/ContactList';
import './index.css';

function App() {
  return (
    <div className="container">
      <h1>Contact Book</h1>
      <ContactForm />
      <ContactList />
    </div>
  );
}

export default App;