const Stats = (props) => {
  const { wordsLength, characters } = props;
  return (
   <>
    <ul className="stats">
        <li>{wordsLength} Words</li>
        <li>{characters} Characters</li>
    </ul>
   </>
  )
} 
export default Stats;