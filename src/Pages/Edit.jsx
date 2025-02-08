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
  });

  // Fetch user dari API berdasarkan ID
  useEffect(() => {
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
  }, [id, navigate]);

  // Handle perubahan input form
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Handle submit form untuk update user
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`https://reqres.in/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        alert("User berhasil diperbarui!");
        navigate("/"); // Redirect ke halaman home
      } else {
        alert("Gagal memperbarui user.");
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div className="min-h-screen w-full font-sans text-gray-900 bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">Test</h1>
        <ul className="flex space-x-4">
          <li><a href="/" className="hover:text-blue-600">Home</a></li>
          <li><a href="/create" className="hover:text-blue-600">Create</a></li>
          {/* <li><a href="#page3" className="hover:text-blue-600">Page 3</a></li> */}
        </ul>
      </nav>

      {/* Hero Section */}
      <header className="text-center py-10 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <h2 className="text-4xl font-bold mb-4">Edit Page</h2>
        <p className="text-lg mb-4">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry.
        </p>
      </header>

      <section className="p-6">
        <h3 className="text-2xl font-semibold mb-4 text-center">Update User</h3>
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
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Update User
          </button>
        </form>
      </section>
    </div>
  );
}
