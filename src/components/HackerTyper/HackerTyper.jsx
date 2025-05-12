import React, { useState, useEffect } from 'react';
import './HackerTyper.css'; // Import external CSS for styling

function HackerTyper() {
  const [lineIndex, setLineIndex] = useState(0);  // Track the current line index
  const [typing, setTyping] = useState(false);  // Track if typing is in progress
  const [display, setDisplay] = useState(''); // final rendered text
  
  useEffect(() => {
    setLineIndex(0);
  }, []);

  useEffect(() => {
    const lines = [
      '',      
      'Mike Yep',
      '',
      'Senior Software Engineer with 25 years of experience specializing in backend development, cloud technologies, and building scalable systems. Proficient in Java, SQL, PostgreSQL, MySQL, Linux/UNIX environments, web development, and JavaScript. Experienced in troubleshooting, performance tuning, and collaborating in Agile teams to ensure high-quality software delivery. Adept at code reviews, mentoring junior engineers, and ensuring high-quality, maintainable code.',
      '',
      'SKILLS:',
      'AJAX, AWS, Agile, Bash, Bootstrap, C, C#, CI/CD, CSS, Code Review, Cryptography, DBeaver, DB2, DNS, Distributed Systems, Docker, EC2, Eclipse, ElasticSearch, Event-Driven, Exposed, FTP, Figma, FinTech, FullStack, Git, GitHub, Gradle, HTML, IntelliJ, JFreeChart, JUnit, Jackson, Java, JavaScript, Kanban, Kotlin, Linux, Microservices, Multi-Tenant, Multithreading, MySQL, Nagios, Networking, Node.js, PHP, PHPStorm, PostgreSQL, Postman, PowerShell, RabbitMQ, React, REST APIs, S3, SCRUM, SMTP, SOAP, Sqitch, SQL, SaaS, Servlets, TCP/IP, Telecom, Tomcat, VLAN, VPN, Visual Studio, Vue, Webpack, Wireshark, jQuery, pgAdmin',
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
        setTimeout(typeChar, 10); 
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
      {display}      
    </div>
  );
}

export default HackerTyper;
