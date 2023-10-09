import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.tsx";
import Chat from "./features/chat/Chat.tsx";
import Auth from "./features/user/Auth.tsx";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Chat />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />
      </Routes>
    </Layout>
  );
}

export default App;
