import { useState } from "react";
import { readFileFromApi } from "./services.js";
import "./App.css"
import logo from './logo.png';
import ReactMarkdown from "react-markdown";

function App() {
  const [prompt, setPrompt] = useState("how api works");
  const [text, setText] = useState("");

  const run = async (prompt) => {
    const data = await readFileFromApi(prompt);
    const textContent = data?.candidates[0]?.content?.parts[0]?.text;
    setText(textContent);
  };

  return (
    <div className="App">
      <img src={logo} alt="logo" height={"80rem"} />
      <div style={{display:"flex", justifyContent:"center", alignItems:"center",flexDirection:"column", gap: "1rem"}}>
        <h1>Hey there, Genixis here to help you!</h1>
      <input type="text" onChange={(e)=>setPrompt(e.target.value)} className="inputPrompt" placeholder="Wrtie Anything here" />
      <button onClick={() => run(prompt)} className="searchButton">Search Here</button>
     {text && <div style={{textAlign:"left", padding:"1rem", margin:"1rem", backgroundColor:"grey", color:"white"}}> <ReactMarkdown>{text}</ReactMarkdown></div>}
      </div>
    </div>
  );
}

export default App;
