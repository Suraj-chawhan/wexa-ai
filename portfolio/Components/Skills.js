import { useEffect, useRef } from "react";
import gsap from "gsap";

const skills = [
  { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
  { name: "Express", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" },
  { name: "MongoDB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
  { name: "PyTorch", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg" },
  { name: "Next.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
  { name: "C++", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" },
  { name: "Java", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
  { name: "Flask", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg" },
];

export default function SkillSection() {
  const skillRef = useRef(null);

  useEffect(() => {
    const boxes = skillRef.current.querySelectorAll(".skill-box");
    gsap.fromTo(boxes,
      { opacity: 0, y: 50 },
      {
        opacity: 1, y: 0,
        duration: 0.8, stagger: 0.2,
        scrollTrigger: {
          trigger: skillRef.current,
          start: "top 80%",
        }
      }
    );
  }, []);

  return (
    <section id="skills" style={{ padding: "40px 20px", textAlign: "center", backgroundColor: "#000", color: "#fff" }} ref={skillRef}>
      <h2 style={{ fontSize: "2.5rem", marginBottom: "20px", color: "#6A0DAD" }}>Skills</h2>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px" }}>
        {skills.map((skill, i) => (
          <div key={i} className="skill-box" style={{
            width: "100px", textAlign: "center", padding: "10px", backgroundColor: "#111", borderRadius: "8px"
          }}>
            <img src={skill.icon} alt={skill.name} style={{ width: "50px", height: "50px" }} />
            <p style={{ marginTop: "8px" }}>{skill.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
