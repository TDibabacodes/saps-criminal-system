import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar         from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login          from "./pages/Login";
import Register       from "./pages/Register";
import Home           from "./pages/Home";
import AddSuspect     from "./pages/AddSuspect";
import AddRecord      from "./pages/AddRecord";
import EditSuspect    from "./pages/EditSuspect";
import EditRecord     from "./pages/EditRecord";
import Dashboard      from "./pages/Dashboard";
import ManagerCases   from "./pages/ManagerCases";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div style={{ padding: "24px", maxWidth: "1100px", margin: "0 auto" }}>
        <Routes>
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={
            <ProtectedRoute><Home /></ProtectedRoute>
          }/>
          <Route path="/add-suspect" element={
            <ProtectedRoute><AddSuspect /></ProtectedRoute>
          }/>
          <Route path="/add-record/:suspectId" element={
            <ProtectedRoute><AddRecord /></ProtectedRoute>
          }/>
          <Route path="/edit-suspect/:id" element={
            <ProtectedRoute><EditSuspect /></ProtectedRoute>
          }/>
          <Route path="/edit-record/:id" element={
            <ProtectedRoute><EditRecord /></ProtectedRoute>
          }/>
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          }/>
          <Route path="/manager/:id" element={
            <ProtectedRoute><ManagerCases /></ProtectedRoute>
          }/>
         <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}