import { useState, useRef, useCallback } from "react";
import { RequestText } from "../utils/requesttext";
import { moveCaretToEnd } from "../utils/movecarettoend";
import Editor from "./Editor";
import Suggestions from "./Suggestions";
import Stats from "./Stats";

const SpellChecker = () => {
  const textareaRef = useRef(null);
  const [suggestions, setSuggestions] = useState([]);
  const [id, setId] = useState(null);
  const [characters, setCharacters] = useState(0);
  const [wordsLength, setWordsLength] = useState(0);
  const [showSuggestionList, setShowSuggestionList] = useState(false);
  const [top, setTop] = useState();

  const checkSpelling = useCallback(async () => {
    const text = textareaRef.current.innerText.replaceAll("\n", " ");
    const textLength = text.split("").length;
    const words = text.split(" ");
    setWordsLength(words.length);
    setCharacters(textLength);
    const missSpellWords = new Set();
    const res = await RequestText(text);
    res.errors.forEach((e) => {
      missSpellWords.add(e.bad, e);
    });
    let correctText = text
      .split(" ")
      .map((word, index) => {
        if (missSpellWords.has(word.trim())) {
          return `<span class='spell-error' id=${index}>${word}</span>`;
        }
        return `<span id=${index}>${word}</span>`;
      })
      .join(" ");
    textareaRef.current.innerHTML = correctText;
    moveCaretToEnd(textareaRef.current);
  }, []);

  const getSuggestions = useCallback(async (event) => {
    if (event.target.id !== "spelling-checker") {
      event.preventDefault();
      const text = textareaRef.current.innerText;
      setId(event.target.id);
      setShowSuggestionList(true);
      setTop(textareaRef.current.offsetTop || event.target.offsetTop);
      const res = await RequestText(text);
      if (res.errrors || []) {
        setSuggestions(
          res.errors
            .filter((e) => e.better || [])
            .map((e) => e.better)
            .flat()
        );
      } else {
        setSuggestions([]);
      }
    }
  }, []);

  const replaceWord = useCallback(
    async (event) => {
      const el = document.getElementById(id);
      el.innerText = event.target.innerText;
      setShowSuggestionList(false);
      el.classList.remove("spell-error");
      setSuggestions([]);
      moveCaretToEnd(textareaRef.current);
    },
    [id]
  );

  return (
    <>
      <div className="container">
        <Editor
          textareaRef={textareaRef}
          checkSpelling={checkSpelling}
          getSuggestions={getSuggestions}
        />
        {showSuggestionList && (
          <div style={{ top: top + "px" }} className="suggestion-list">
            <Suggestions suggestions={suggestions} replaceWord={replaceWord} />
          </div>
        )}
        <Stats wordsLength={wordsLength} characters={characters} />
      </div>
    </>
  );
};

export default SpellChecker;