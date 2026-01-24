import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Shop from "./pages/Shop";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="pt-28 sm:pt-32">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
