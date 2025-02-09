import { useEffect, useState } from "react";
import "./App.css";
import { Link } from "react-router-dom";

export default function Home() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  // Fetch semua user dari semua halaman
  const fetchAllUsers = async () => {
    let allUsers = [];
    let page = 1;
    let totalPages = 1;

    do {
      try {
        const response = await fetch(`https://reqres.in/api/users?page=${page}`);
        const data = await response.json();
        allUsers = [...allUsers, ...data.data]; 
        totalPages = data.total_pages; 
        page++; 
      } catch (error) {
        console.error("Error fetching data:", error);
        break;
      }
    } while (page <= totalPages);

    return allUsers;
  };

  // Fetch semua user saat komponen dimuat
  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

    if (storedUsers.length > 0) {
      setUsers(storedUsers);
    } else {
      fetchAllUsers()
        .then((data) => {
          setUsers(data);
          localStorage.setItem("users", JSON.stringify(data));
        })
        .catch((error) => console.error("Error fetching data:", error));
    }
  }, []);

  // Fungsi untuk fetch detail user
  const fetchUserDetail = async (userId) => {
    try {
      const response = await fetch(`https://reqres.in/api/users/${userId}`);
      const data = await response.json();
      setSelectedUser(data.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching user detail:", error);
    }
  };

  // Fungsi untuk menghapus user
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Apakah Anda yakin ingin menghapus user ini?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`https://reqres.in/api/users/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("User berhasil dihapus!");
        const updatedUsers = users.filter((user) => user.id !== id);
        setUsers(updatedUsers);
        localStorage.setItem("users", JSON.stringify(updatedUsers));
      } else {
        alert("Gagal menghapus user.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Hitung data yang ditampilkan
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div className="min-h-screen w-full font-sans text-gray-900 bg-gray-50">
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
        <h2 className="text-4xl font-bold mb-4">User Data</h2>
        {/* <p className="text-lg mb-4">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry.
        </p> */}
      </header>

      {/* Data Table Section */}
      <section className="p-6">
        {/* <h3 className="text-3xl font- mb-4 text-center">User Data</h3> */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg border border-black">
            <thead className="bg-black text-white border-white">
              <tr>
                <th className="py-3 px-6 text-center border border-black">ID</th>
                <th className="py-3 px-1 text-center border border-black">Avatar</th>
                <th className="py-3 px-6 text-center border border-black">Name</th>
                <th className="py-3 px-6 text-center border border-black">Email</th>
                <th className="py-3 px-6 text-center border border-black">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <tr key={user.id} className="border border-black hover:bg-gray-100 transition">
                    <td className="py-3 px-6 border border-black">{user.id}</td>
                    <td className="py-3 px-6 border border-black text-center">
                      <img
                        src={user.avatar}
                        alt={user.first_name}
                        className="w-10 h-10 rounded-full mx-auto"
                      />
                    </td>
                    <td className="py-3 px-6 border border-black">{`${user.first_name} ${user.last_name}`}</td>
                    <td className="py-3 px-6 border border-black">{user.email}</td>
                    <td className="py-3 px-6 border border-black text-center space-x-2">
                      <Link to={`/edit/${user.id}`}>
                        <button className="bg-yellow-500 text-white text-xs px-4 py-1 rounded hover:bg-yellow-700">
                          Edit
                        </button>
                      </Link>
                      <button
                        onClick={() => fetchUserDetail(user.id)}
                        className="bg-blue-500 text-white text-xs px-4 py-1 rounded hover:bg-blue-700"
                      >
                        Detail
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500 italic border border-black">
                    Loading data...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 mx-1 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={indexOfLastUser >= users.length}
            className="px-4 py-2 mx-1 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Next
          </button>
        </div>
      </section>

      {/* Modal Detail User */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-2xl font-bold text-center mb-4">Detail Pengguna</h2>
            <div className="flex flex-col items-center">
              <img
                src={selectedUser.avatar}
                alt={selectedUser.first_name}
                className="w-24 h-24 rounded-full mb-3"
              />
              <h3 className="text-xl font-semibold">
                {selectedUser.first_name} {selectedUser.last_name}
              </h3>
              <p className="text-gray-700">{selectedUser.email}</p>
            </div>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center p-4">
        <p>&copy; 2025 Test. All Rights Reserved.</p>
      </footer>
    </div>
  );
}