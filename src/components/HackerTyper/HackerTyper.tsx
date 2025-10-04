import React, { useState, useEffect, useRef } from "react"
import "./HackerTyper.css"

const LINES: string[] = [
  "",
  "Mike Yep",
  "",
  "Senior Software Engineer with 25 years of experience specializing in backend development, cloud technologies, and building scalable systems. Proficient in Java, SQL, PostgreSQL, MySQL, Linux/UNIX environments, web development, and JavaScript. Experienced in troubleshooting, performance tuning, and collaborating in Agile teams to ensure high-quality software delivery. Adept at code reviews, mentoring junior engineers, and ensuring high-quality, maintainable code.",
  "",
  "SKILLS:",
  "AJAX, AWS, Agile, Bash, Bootstrap, C, C#, CI/CD, CSS, Code Review, Cryptography, DBeaver, DB2, DNS, Distributed Systems, Docker, EC2, Eclipse, ElasticSearch, Event-Driven, Exposed, FTP, Figma, FinTech, FullStack, Git, GitHub, Gradle, HTML, IntelliJ, JFreeChart, JUnit, Jackson, Java, JavaScript, Kanban, Kotlin, Linux, Microservices, Multi-Tenant, Multithreading, MySQL, Nagios, Networking, Node.js, PHP, PHPStorm, PostgreSQL, Postman, PowerShell, RabbitMQ, React, REST APIs, S3, SCRUM, SMTP, SOAP, Sqitch, SQL, SaaS, Servlets, TCP/IP, Telecom, Tomcat, VLAN, VPN, Visual Studio, Vue, Webpack, Wireshark, jQuery, pgAdmin",
  "",
  "Normal Termination",
]

function HackerTyper() {
  const [lineIndex, setLineIndex] = useState<number>(0)
  const [typing, setTyping] = useState<boolean>(false)
  const [display, setDisplay] = useState<string>("")

  const typeTimer = useRef<number | null>(null)
  const restartTimer = useRef<number | null>(null)
  const started = useRef<boolean>(false) // StrictMode guard

  // initialize once
  useEffect(() => {
    if (started.current) return
    started.current = true
    setLineIndex(0)
    setDisplay("")
    setTyping(false)
    return () => {
      if (typeTimer.current) window.clearTimeout(typeTimer.current)
      if (restartTimer.current) window.clearTimeout(restartTimer.current)
    }
  }, [])

  // typing effect
  useEffect(() => {
    if (typing || lineIndex >= LINES.length) return

    setTyping(true)
    const fullLine = LINES[lineIndex] ?? ""
    let charIndex = 0

    const typeChar = () => {
      if (charIndex < fullLine.length) {
        const ch = fullLine.charAt(charIndex)
        if (ch) setDisplay((prev) => prev + ch)
        charIndex++
        typeTimer.current = window.setTimeout(typeChar, 10)
      } else {
        // finished line
        if (lineIndex < LINES.length - 1) {
          setDisplay((prev) => prev + "\n")
          setTyping(false)
          typeTimer.current = window.setTimeout(
            () => setLineIndex((prev) => prev + 1),
            50
          )
        } else {
          // finished all
          setTyping(false)
          restartTimer.current = window.setTimeout(() => {
            setDisplay("")
            setLineIndex(0)
          }, 5000)
        }
      }
    }

    typeChar()

    return () => {
      if (typeTimer.current) window.clearTimeout(typeTimer.current)
    }
  }, [lineIndex])

  return <pre className="hacker-typer-container">{display}</pre>
}

export default HackerTyper
