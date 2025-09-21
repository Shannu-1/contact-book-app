import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Pagination({ page, totalPages, onChange }) {
  return (
    <div className="pagination">
      <button onClick={() => onChange(page-1)} disabled={page<=1}>Prev</button>
      <div>Page {page} / {totalPages}</div>
      <button onClick={() => onChange(page+1)} disabled={page>=totalPages}>Next</button>
    </div>
  );
}

export default function ContactList() {
  const [contacts, setContacts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [total, setTotal] = useState(0);
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const [loading, setLoading] = useState(false);

  const fetchContacts = async (p = page) => {
    try {
      setLoading(true);
      const res = await axios.get(`https://contact-book-app-yo99.onrender.com/contacts?page=${p}&limit=${limit}`);
      setContacts(res.data.contacts);
      setTotal(res.data.total);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts(page);
    const onChange = () => fetchContacts(1);
    window.addEventListener('contactsChanged', onChange);
    return () => window.removeEventListener('contactsChanged', onChange);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchContacts(page);
    // eslint-disable-next-line
  }, [page]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this contact?')) return;
    await axios.delete(`https://contact-book-app-yo99.onrender.com/contacts/${id}`);
    fetchContacts(page);
  };

  return (
    <div className="list">
      {loading ? <div>Loading...</div> : contacts.map(c => (
        <div className="contact" key={c.id}>
          <div className="meta">
            <div><strong>{c.name}</strong></div>
            <div>{c.email}</div>
            <div>{c.phone}</div>
          </div>
          <div className="actions">
            <button onClick={() => handleDelete(c.id)}>Delete</button>
          </div>
        </div>
      ))}
      <Pagination page={page} totalPages={totalPages} onChange={(p) => setPage(Math.max(1, Math.min(totalPages, p)))} />
    </div>
  );
}
