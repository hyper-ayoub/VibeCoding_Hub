"use client"

import { useState } from "react"

export default function MagicButton() {
  const [isHovered, setIsHovered] = useState(false)

  const containerStyles = {
    display: "inline-block",
  }

  const buttonStyles = {
    position: "relative",
    overflow: "hidden",
    borderRadius: "60px",
    background: "transparent",
    padding: "3px",
    border: "none",
    cursor: "pointer",
    transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    transform: isHovered ? "scale(1.08) rotateX(5deg)" : "scale(1)",
    boxShadow: isHovered
      ? "0 30px 60px -12px rgba(102, 126, 234, 0.4), 0 0 0 1px rgba(255,255,255,0.1)"
      : "0 10px 25px -5px rgba(102, 126, 234, 0.2)",
    filter: isHovered ? "brightness(1.1)" : "brightness(1)",
  }

  const contentStyles = {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "15px",
    background: isHovered
      ? "url('/placeholder.svg?height=400&width=600') center/cover, linear-gradient(135deg, rgba(45, 55, 72, 0.8), rgba(26, 32, 44, 0.8))"
      : "linear-gradient(135deg, #1a202c, #2d3748)",
    borderRadius: "57px",
    padding: "20px 40px",
    transition: "all 0.4s ease",
    backdropFilter: "blur(10px)",
  }

  const textStyles = {
    color: "white",
    fontWeight: "700",
    fontSize: "20px",
    letterSpacing: "0.5px",
    margin: 0,
    textShadow: "0 2px 4px rgba(0,0,0,0.3)",
    background: isHovered ? "linear-gradient(45deg, #667eea, #764ba2, #f093fb)" : "transparent",
    backgroundClip: isHovered ? "text" : "unset",
    WebkitBackgroundClip: isHovered ? "text" : "unset",
    WebkitTextFillColor: isHovered ? "transparent" : "white",
    transition: "all 0.3s ease",
  }

  const iconStyles = {
    width: "24px",
    height: "24px",
    color: "#f093fb",
    transition: "all 0.4s ease",
    transform: isHovered ? "rotate(180deg) scale(1.2)" : "rotate(0deg) scale(1)",
    filter: isHovered ? "drop-shadow(0 0 8px #f093fb)" : "none",
  }

  const arrowStyles = {
    width: "22px",
    height: "22px",
    color: "white",
    transition: "all 0.3s ease",
    transform: isHovered ? "translateX(8px) scale(1.1)" : "translateX(0)",
  }

  const orbStyles = {
    position: "absolute",
    inset: "0",
    opacity: isHovered ? 1 : 0,
    transition: "opacity 0.4s ease",
    pointerEvents: "none",
  }

  const waveStyles = {
    position: "absolute",
    top: "0",
    left: "-100%",
    width: "100%",
    height: "100%",
    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
    transform: isHovered ? "translateX(300%)" : "translateX(0%)",
    transition: "transform 0.8s ease-in-out",
    pointerEvents: "none",
  }

  const glowStyles = {
    position: "absolute",
    inset: "-10px",
    borderRadius: "70px",
    background: "transparent",
    filter: "blur(25px)",
    opacity: isHovered ? 0.6 : 0,
    transition: "opacity 0.4s ease",
    zIndex: -1,
    pointerEvents: "none",
    animation: isHovered ? "pulse 2s infinite" : "none",
  }

  const orbPositions = [
    { top: "10%", left: "15%", delay: "0s", size: "6px" },
    { top: "20%", right: "20%", delay: "0.3s", size: "4px" },
    { bottom: "25%", left: "25%", delay: "0.6s", size: "5px" },
    { bottom: "15%", right: "15%", delay: "0.9s", size: "7px" },
    { top: "50%", left: "10%", delay: "1.2s", size: "3px" },
    { top: "60%", right: "12%", delay: "1.5s", size: "5px" },
  ]

  return (
    <div style={containerStyles}>
      <button style={buttonStyles} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        {/* Floating orbs */}
        <div style={orbStyles}>
          {orbPositions.map((pos, index) => (
            <div
              key={index}
              style={{
                position: "absolute",
                ...pos,
                width: pos.size,
                height: pos.size,
                background: "radial-gradient(circle, #f093fb, #667eea)",
                borderRadius: "50%",
                animation: isHovered ? `float 3s ease-in-out infinite ${pos.delay}` : "none",
                boxShadow: "0 0 10px rgba(240, 147, 251, 0.8)",
              }}
            />
          ))}
        </div>

        {/* Button content */}
        <div style={contentStyles}>
          {/* Magic star icon */}
          <svg style={iconStyles} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L6 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>

          {/* Button text */}
          <span style={textStyles}>Get Started Now</span>

          {/* Arrow icon */}
          <svg style={arrowStyles} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>

          {/* Wave effect */}
          <div style={waveStyles} />
        </div>

        {/* Glow effect */}
        <div style={glowStyles} />

        <style jsx>{`
          @keyframes float {
            0%, 100% {
              transform: translateY(0px) scale(1);
              opacity: 0.7;
            }
            50% {
              transform: translateY(-10px) scale(1.2);
              opacity: 1;
            }
          }
          
          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.05);
            }
          }
        `}</style>
      </button>
    </div>
  )
}
