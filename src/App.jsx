import React, {useEffect, useState} from "react";
import {BrowserRouter as Router, NavLink, Route, Routes} from "react-router-dom";
import "./index.css";
import AboutUs from "./pages/AboutUs/AboutUs.jsx";
import Profile from "./pages/Profile/Profile.jsx";
import SignIn from "./pages/SignIn/SignIn.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

export default function App()
{
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() =>
  {
    if (localStorage.getItem("token") !== null)
    {
      setShowProfile(true);
    }
  }, [])

  async function fnLogout()
  {
    const response = await fetch("http://localhost:5000/logout?token=" + localStorage.getItem("token"), {
      method: "DELETE",
      headers: {"Content-Type": "application/json"}
    });
    if (response.status === 200)
    {
      localStorage.removeItem("token");
      setShowProfile(false);
    }
  }

  return (
    <Router>
      <div className={"m-10"}>
        {/* Общая навигационная панель */}
        <nav>
          <NavLink to={"/"} className={"m-1 pl-[30px] pt-[7px] pr-[30px] pb-[7px] border-2"}
                   style={({isActive}) => ({fontWeight: isActive ? "bold" : ""})}>
            About us
          </NavLink>
          {
            showProfile ?
              <>
                <NavLink to={"/profile"} className={"m-1 pl-[30px] pt-[7px] pr-[30px] pb-[7px] border-2"}
                         style={({isActive}) => ({fontWeight: isActive ? "bold" : ""})}>
                  Profile
                </NavLink>
                <NavLink to={"/"} className={"m-1 pl-[30px] pt-[7px] pr-[30px] pb-[7px] border-2"} onClick={fnLogout}>
                  Sign out
                </NavLink>
              </>
              :
              <NavLink to={"/sign_in"} className={"m-1 pl-[30px] pt-[7px] pr-[30px] pb-[7px] border-2"}
                       style={({isActive}) => ({fontWeight: isActive ? "bold" : ""})}>
                Sign in
              </NavLink>
          }
        </nav>
        <main className={"m-1"}>
          <Routes>
            {/* Маршрут главной страницы About Us*/}
            <Route path="/" element={<AboutUs/>}/>
            {/* Маршрут страницы входа */}
            <Route path="/sign_in" element={<SignIn setShowProfile={setShowProfile}/>}/>
            {/* Защищенный маршрут страницы профиля */}
            <Route element={<ProtectedRoute/>}>
              <Route path="/profile" element={<Profile showProfile={showProfile}/>}/>
            </Route>
          </Routes>
        </main>
      </div>
    </Router>
  );
}