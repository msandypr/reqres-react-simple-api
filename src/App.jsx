import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Create from "./Pages/Create";
import Edit from "./Pages/Edit";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<Create />} />
        <Route path="/edit/:id" element={<Edit />} /> 
      </Routes>
    </Router>
  );
}
