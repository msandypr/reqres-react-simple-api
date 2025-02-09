import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Edit() {
  const { id } = useParams(); // Ambil ID dari URL
  const navigate = useNavigate();
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    avatar: "",
    isLocal: false, // Tandai apakah user berasal dari localStorage
  });

  // Fetch user dari API atau localStorage berdasarkan ID
  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const userFromLocal = storedUsers.find((user) => user.id === parseInt(id));

    if (userFromLocal) {
      // Jika user ditemukan di localStorage
      setUser(userFromLocal);
    } else {
      // Jika user tidak ditemukan di localStorage, fetch dari API
      fetch(`https://reqres.in/api/users/${id}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.data) {
            setUser(data.data);
          } else {
            alert("User tidak ditemukan.");
            navigate("/");
          }
        })
        .catch((error) => console.error("Error fetching user:", error));
    }
  }, [id, navigate]);

  // Handle perubahan input form
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Handle submit form untuk update user
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

      // Jika user berasal dari API, simpan sebagai data lokal di localStorage
      if (!user.isLocal) {
        const newUser = { ...user, isLocal: true }; // Tandai sebagai data lokal
        const updatedUsers = [...storedUsers, newUser];
        localStorage.setItem("users", JSON.stringify(updatedUsers));
      } else {
        // Jika user berasal dari localStorage, update data di localStorage
        const updatedUsers = storedUsers.map((u) =>
          u.id === parseInt(id) ? { ...u, ...user } : u
        );
        localStorage.setItem("users", JSON.stringify(updatedUsers));
      }

      alert("User berhasil diperbarui!");
      navigate("/"); // Redirect ke halaman home
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col font-sans text-gray-900 bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-600">Application</h1>
        <ul className="flex space-x-4">
          <li><a href="/" className="hover:text-gray-600">Home</a></li>
          <li><a href="/create" className="hover:text-gray-600">Create</a></li>
        </ul>
      </nav>

      {/* Hero Section */}
      <header className="text-center py-20 bg-gradient-to-r from-gray-500 to-gray-900 text-white">
        <h2 className="text-4xl font-bold mb-4">Edit User</h2>
        {/* <p className="text-lg mb-4">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry.
        </p> */}
      </header>

      {/* Form untuk Update User */}
      <section className="p-6 flex-grow">
        {/* <h3 className="text-2xl font-semibold mb-4 text-center">Update User</h3> */}
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 shadow-md rounded-lg border border-black">
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">First Name</label>
            <input
              type="text"
              name="first_name"
              value={user.first_name}
              onChange={handleChange}
              className="w-full p-2 border border-black rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">Last Name</label>
            <input
              type="text"
              name="last_name"
              value={user.last_name}
              onChange={handleChange}
              className="w-full p-2 border border-black rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              className="w-full p-2 border border-black rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">Avatar URL</label>
            <input
              type="text"
              name="avatar"
              value={user.avatar}
              onChange={handleChange}
              className="w-full p-2 border border-black rounded"
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Update User
          </button>
        </form>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center p-4">
        <p>&copy; 2025 MSandyPR, All Rights Reserved.</p>
      </footer>
    </div>
  );
}