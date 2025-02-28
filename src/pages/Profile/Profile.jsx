import {useEffect} from "react";
import {useNavigate} from "react-router-dom";

export default function Profile({showProfile})
{
  const navigate = useNavigate();

  useEffect(() =>
  {
    document.title = "Profile";
    if (!showProfile)
    {
      navigate("/");
    }
  }, [showProfile]);

  useEffect(() =>
  {
    const getProfileInfo = async () =>
    {
      // Исходя из ТЗ передал токен в query params, но лучше использовать заголовок Authorization в headers
      const response = await fetch("http://localhost:5000/profile?token=" + localStorage.getItem("token"), {
        method: "GET",
        headers: {"Content-Type": "application/json"}
      });
      if (response.status === 200)
      {
        const json = await response.json();
        console.log(json);
      }
    }
    getProfileInfo();
  }, [])

  return (
    <div className={"m-1 mt-5"}>profile</div>
  );
}