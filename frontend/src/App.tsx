import {Route, Routes} from "react-router-dom";
import Layout from "./components/Layout.tsx";
import Chat from "./features/chat/Chat.tsx";

function App() {
  return (
    <Layout>
        <Routes>
            <Route path='/' element={<Chat/>} />
        </Routes>
    </Layout>
  )
}

export default App
