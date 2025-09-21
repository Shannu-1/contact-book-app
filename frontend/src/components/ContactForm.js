import React, { useState } from 'react';
import axios from 'axios';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const validate = () => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    const phoneRegex = /^\d{10}$/;
    if (!name.trim()) return "Name required";
    if (!emailRegex.test(email)) return "Invalid email";
    if (!phoneRegex.test(phone)) return "Phone must be 10 digits";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const v = validate();
    if (v) return setError(v);
    try {
      await axios.post('https://contact-book-app-yo99.onrender.com/contacts', { name, email, phone });
      setName(''); setEmail(''); setPhone('');
      window.dispatchEvent(new Event('contactsChanged'));
    } catch (err) {
      setError(err?.response?.data?.message || 'Error adding contact');
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input placeholder="Phone (10 digits)" value={phone} onChange={e=>setPhone(e.target.value)} />
      <button type="submit">Add</button>
      {error && <div style={{color:'red', width:'100%'}}>{error}</div>}
    </form>
  );
}
