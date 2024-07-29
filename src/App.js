import { useState, useEffect } from "react";
import { readFileFromApi } from "./services.js";
import "./App.css";
import ReactMarkdown from "react-markdown";
import { CopyToClipboard } from "react-copy-to-clipboard";
import CloseIcon from "@mui/icons-material/Close";

function App() {
  const [prompt, setPrompt] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [placeholder, setPlaceholder] = useState("|");
  const [search, setSearch] = useState([]);
  const [charIndex, setCharIndex] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const suggestions = "Search Here...";
  const recentSearchesKey = "recentSearches";

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const savedPrompt = localStorage.getItem("prompt");
    if (savedPrompt) {
      setPrompt(savedPrompt);
    }

    const savedSearches = JSON.parse(localStorage.getItem(recentSearchesKey));
    if (savedSearches) {
      setSearch(savedSearches);
    }
  }, []);

  const savePrompt = (newPrompt) => {
    setSearch((prevItems) => {
      const updatedSearches = [...prevItems, newPrompt];
      localStorage.setItem(recentSearchesKey, JSON.stringify(updatedSearches));
      return updatedSearches;
    });
  };

  const removePrompt = (indexToRemove) => {
    setSearch((prevItems) => {
      const updatedSearches = prevItems.filter(
        (_, index) => index !== indexToRemove
      );
      localStorage.setItem(recentSearchesKey, JSON.stringify(updatedSearches));
      return updatedSearches;
    });
  };

  const handleSearchClick = (searchItem) => {
    setPrompt(searchItem);
    run(searchItem);
  };

  useEffect(() => {
    const typeIt = () => {
      if (charIndex < suggestions.length) {
        setPlaceholder(
          (prev) => prev.slice(0, -1) + suggestions[charIndex] + "|"
        );
        setCharIndex((prev) => prev + 1);
      } else {
        setPlaceholder("");
        setCharIndex(0);
      }
    };

    const interval = setInterval(
      typeIt,
      Math.round(Math.random() * (200 - 30)) + 30
    );

    return () => clearInterval(interval);
  }, [charIndex, suggestions]);

  const run = async (prompt) => {
    setLoading(true);
    const data = await readFileFromApi(prompt);
    const textContent = data?.candidates[0]?.content?.parts[0]?.text;
    setText(textContent);
    setLoading(false);
    setCopied(false);

    if (!search.includes(prompt)) {
      savePrompt(prompt);
    }
  };

  return (
    <div className="App">
      <div className="mainContainer">
        {windowWidth < 768 ? (
          <button
            className="toggleButton"
            onClick={() => setShowHistory((prev) => !prev)}
          >
            {showHistory ? "Hide History" : "Show History"}
          </button>
        ) : (
          <div className="history">
            <h3>Recent Searches</h3>
            <div className="searchContainer">
              {search?.map((searchItem, index) => (
                <div key={index} className="searchItem">
                  <p
                    className="search"
                    onClick={() => handleSearchClick(searchItem)}
                  >
                    {searchItem}
                  </p>
                  <p onClick={() => removePrompt(index)}>
                    <CloseIcon />
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
        {showHistory && (
          <div className="history">
            <h3>Recent Searches</h3>
            <div className="searchContainer">
              {search?.map((searchItem, index) => (
                <div key={index} className="searchItem">
                  <p
                    className="search"
                    onClick={() => handleSearchClick(searchItem)}
                  >
                    {searchItem}
                  </p>
                  <p onClick={() => removePrompt(index)}>
                    <CloseIcon />
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="centeredFlexColumn">
          <h1 className="title">
            Get your, <br />{" "}
            <span className="logoTitle">Genixis AI Application</span> <br />{" "}
            here to help you!
          </h1>
          <p className="subheading">
            Give it a try right below, without having to sign up!
          </p>
          <div className="inputContainer">
            <input
              type="text"
              onChange={(e) => setPrompt(e.target.value)}
              className="inputPrompt"
              placeholder={placeholder}
              value={prompt}
            />
            <button onClick={() => run(prompt)} className="searchButton">
              Generate ✨
            </button>
          </div>
          {loading ? (
            <div className="promptText loadingSkeleton">Loading...</div>
          ) : (
            text && (
              <div className="promptText">
                <ReactMarkdown>{text}</ReactMarkdown>
                <CopyToClipboard text={text} onCopy={() => setCopied(true)}>
                  <button className="copyButton">
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </CopyToClipboard>
              </div>
            )
          )}
          {/* <div className="authButtons">
            <button className="buttonLogin">Login</button>
            <button className="buttonLogin">Sign Up</button>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default App;
