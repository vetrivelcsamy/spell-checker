import { useState, useRef, useCallback } from "react";
import { RequestText } from "../utils/requesttext";
import { moveCaretToEnd } from "../utils/movecarettoend";
import Stats from "./Stats";
import Suggestions from "./Suggestions";

const SpellChecker = () => {
  const textareaRef = useRef();
  const [suggestions, setSuggestions] = useState([]);
  const [id, setId] = useState(null);
  const [characters, setCharacters] = useState(0);
  const [wordsLength, setWordsLength] = useState(0);
  const [showSuggestionList, setShowSuggestionList] = useState(false);
  const [top, setTop] = useState();
  const [left, setLeft] = useState();
  

  const checkSpelling = useCallback(async () => {
    const text = textareaRef.current.innerText.replaceAll("\n", " ");
    const textLength = text.split('').length;
    const words = text.split(" ");
    setWordsLength(words.length);
    setCharacters(textLength);
    const missSpellWords = new Set();
    const res = await RequestText(text);
    res.errors.forEach((e) => {
      missSpellWords.add(e.bad, e);
    });
    let correctText = text.split(" ");
    correctText = correctText
      .map((text, index) => {
        if (missSpellWords.has(text.trim())) {
          const htmlFrag = `<span class='spell-error' id=${index}>${text}</span>`;
          return htmlFrag;
        }
        return `<span id=${index}>${text}</span>`;
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
      setLeft(textareaRef.current.offsetLeft || event.target.offsetLeft);
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
      <div
        contentEditable
        autoFocus
        id="spelling-checker"
        className="editor"
        spellCheck={false}
        ref={textareaRef}
        onInput={checkSpelling}
        onChange={checkSpelling}
        onContextMenu={getSuggestions}
      />
        {showSuggestionList && (
            <div
                className="suggestion-list"
                style={{
                    top: top,
                    left: left,
                }}>
                <Suggestions
                    suggestions={suggestions}
                    replaceWord={replaceWord}
                />
            </div>
        )}
        <Stats wordsLength={wordsLength} characters={characters} />
      </div>
    </>
  );
};

export default SpellChecker;