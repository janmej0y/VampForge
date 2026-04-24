"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type OrbitThreeSceneProps = {
  skills: string[];
};

export function OrbitThreeScene({ skills }: OrbitThreeSceneProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.05, 2),
      new THREE.MeshStandardMaterial({
        color: 0x67e8f9,
        emissive: 0x164e63,
        roughness: 0.26,
        metalness: 0.18,
        transparent: true,
        opacity: 0.9,
      })
    );
    group.add(core);

    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xa78bfa,
      transparent: true,
      opacity: 0.42,
      side: THREE.DoubleSide,
    });

    [1.95, 2.65, 3.35].forEach((radius, index) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(radius, 0.01, 12, 144),
        ringMaterial.clone()
      );
      ring.rotation.x = Math.PI / (2.4 + index * 0.34);
      ring.rotation.y = index * 0.78;
      group.add(ring);
    });

    const nodeMaterial = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      emissive: 0x713f12,
      roughness: 0.2,
      metalness: 0.2,
    });

    const skillNodes = skills.slice(0, 12).map((_, index) => {
      const angle = (index / Math.max(1, skills.length)) * Math.PI * 2;
      const radius = 2.25 + (index % 3) * 0.48;
      const node = new THREE.Mesh(new THREE.SphereGeometry(0.085, 18, 18), nodeMaterial);
      node.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle * 1.7) * 0.55,
        Math.sin(angle) * radius
      );
      group.add(node);
      return node;
    });

    scene.add(new THREE.AmbientLight(0xffffff, 0.8));

    const cyanLight = new THREE.PointLight(0x67e8f9, 2.4, 16);
    cyanLight.position.set(3, 3, 4);
    scene.add(cyanLight);

    const violetLight = new THREE.PointLight(0xa78bfa, 1.8, 14);
    violetLight.position.set(-3, -2, 3);
    scene.add(violetLight);

    let frameId = 0;

    const resize = () => {
      const rect = mount.getBoundingClientRect();
      const width = Math.max(1, rect.width);
      const height = Math.max(1, rect.height);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const animate = () => {
      frameId = window.requestAnimationFrame(animate);
      group.rotation.y += 0.006;
      group.rotation.x = Math.sin(Date.now() / 2800) * 0.08;
      core.rotation.x += 0.004;
      core.rotation.z += 0.003;
      skillNodes.forEach((node, index) => {
        node.scale.setScalar(1 + Math.sin(Date.now() / 600 + index) * 0.18);
      });
      renderer.render(scene, camera);
    };

    resize();
    animate();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(frameId);
      renderer.dispose();
      mount.removeChild(renderer.domElement);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    };
  }, [skills]);

  return <div ref={mountRef} className="absolute inset-0" aria-hidden="true" />;
}
