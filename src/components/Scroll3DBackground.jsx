"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Scroll3DBackground() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 14;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // 2. Materials
    const redWireframeMat = new THREE.MeshBasicMaterial({
      color: 0xff003c,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });

    const glowRedMat = new THREE.MeshBasicMaterial({
      color: 0xff1a4f,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });

    // 3. Create 3D Objects
    // Object 1: Torus Knot Top Left
    const knotGeo = new THREE.TorusKnotGeometry(2, 0.5, 120, 16);
    const knot = new THREE.Mesh(knotGeo, redWireframeMat);
    knot.position.set(-6, 2, -3);
    scene.add(knot);

    // Object 2: Octahedron Center Right
    const octaGeo = new THREE.OctahedronGeometry(2.5, 1);
    const octa = new THREE.Mesh(octaGeo, glowRedMat);
    octa.position.set(7, -3, -6);
    scene.add(octa);

    // Object 3: Ring Center Left
    const ringGeo = new THREE.TorusGeometry(3.5, 0.1, 16, 100);
    const ring = new THREE.Mesh(ringGeo, redWireframeMat);
    ring.position.set(-5, -8, -4);
    ring.rotation.x = Math.PI / 3;
    scene.add(ring);

    // Object 4: Dodecahedron Bottom Right
    const dodecaGeo = new THREE.DodecahedronGeometry(2.2);
    const dodeca = new THREE.Mesh(dodecaGeo, glowRedMat);
    dodeca.position.set(6, -14, -5);
    scene.add(dodeca);

    // 4. Floating Particles Dust
    const particlesCount = 350;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 40;
    }

    const particlesGeo = new THREE.BufferGeometry();
    particlesGeo.setAttribute("position", new THREE.BufferAttribute(posArray, 3));

    const particlesMat = new THREE.PointsMaterial({
      size: 0.09,
      color: 0xff003c,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });

    const particlesMesh = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particlesMesh);

    // 5. Scroll & Mouse Tracking
    let targetScrollY = 0;
    let currentScrollY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handleScroll = () => {
      targetScrollY = window.scrollY;
    };

    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);

    // 6. Resize Handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // 7. Continuous Animation & Rotation Loop
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Smooth scroll interpolation
      currentScrollY += (targetScrollY - currentScrollY) * 0.06;

      // Continuous Fast Spin & Floating Waves
      knot.rotation.x = elapsedTime * 0.6 + currentScrollY * 0.003;
      knot.rotation.y = elapsedTime * 0.8 + currentScrollY * 0.004;
      knot.rotation.z = elapsedTime * 0.2;
      knot.position.y = 2 + Math.sin(elapsedTime * 1.5) * 0.4 - currentScrollY * 0.006;

      octa.rotation.x = -elapsedTime * 0.5 + currentScrollY * 0.002;
      octa.rotation.y = elapsedTime * 0.9 - currentScrollY * 0.003;
      octa.position.y = -3 + Math.cos(elapsedTime * 1.8) * 0.5 - currentScrollY * 0.005;

      ring.rotation.x = Math.PI / 3 + elapsedTime * 0.4;
      ring.rotation.y = elapsedTime * 0.5 + currentScrollY * 0.002;
      ring.position.y = -8 + Math.sin(elapsedTime * 1.2) * 0.3 - currentScrollY * 0.004;

      dodeca.rotation.x = elapsedTime * 0.7;
      dodeca.rotation.y = -elapsedTime * 0.6 + currentScrollY * 0.003;
      dodeca.position.y = -14 + Math.cos(elapsedTime * 1.4) * 0.4 - currentScrollY * 0.005;

      // Parallax Tilt based on Mouse
      camera.position.x += (mouseX * 1.5 - camera.position.x) * 0.05;
      camera.position.y += (-mouseY * 1.5 - camera.position.y) * 0.05;
      camera.lookAt(0, -currentScrollY * 0.005, 0);

      // Particle Motion
      particlesMesh.rotation.y = elapsedTime * 0.08 + currentScrollY * 0.0005;
      particlesMesh.rotation.x = elapsedTime * 0.04;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: -5,
        overflow: "hidden",
      }}
    />
  );
}
