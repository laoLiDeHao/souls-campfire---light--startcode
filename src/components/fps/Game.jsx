/* eslint-disable */

import { useGLTF } from "@react-three/drei";
import useOctree from "./useOctree";
import Player from "./Player";
import useOctreeHelper from "./useOctreeHelper";
import { useEffect, useRef, useState } from "react";
import SphereCollider from "./SphereCollider";
import Ball from "./Ball";
import * as Constants from "./Constants";
import { useControls } from "leva";
import touchServe from "../../hooks/useClouys";
import Model from "./Model";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
export default function Physics({
  room,
  setRoom,
  structure,
  box,
  joypos,
  setChatMsg,
}) {
  // 物理环境
  // const struct = useGLTF("/structure/paintroom1.glb");//可见模型 structure
  // 如果用同一个模型 则struct的修改会在struct2上生效
  const struct = useGLTF(structure.url); //可见模型 structure
  const struct2 = useGLTF(box.url); //碰撞模型 box
  const size = structure.scale;
  const size_box = box.scale;

  struct.scene.scale.set(size[0], size[1], size[2]);
  struct2.scene.scale.set(size_box[0], size_box[1], size_box[2]);

  const pos = structure.position;
  const rot = structure.rotation;
  const pos_box = box.position;
  const rot_box = box.rotation;
  struct.scene.position.set(pos[0], pos[1], pos[2]);
  struct.scene.rotation.set(rot[0], rot[1], rot[2]);

  struct2.scene.position.set(pos_box[0], pos_box[1], pos_box[2]);
  struct2.scene.rotation.set(rot_box[0], rot_box[1], rot_box[2]);
  // const octree = useOctree(struct2.scene); //观察树
  const octree2 = useOctree(struct2.scene); //碰撞树
  useOctreeHelper(octree2); //碰撞树
  // console.log("scene>", struct.scene.children);
  const colliders = useRef([]);
  const { x, y, z, visible, metalness, roughness } = useControls("Suzanne", {
    y: { value: 0, min: 0, max: Math.PI * 2, step: 0.01 },
    x: { value: 0, min: 0, max: Math.PI * 2, step: 0.01 },
    z: { value: 0, min: 0, max: Math.PI * 2, step: 0.01 },
    visible: true,
    color: { value: "#ffbc85" },
    metalness: { value: 0, min: 0, max: 1.0, step: 0.01 },
    roughness: { value: 0.1, min: 0, max: 1.0, step: 0.01 },
    clearcoat: { value: 0.1, min: 0, max: 1.0, step: 0.01 },
    // clearcoatRoughness: { value: 0, min: 0, max: 1.0, step: 0.01 },
    // transmission: { value: 1.0, min: 0, max: 1.0, step: 0.01 },
    // ior: { value: 1.74, min: 1, max: 5, step: 0.01 },
    // thickness: { value: 3.12, min: 0, max: 5, step: 0.01 },
    // emissiveIntensity: { value: 1, min: 0, max: 1.0, step: 0.01 },
    // aoMapIntensity: { value: 1, min: 0, max: 1.0, step: 0.01 },
  });

  // 建筑动画
  let mixer = new THREE.AnimationMixer(struct.scene);
  struct.animations.forEach((item) => {
    mixer.clipAction(item).play();
  });
  // mixer.clipAction(struct.animations[0]).play();

  // 服务器交互
  let namestr = localStorage.getItem("nickname");
  console.log("game nickname", namestr);
  const [nickname, setNickname] = useState(namestr);
  // const [room, setRoom] = useState(null);
  const [dummy, setDummy] = useState({
    x: 0,
    y: 0,
    z: 0,
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,
    pose: 8,
    active: false,
    nickname: nickname,
  });
  const [customs, setCustoms] = useState([]);

  function sendPositionToServe(bot, pose = 0) {
    const EU = bot.rotation;
    let { x, y, z } = bot.position;
    let rotationX = EU.x;
    let rotationY = EU.y;
    let rotationZ = EU.z;
    setDummy({
      x,
      y,
      z,
      rotationX,
      rotationY,
      rotationZ,
      pose,
      active: true,
    });
  }

  // 碰撞
  function checkSphereCollisions(sphere, velocity) {
    for (let i = 0, length = colliders.current.length; i < length; i++) {
      const c = colliders.current[i];

      if (c.sphere) {
        const d2 = sphere.center.distanceToSquared(c.sphere.center);
        const r = sphere.radius + c.sphere.radius;
        const r2 = r * r;

        if (d2 < r2) {
          const normal = Constants.v1
            .subVectors(sphere.center, c.sphere.center)
            .normalize();
          const impact1 = Constants.v2
            .copy(normal)
            .multiplyScalar(normal.dot(velocity));
          const impact2 = Constants.v3
            .copy(normal)
            .multiplyScalar(normal.dot(c.velocity));
          velocity.add(impact2).sub(impact1);
          c.velocity.add(impact1).sub(impact2);
          const d = (r - Math.sqrt(d2)) / 2;
          sphere.center.addScaledVector(normal, d);
          c.sphere.center.addScaledVector(normal, -d);
        }
      } else if (c.capsule) {
        const center = Constants.v1
          .addVectors(c.capsule.start, c.capsule.end)
          .multiplyScalar(0.5);
        const r = sphere.radius + c.capsule.radius;
        const r2 = r * r;
        for (const point of [c.capsule.start, c.capsule.end, center]) {
          const d2 = point.distanceToSquared(sphere.center);
          if (d2 < r2) {
            const normal = Constants.v1
              .subVectors(point, sphere.center)
              .normalize();
            const impact1 = Constants.v2
              .copy(normal)
              .multiplyScalar(normal.dot(c.velocity));
            const impact2 = Constants.v3
              .copy(normal)
              .multiplyScalar(normal.dot(velocity));
            c.velocity.add(impact2).sub(impact1);
            velocity.add(impact1).sub(impact2);
            const d = (r - Math.sqrt(d2)) / 2;
            sphere.center.addScaledVector(normal, -d);
          }
        }
      }
    }
  }

  // 后期效果
  useEffect(() => {
    struct.scene.traverse((item) => {
      if (item.type === "Mesh") {
        // console.log("Mesh?????", item.material);
        item.material.metalness = metalness;
      }
    });
  }, [metalness]);
  useEffect(() => {
    struct.scene.traverse((item) => {
      if (item.type === "Mesh") {
        item.material.roughness = roughness;
      }
    });
  }, [roughness]);

  // dummy本人状态
  useEffect(() => {
    console.log("time to send ", room, dummy);
    if (room && dummy.active) {
      let { x, y, z, rotationX, rotationY, rotationZ, pose } = dummy;
      room.send("updatePlayer", {
        x,
        y,
        z,
        rotationX,
        rotationY,
        rotationZ,
        pose,
        nickname,
      });
    }
  }, [dummy]);

  // 其他玩家
  useEffect(() => {
    console.log("customs changes", customs);
  }, [customs]);

  // init
  useEffect(() => {
    console.log("game start");
    touchServe({ dummy, setCustoms, setRoom, setChatMsg });
    console.log("game start over ");
  }, []);
  useFrame((state, delta) => {
    mixer.update(delta);
    // console.log(ca);
  });
  return (
    <>
      <primitive
        object={struct.scene}
        rotation={[x, y, z]}
        // rotation={[rot[0], rot[1],rot[2]]} //BUJI
        visible={visible}
      ></primitive>
      {Constants.balls.map(({ position }, i) => (
        <SphereCollider
          key={i}
          id={i}
          radius={Constants.radius}
          octree={octree2} //观察树
          position={position}
          colliders={colliders.current}
          checkSphereCollisions={checkSphereCollisions}
        >
          <Ball radius={Constants.radius} />
        </SphereCollider>
      ))}
      <Player
        nickname={nickname}
        ballCount={Constants.ballCount}
        octree={octree2}
        colliders={colliders.current}
        joypos={joypos}
        moveTo={(bot, pose = 8) => {
          sendPositionToServe(bot, pose);
        }}
        moveStop={(bot, pose = 8) => {
          sendPositionToServe(bot, pose);
        }}
      />

      {customs.map((item) => (
        <mesh
          scale={1}
          key={item[0]}
          position={[item[1].x, item[1].y, item[1].z]}
          rotation={[item[1].rotationX, item[1].rotationY, item[1].rotationZ]}
        >
          {/* <boxGeometry></boxGeometry>
        <meshNormalMaterial /> */}
          <Model
            pose={item[1].pose}
            nickname={item[1].nickname}
            position={[0, -1.26, 0]}
          />
        </mesh>
      ))}
    </>
  );
}
