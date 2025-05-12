import React, { useState, useEffect } from 'react';
import './HackerTyper.css'; // Import external CSS for styling

function HackerTyper() {
  const [lineIndex, setLineIndex] = useState(0);  // Track the current line index
  const [typing, setTyping] = useState(false);  // Track if typing is in progress
  const [display, setDisplay] = useState(''); // final rendered text

  useEffect(() => {
    const lines = [
      '',
      'Mike Yep',
      '',
      'Senior Software Engineer with 25 years of experience specializing in backend development,',
      'cloud technologies, and building scalable systems. Proficient in Java, SQL, PostgreSQL, MySQL, Linux/UNIX',
      'environments, web development, and JavaScript. Experienced in troubleshooting, performance tuning, and',
      'collaborating in Agile teams to ensure high-quality software delivery. Adept at code reviews, mentoring',
      'junior engineers, and ensuring high-quality, maintainable code.',
      '',
      'TECHNICAL SKILLS',
      '',
      'Languages & Frameworks: Java, Kotlin, C#, C, PHP, .NET, JavaScript, HTML, CSS, SASS, Vue, React, jQuery, Node.js',
      '',
      'Web & Backend Development: REST APIs, API integrations, Microservices',
      '',
      'Databases: PostgreSQL, MySQL, MS SQL Server (SSMS), DB2',
      '',
      'Tools & IDEs: IntelliJ, PHPStorm, Visual Studio, Postman, Git, Gradle, Sqitch',
      '',
      'DevOps & Systems: Linux, Bash scripting, Docker, Server administration, CI/CD practices',
      '',
      'Cloud & Networking: AWS, Networking, PRI/SIP/VOIP systems',
      '',
      'Architecture & Software Practices: Backend development, Data modeling, Agile development, Unit testing',
      '(JUnit, custom), RabbitMQ, SCRUM, Kanban',
      '',
      'Normal Termination'
    ];

    if (typing || lineIndex >= lines.length) return;

    setTyping(true);
    const fullLine = lines[lineIndex];
    let charIndex = 0;

    const typeChar = () => {
      if (charIndex < fullLine.length) {
        // Append the character to the display
        setDisplay((prev) => prev + fullLine[charIndex - 1]);
        charIndex++;
        setTimeout(typeChar, 30); 
      } else {
        // When the line is finished, add a newline character and move to next line
        setDisplay((prev) => prev + '\n');
        setLineIndex((prev) => prev + 1);  // Move to next line
        setTyping(false);

        // Restart after the last line
        if (lineIndex === lines.length - 1) {
          setTimeout(() => {
            setDisplay('');
            setLineIndex(0);  // Reset to the first line
          }, 5000); // 3-second pause before restarting
        }
      }
    };

    typeChar();  // Start typing

  }, [lineIndex, typing]);  // Trigger when lineIndex or typing changes

  return (
    <div className="hacker-typer-container">
      {display.split('\n').map((line, i) => (
        <span key={i}>{line}<br /></span>  // Render each line with <br />
      ))}
    </div>
  );
}

export default HackerTyper;
