import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import logo from "./logo.png";

export default function Profile({showProfile})
{
  const [fullname, setFullname] = useState("");
  const [showRequesting, setShowRequesting] = useState(false);
  const [step1, setStep1] = useState("");
  const [step2, setStep2] = useState("");
  const [author, setAuthor] = useState({});
  const [quote, setQuote] = useState("");
  // Состояние для хранения ID таймеров
  const [timeout1, setTimeout1] = useState(null);
  const [timeout2, setTimeout2] = useState(null);
  const [timeout3, setTimeout3] = useState(null);

  const navigate = useNavigate();

  useEffect(() =>
  {
    document.title = "Profile";
    if (localStorage.getItem("token") === null)
    {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        setFullname(json.data.fullname);
      }
    }
    getProfileInfo();
  }, [])

  async function fnUpdate(event)
  {
    event.preventDefault();
    setStep1("");
    setStep2("");
    setShowRequesting(true);
    /*
    * Запускаем цепочку вызовов
    * 1. getAuthors - получаем случайного автора с задержкой 5 секунд
    * 2. getQuote - получаем случайную цитату автора с задержкой 5 секунд
    */
    const timer1 = setTimeout(async () =>
    {
      const getAuthor = await fetch("http://localhost:5000/author?token=" + localStorage.getItem("token"), {
        method: "GET",
        headers: {"Content-Type": "application/json"}
      });
      if (getAuthor.status === 200)
      {
        const resAuthor = await getAuthor.json();
        setAuthor(resAuthor.data);
        setStep1("Completed");
        const timer2 = setTimeout(async () =>
        {
          const getQuote = await fetch("http://localhost:5000/quote?token=" + localStorage.getItem("token") + "&authorId=" + resAuthor.data.authorId, {
            method: "GET",
            headers: {"Content-Type": "application/json"}
          });
          if (getQuote.status === 200)
          {
            const quote = await getQuote.json();
            setQuote(quote.data);
            setStep2("Completed");
            const timer3 = setTimeout(() =>
            {
              setShowRequesting(false);
            }, 2000)
            setTimeout3(timer3);
          }
        }, 5000);
        setTimeout2(timer2);
      }
    }, 5000);
    setTimeout1(timer1);
  }

  // Функция для отмены всех таймеров
  function fnStopAllTimeouts()
  {
    setShowRequesting(false);
    if (timeout1)
    {
      clearTimeout(timeout1); // Останавливаем первый таймер
    }
    if (timeout2)
    {
      clearTimeout(timeout2); // Останавливаем второй таймер
    }
    if (timeout3)
    {
      clearTimeout(timeout3); // Останавливаем третий таймер
    }
  }

  return (
    <div className={"m-1 mt-5"}>
      <div className={"flex items-center"}>
        <img src={logo} alt="logo" className={"mr-[30px]"}/>
        <div>
          <h1 className={"text-4xl font-bold"}>Welcome, {fullname}!</h1>
          {/* Кнопка для открытия модального окна, с последующим вызовом компоненты, которая запустит цепочку вызовов */}
          <button onClick={fnUpdate} type="button"
                  className={"bg-blue-500 rounded-[5px] p-[10px] m-[1px] mt-[20px] hover:bg-[#3274df] text-[white]"}>
            Update
          </button>
        </div>
      </div>
      <div className={"m-[20px]"}>
        {
          author.authorId !== 0 && quote.length !== 0 ?
            <p><b>{author.name}</b> - {quote.quote}</p>
            :
            <p>[here is place for concatenated result from long running call]</p>
        }
      </div>
      {
        showRequesting &&
        <>
          <div className={"fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"}
               id="backgroundOverlay" onClick={() => setShowRequesting(false)}/>
          <div
            className={" flex flex-col border-4 p-[20px] fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#fff] rounded-[10px]"}>
            <h1 className={"text-4xl font-bold"}>Requesting the quote</h1>
            <div className={"mt-[10px]"}>
              <p>Step 1: Requesting author... {step1}</p>
              <p>Step 2: Requesting quote... {step2}</p>
            </div>
            <button
              onClick={fnStopAllTimeouts}
              type="button"
              className={"bg-blue-500 rounded-[5px] p-[10px] m-[1px] mt-[20px] hover:bg-[#3274df] text-[white] w-[80px]"}>
              Cancel
            </button>
          </div>
        </>
      }
    </div>
  );
}