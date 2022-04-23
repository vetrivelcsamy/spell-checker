const Suggestions = (props) => {
  const { suggestions, replaceWord } = props;
  return (
    <> 
      <ul className="auto-suggestions">
        {suggestions.map((s, index) => (
          <li
            key={index}
            className="suggestion-item"
            onClick={replaceWord}>
            {s}
          </li>
         ))}
      </ul>
    </>
  )
}
export default Suggestions;