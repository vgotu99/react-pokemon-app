import { Outlet, Route, Routes } from "react-router-dom";
import DetailPage from "./pages/DetailPage";
import Login from "./pages/LoginPage";
import NavBar from "./components/NavBar";
import MainPage from "./pages/MainPage";

const Layout = () => {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<MainPage />} />
        <Route path="login" element={<Login />} />
        <Route path="pokemon/:id" element={<DetailPage />} />
      </Route>
    </Routes>
  );
};

export default App;
