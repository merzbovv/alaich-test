import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

export default function SignIn({setShowProfile})
{
  const [formData, setFormData] = useState({email: "", password: ""});
  const [, setToken] = useState(localStorage.getItem("token") || null);

  const navigate = useNavigate();

  useEffect(() =>
  {
    document.title = "Sign In";
  }, []);

  // Обработчик изменения значений в форме
  function fnChangeValuesInForm(event)
  {
    const {name, value} = event.target;
    setFormData((prevData) => ({...prevData, [name]: value}));
  }

  // Авторизация
  async function fnAuth(event)
  {
    event.preventDefault();
    const response = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(formData)
    });
    if (response.status === 200)
    {
      const json = await response.json();
      setToken(json.data.token); // Устанавливаем токен в состояние
      localStorage.setItem("token", JSON.parse(JSON.stringify(json.data.token))); // Сохраняем токен в localStorage
      setShowProfile(true);
      navigate("/profile");
    }
  }

  return (
    <form className={"m-1 mt-5"}>
      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700 mb-2">
          Email address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={fnChangeValuesInForm}
          className="p-2 border-[3px] rounded-lg w-[300px]"
          placeholder="Enter email"
        />
        <p className={"m-1 text-[11px] text-[#808080]"}>We'll never share your email with anyone else.</p>
      </div>
      <div>
        <label htmlFor="password" className="block text-gray-700 mb-2">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={fnChangeValuesInForm}
          className="p-2 border-[3px] rounded-lg w-[300px]"
          placeholder="Password"
        />
      </div>
      <button onClick={fnAuth} type="submit"
              className={"bg-blue-500 rounded-[5px] p-[10px] m-[1px] mt-[20px] hover:bg-[#3274df] text-[white]"}>Submit
      </button>
    </form>
  );
}