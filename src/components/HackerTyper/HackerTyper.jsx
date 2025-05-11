import React, { useState, useEffect } from 'react';
import './HackerTyper.css'; // Import external CSS for styling

function HackerTyper() {
  const [code, setCode] = useState('');
  const [lineIndex, setLineIndex] = useState(0);  // Track the current line index
  const [typing, setTyping] = useState(false);  // Track if typing is in progress

  const lines = [
    'const password = "admin123";',
    'function hackThePlanet() {',
    '  let response = sendRequest("http://hackerspace.com");',
    '  if (response.status === 200) {',
    '    executeCommand(response.data);',
    '  }',
    '}',
    'hackThePlanet();',
    '/* Hacking successful. */'
  ];

  useEffect(() => {
    const typingEffect = () => {
      const currentLine = lines[lineIndex];

      if (code.length < currentLine.length && !typing) {
        setTyping(true);
        setTimeout(() => {
          setCode((prev) => prev + currentLine[prev.length]);  // Add one character at a time
          setTyping(false);
        }, 50);  // Typing speed: 50ms per character
      } else if (code.length === currentLine.length) {
        // Once the line is fully typed, wait for 2 seconds, then move to the next line
        setTimeout(() => {
          setCode((prev) => prev + '\n');  // Add a newline character after the line is typed
          setLineIndex((prevIndex) => (prevIndex + 1) % lines.length);  // Move to the next line
        }, 2000);  // Pause for 2 seconds before moving to the next line
      }
    };

    typingEffect();  // Call once to start typing immediately

  }, [code, lineIndex, typing]);  // Dependency on `code`, `lineIndex`, and `typing`

  return (
    <div className="hacker-typer-container">
      {code.split('\n').map((line, index) => (
        <span key={index}>{line}<br /></span>  // Render each line with a <br /> tag
      ))}
    </div>
  );
}

export default HackerTyper;
