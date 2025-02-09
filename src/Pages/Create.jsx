import { useEffect, useState } from "react";
import "../App.css";

export default function Create() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    avatar: "",
  });

  // Load data dari localStorage saat komponen di-load
  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    setUsers(storedUsers);
  }, []);

  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Buat user baru dengan unique id, id nya didapat dari jumlah data +
    const userWithId = {
      id: users.length + 1,
      ...newUser,
      isLocal: true,
    };
    // Tambahkan user baru ke daftar users
    const updatedUsers = [...users, userWithId];
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    // Reset form
    setNewUser({
      first_name: "",
      last_name: "",
      email: "",
      avatar: "",
    });

    alert("User berhasil ditambahkan!");
  };

  return (
    <div className="min-h-screen w-full font-sans text-gray-900 bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-600">Application</h1>
        <ul className="flex space-x-4">
          <li>
            <a href="/" className="hover:text-gray-600">
              Home
            </a>
          </li>
          <li>
            <a href="/create" className="hover:text-gray-600">
              Create
            </a>
          </li>
        </ul>
      </nav>

      {/* Hero Section */}
      <header className="text-center py-20 bg-gradient-to-r from-gray-500 to-gray-900 text-white">
        <h2 className="text-4xl font-bold mb-4">Create User</h2>
      </header>

      {/* Form untuk POST User */}
      <section className="p-6">
        <form
          onSubmit={handleSubmit}
          className="max-w-lg mx-auto bg-white p-6 shadow-md rounded-lg border border-black"
        >
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">
              First Name
            </label>
            <input
              type="text"
              name="first_name"
              value={newUser.first_name}
              onChange={handleChange}
              className="w-full p-2 border border-black rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">
              Last Name
            </label>
            <input
              type="text"
              name="last_name"
              value={newUser.last_name}
              onChange={handleChange}
              className="w-full p-2 border border-black rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={newUser.email}
              onChange={handleChange}
              className="w-full p-2 border border-black rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">
              Avatar URL
            </label>
            <input
              type="text"
              name="avatar"
              value={newUser.avatar}
              onChange={handleChange}
              className="w-full p-2 border border-black rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Tambah User
          </button>
        </form>
      </section>
    </div>
  );
}