import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.tsx";
import Chat from "./features/chat/Chat.tsx";
import Register from "./features/user/Register.tsx";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Chat />} />
        <Route path="/login" element={<Register />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Layout>
  );
}

export default App;
