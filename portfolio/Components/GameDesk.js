
import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import {  useGLTF } from "@react-three/drei";



export default function GameDesk(){
const { scene } = useGLTF('/Game.glb');
const ref=useRef();


  const [direction, setDirection] = useState(1); // 1 = left, -1 = right
  const [phase, setPhase] = useState("left"); // left → center → right → center
  const speed = 0.01; // adjust speed
  const maxRotation = Math.PI / 4; // 45 degrees in radians

  useFrame(() => {
    if (!ref.current) return;

    const y = ref.current.rotation.y;

    if (phase === "left") {
      if (y < maxRotation) {
        ref.current.rotation.y += speed;
      } else {
        setPhase("centerFromLeft");
      }
    } else if (phase === "centerFromLeft") {
      if (y > 0) {
        ref.current.rotation.y -= speed;
      } else {
        setPhase("right");
      }
    } else if (phase === "right") {
      if (y > -maxRotation) {
        ref.current.rotation.y -= speed;
      } else {
        setPhase("centerFromRight");
      }
    } else if (phase === "centerFromRight") {
      if (y < 0) {
        ref.current.rotation.y += speed;
      } else {
        setPhase("left");
      }
    }
  });

return <primitive object={scene} position={[0.4,0,3]} ref={ref} rotation={[1,0,0]} />;
}