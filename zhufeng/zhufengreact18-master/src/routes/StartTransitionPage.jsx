import React, { useState, useEffect, startTransition } from 'react';
function getWords(keyword) {
  let words = new Array(10000).fill(keyword);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(words);
    }, 1000 * keyword.length)
  });
}
function Suggestions({ keyword }) {
  const [words, setWords] = useState([]);
  useEffect(() => {
    if (keyword && keyword.length > 0) {
      getWords(keyword).then(words => {
        startTransition(() => {
          setWords(words);
        })
      });
    }
  });
  return (
    <ul>
      {
        words.map((word, index) => <li key={index}>{word}</li>)
      }
    </ul>
  )
}
function StartTransitionPage() {
  const [keyword, setKeyword] = useState("");
  const handleChange = (event) => {
    setKeyword(event.target.value);
  }
  return (
    <div>
      <div>关键字<input value={keyword} onChange={handleChange}></input></div>
      <Suggestions keyword={keyword} />
    </div>
  )
}
export default StartTransitionPage;