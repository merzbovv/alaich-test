import {useEffect, useState} from "react";

export default function AboutUs()
{
  const [description, setDescription] = useState("");

  useEffect(() =>
  {
    document.title = "About Us";
    const getInfo = async () =>
    {
      const response = await fetch("http://localhost:5000/info", {
        method: "GET",
        headers: {"Content-Type": "application/json"}
      });
      if (response.status === 200)
      {
        const json = await response.json();
        if (json.success)
        {
          setDescription(json.data.info);
        }
      }
    }
    getInfo();
  }, []);

  return <p dangerouslySetInnerHTML={{__html: description}} className={"m-1 mt-5"}/>;
}