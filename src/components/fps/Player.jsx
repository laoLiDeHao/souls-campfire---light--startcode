/*eslint-disable */
import { useRef, useEffect, useMemo, Suspense, useState } from "react";
import { Capsule } from "three/examples/jsm/math/Capsule.js";
import { Vector3 } from "three";
import { useFrame, useThree } from "@react-three/fiber";
import useKeyboard from "./useKeyboard";
import { CameraControls } from "@react-three/drei";
import Model from "./Model";


const GRAVITY = 30;
const STEPS_PER_FRAME = 5;

export default function Player({
  nickname='nickname unset',
  octree,
  colliders,
  ballCount,
  joypos,
  moveTo = (bot) => {
    console.log("moveTo unset", bot);
  },
  moveStop = (bot) => {
    console.log("moveStop unset", bot);
  },
}) {


  const playerOnFloor = useRef(false);
  const playerVelocity = useMemo(() => new Vector3(), []);
  const playerDirection = useMemo(() => new Vector3(), []);
  const body = useRef(null);
  const control = useRef(null);
  const capsule = useMemo(
    () => new Capsule(new Vector3(0, 1, 0), new Vector3(0, 2, 0), 0.25),
    []
  );
  // const { camera } = useThree();

  const [poseCount, setPoseCount] = useState(2);
  // let clicked = 0;

  const onPointerDown = () => {
    // throwBall(camera, capsule, playerDirection, playerVelocity, clicked++)
  };
  useEffect(() => {
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
    };
  });

  useEffect(() => {
    //console.log('adding reference to this capsule collider')
    colliders[ballCount] = { capsule: capsule, velocity: playerVelocity };
  }, [colliders, ballCount, capsule, playerVelocity]);

  const keyboard = useKeyboard();

  function getForwardVector(camera, playerDirection) {
    camera.getWorldDirection(playerDirection);
    playerDirection.y = 0;
    playerDirection.normalize();
    return playerDirection;
  }

  function getSideVector(camera, playerDirection) {
    camera.getWorldDirection(playerDirection);
    playerDirection.y = 0;
    playerDirection.normalize();
    playerDirection.cross(camera.up);
    return playerDirection;
  }

  function controls(
    camera,
    delta,
    playerVelocity,
    playerOnFloor,
    playerDirection
  ) {
    const box = body.current;
    const speedDelta = delta * (playerOnFloor ? 25 : 8);

    // keyboard
    keyboard["KeyA"] &&
      playerVelocity.add(
        getSideVector(camera, playerDirection).multiplyScalar(-speedDelta)
      );
    keyboard["KeyD"] &&
      playerVelocity.add(
        getSideVector(camera, playerDirection).multiplyScalar(speedDelta)
      );
    keyboard["KeyW"] &&
      playerVelocity.add(
        getForwardVector(camera, playerDirection).multiplyScalar(speedDelta)
      );
    keyboard["KeyS"] &&
      playerVelocity.add(
        getForwardVector(camera, playerDirection).multiplyScalar(-speedDelta)
      );
    // console.log("box>>>>>", keyboard);

    if (
      keyboard["KeyW"] ||
      keyboard["KeyS"] ||
      keyboard["KeyA"] ||
      keyboard["KeyD"]
    ) {
      setPoseCount(2);
    }
    if (
      !keyboard["KeyW"] &&
      !keyboard["KeyS"] &&
      !keyboard["KeyA"] &&
      !keyboard["KeyD"]
    ) {
      setPoseCount(8);
    }
    if (keyboard["Space"]) {
      setPoseCount(3);
    }

    if (playerOnFloor) {
      if (keyboard["Space"]) {
        playerVelocity.y = 10;
      }
    }

    // joystack
    if (joypos.active) {
      console.log("joypos", joypos);
      playerVelocity.add(
        getSideVector(camera, playerDirection).multiplyScalar(
          speedDelta * joypos.x
        )
      );
      playerVelocity.add(
        getForwardVector(camera, playerDirection).multiplyScalar(
          speedDelta * joypos.y
        )
      );
      setPoseCount(2);
    } else {
    }
  }

  function updatePlayer(
    camera,
    delta,
    octree,
    capsule,
    playerVelocity,
    playerOnFloor
  ) {
    let damping = Math.exp(-4 * delta) - 1;
    if (!playerOnFloor) {
      playerVelocity.y -= GRAVITY * delta;
      damping *= 0.1; // small air resistance
    }
    playerVelocity.addScaledVector(playerVelocity, damping);
    const deltaPosition = playerVelocity.clone().multiplyScalar(delta);
    capsule.translate(deltaPosition);
    playerOnFloor = playerCollisions(capsule, octree, playerVelocity);
    // camera.position.copy(capsule.end)
    // console.log(body.current);
    return playerOnFloor;
  }

  function throwBall(camera, capsule, playerDirection, playerVelocity, count) {
    const { sphere, velocity } = colliders[count % ballCount];

    camera.getWorldDirection(playerDirection);

    sphere.center
      .copy(capsule.end)
      .addScaledVector(playerDirection, capsule.radius * 1.5);

    velocity.copy(playerDirection).multiplyScalar(50);
    velocity.addScaledVector(playerVelocity, 2);
  }

  function playerCollisions(capsule, octree, playerVelocity) {
    const result = octree.capsuleIntersect(capsule);
    let playerOnFloor = false;
    if (result) {
      playerOnFloor = result.normal.y > 0;
      if (!playerOnFloor) {
        playerVelocity.addScaledVector(
          result.normal,
          -result.normal.dot(playerVelocity)
        );
      }
      capsule.translate(result.normal.multiplyScalar(result.depth));
    }
    return playerOnFloor;
  }

  function teleportPlayerIfOob(camera, capsule, playerVelocity) {
    if (camera.position.y <= -100) {
      playerVelocity.set(0, 0, 0);
      capsule.start.set(0, 0, 0);
      capsule.end.set(0, 1, 0);
      camera.position.copy(capsule.end);
      camera.rotation.set(0, 0, 0);
    }
  }

  function uploadPlayer() {
    let bot = body.current;
    if (!bot || poseCount != 2) return; //2 walk 8 idle 3 jump
    // console.log("botmove",bot);
    moveTo(bot, poseCount);
  }

  // 当检测到战立姿态时发送 moveStop
  useEffect(() => {
    let bot = body.current;
    if (!bot || poseCount !== 8) return;
    console.log("stop move", { bot, poseCount });
    moveStop(bot, poseCount);
  }, [poseCount]);

  useFrame(({ camera }, delta) => {
    controls(
      camera,
      delta,
      playerVelocity,
      playerOnFloor.current,
      playerDirection
    );
    const deltaSteps = Math.min(0.05, delta) / STEPS_PER_FRAME;
    for (let i = 0; i < STEPS_PER_FRAME; i++) {
      playerOnFloor.current = updatePlayer(
        camera,
        deltaSteps,
        octree,
        capsule,
        playerVelocity,
        playerOnFloor.current
      );
    }
    // 更新身体
    body.current.lookAt(capsule.end.x, body.current.position.y, capsule.end.z);
    body.current.position.x = capsule.end.x;
    body.current.position.y = capsule.end.y;
    body.current.position.z = capsule.end.z;

    // console.log("camera.rotation.y", body.current);
    // body.current.rotation.x = camera.rotation.x>0?0:-180
    // body.current.rotation.y = -camera.rotation.y
    // body.current.rotation.z = camera.rotation.z>0?0:-180
    // console.log("body", body.current, camera);
    control.current?.moveTo(capsule.end.x, capsule.end.y, capsule.end.z, true);

    teleportPlayerIfOob(camera, capsule, playerVelocity);

    uploadPlayer();
  });

  return (
    <>
      <mesh ref={body} scale={1}>
        {/* <boxGeometry></boxGeometry>
        <meshNormalMaterial /> */}
        <Suspense fallback={null}>
          <Model pose={poseCount}  nickname={nickname} position={[0, -1.26, 0]} />
        </Suspense>
      </mesh>
      <mesh>
        <CameraControls ref={control} />
      </mesh>
    </>
  );
}
