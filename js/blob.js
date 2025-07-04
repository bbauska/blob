/** /js/blob.js */
import * as THREE from 'three';
import { createNoise2D } from "https://esm.sh/simplex-noise";
import { OrbitControls } from '/js/OrbitControls.js';

/** import { OrbitControls } from 'three/addons/controls/OrbitControls.js';  */

let theta,
  phi,
  dx,
  dy,
  dz,
  // Point Star Contraction variables
  timeSinceStartContraction,
  easingContraction,
  positionsContraction,
  // Initial Animation variables
  newYInitial,
  // Expansion Animation variables
  positionsExpansion,
  xExpansion,
  yExpansion,
  zExpansion,
  currentDistanceExpansion,
  distanceRatioExpansion,
  expansionFactor,
  // Contraction Animation variables
  timeSinceStartContr,
  easingContr,
  positionsContr,
  xContr,
  yContr,
  zContr,
  currentDistanceContr,
  originalRadiusContr,
  normalizedXContr,
  normalizedYContr,
  normalizedZContr,
  contractionSpeedContr,
  // Centering Animation variables
  timeSinceStartCenter,
  easingCenter,
  positionsCenter,
  xCenter,
  yCenter,
  zCenter,
  centeringSpeed,
  // Point Contraction variables
  xPointContr,
  yPointContr,
  zPointContr,
  currentDistancePointContr,
  nxPointContr,
  nyPointContr,
  nzPointContr,
  targetXPointContr,
  targetYPointContr,
  targetZPointContr,
  contractionSpeedPointContr;

// Schedule various animations and durations
let animationStartTime3 = Date.now() + 6000; // 6 seconds delay for nucleus animation
let animationEasing1 = 0;
let animationStartTime6 = Date.now() + 15000; // 15 seconds delay for moving-star animation
let movingStarsEasing = 0;
let expansionStartTime = Date.now() + 9000; // 9 seconds delay before expansion starts
const MAX_EXPANSION_DISTANCE = 95; // Maximum distance from center
let contractionStartTime = Date.now() + 20000; // 20 seconds delay before contraction
let contractionDuration = 8000; // Contraction lasts 8 seconds
let centeringStartTime = Date.now() + 25000; // 25 seconds delay before centering
let centeringDuration = 8000; // Centering lasts 8 seconds
let pointStarsContractStartTime = Date.now() + 25000; // Start point-star contraction after 25 seconds
let pointStarsContractDuration = 6000; // Point-star contraction lasts 6 seconds
const TARGET_RADIUS = 95; // Target distance from center for final positioning

class Effect {
  constructor() {
    this.nucleusPosition = null;
    this.originalY = null;
    this.time = null;
    this.positionsStar = null;
    this.velocitiesStar = null;
    this.startPositions = null;
    this.delta = 0;
    this.textures = {};
  }

  // MARK: -init
  async init() {
    this.threeInit();
    this.texturePromise = this.textureLoader();
    this.createElements();
    this.createMovingStars();
    this.createPointElement();
    this.initFullscreenButton();
    this.bannerInit();

    await this.texturePromise;
    this.pointStars.material.map = this.textures.flare1;
    this.pointStars2.material.map = this.textures.flare2;
    this.pointComet1.material.map = this.textures.flare3;
    this.planet1.material.map = this.textures.planet1;
    this.planet2.material.map = this.textures.planet2;
    this.planet3.material.map = this.textures.planet3;
    this.nucleus.material.map = this.textures.star;
    this.sphereBg.material.map = this.textures.sky;
    this.stars.material.map = this.textures.flare2;

    // Uses ResizeObserver to handle responsive resizing
    const container = document.querySelector(".webgl");
    this.resizeObserver = new ResizeObserver(() => this.onResize());
    this.resizeObserver.observe(container);

    // Limit rendering to a certain frame interval
    this.limitFPS(1 / 60);
  }

  initFullscreenButton() {
    const fullscreenBtn = document.getElementById("fullscreenBtn");
    fullscreenBtn.addEventListener("click", () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch((err) => {
          console.log(`Error attempting to enable fullscreen: ${err.message}`);
        });
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    });
  }

  // MARK: -threeInit
  // Sets up the core Three.js components: renderer, scene, camera, lighting, controls
  threeInit() {
    const container = document.querySelector(".webgl");

    this.renderer = new THREE.WebGLRenderer({
      powerPreference: "high-performance",
      alpha: true,
      antialias: true,
      stencil: false,
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.01,
      1000
    );
    this.camera.position.set(0, 0, 150);

    this.clock = new THREE.Clock();

    const directionalLight = new THREE.DirectionalLight("#fff", 3);
    directionalLight.position.set(0, 50, -20);
    this.scene.add(directionalLight);

    let ambientLight = new THREE.AmbientLight("#ffffff", 1);
    ambientLight.position.set(0, -20, -40);
    this.scene.add(ambientLight);
    
    // OrbitControls automatically rotates the camera around the scene
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 5;
   this.controls.maxDistance = 350;
    this.controls.minDistance = 150;
    this.controls.enablePan = false;
  }

  // MARK: -textureLoader
  // Loads all textures asynchronously
  textureLoader() {
    const textureLoader = new THREE.TextureLoader();
     textureLoader.crossOrigin = 'anonymous';
    const textureMap = {
      sky: "https://i.ibb.co/HC0vxMw/sky2.jpg",
      star: "https://i.ibb.co/NpJzwns/star.jpg",
      flare1: "https://i.ibb.co/TRsJ1tm/p1.png",
      flare2: "https://i.ibb.co/YQcTCRG/p2.png",
      flare3: "https://i.ibb.co/v1S8YW7/p7.png",
      planet1: "https://i.ibb.co/s1cZDnM/planet1.webp",
      planet2: "https://i.ibb.co/Lt5Kn7y/planet2.webp",
      planet3: "https://i.ibb.co/T8V57p4/planet3.webp",
    };

    return Promise.all(
      Object.entries(textureMap).map(([key, path]) => {
        return new Promise((resolve, reject) => {
          textureLoader.load(
            path,
            (texture) => {
              texture.colorSpace = THREE.SRGBColorSpace;
              texture.anisotropy = 16;
              this.textures[key] = texture;
              resolve(true);
            },
            undefined,
            (error) => reject(`Error loading texture ${path}: ${error}`)
          );
        });
      })
    );
  }

  // MARK: -createElements
  // Builds the main nucleus and background spheres
  createElements() {
    /* Nucleus  */
    //MARK: ---Nucleus
    // Increasing the second parameter drastically reduces FPS, so use carefully
    let icosahedronGeometry = new THREE.IcosahedronGeometry(20, 28);

    // Convert geometry to store original positions for animating
    this.originalPositions = new Float32Array(
      icosahedronGeometry.attributes.position.array
    );
    let lambertMaterial = new THREE.MeshPhongMaterial({});
    this.nucleus = new THREE.Mesh(icosahedronGeometry, lambertMaterial);
    this.nucleus.position.set(0, 0, 0);
    this.scene.add(this.nucleus);

    // Noise generator initialization
    this.noise = createNoise2D();
    this.blobScale = 2; // Higher values amplify the displacement effect

    /* Sphere Background 1 */
    //MARK: ---sphere Background1
    let geometrySphereBg = new THREE.SphereGeometry(90, 50, 50);
    let materialSphereBg = new THREE.MeshBasicMaterial({
      side: THREE.BackSide,
    });
    this.sphereBg = new THREE.Mesh(geometrySphereBg, materialSphereBg);
    this.sphereBg.position.set(0, 0, 0);
    this.scene.add(this.sphereBg);
  }

  // MARK: -createPointElement
  // Generates various point-based particles (stars, comets, planets)
  createPointElement() {
    const self = this;

    // Distant small white stars
    this.pointStars = createPointParticles({
      size: 0.5,
      total: 200,
      transparent: true,
      max: 130,
      min: 130,
    });
    this.scene.add(this.pointStars);

    // Smaller orange stars in the middle
    this.pointStars2 = createPointParticles({
      size: 3,
      total: 600,
      transparent: true,
      max: 33,
      min: 25,
      pointY: 0,
    });
    this.scene.add(this.pointStars2);

    // Orange comet
    this.pointComet1 = createPointParticles({
      size: 12,
      total: 1,
      transparent: true,
      max: 25,
      min: 25,
    });
    this.scene.add(this.pointComet1);

    // Blue planet
    this.planet1 = createPointParticles({
      size: 9,
      total: 1,
      transparent: false,
      max: 60,
      min: 40,
    });
    // Red planet
    this.planet2 = createPointParticles({
      size: 12,
      total: 1,
      transparent: false,
      max: 60,
      min: 40,
    });
    // Moon-like planet
    this.planet3 = createPointParticles({
      size: 12,
      total: 1,
      transparent: false,
      max: 60,
      min: 40,
    });
    this.scene.add(this.planet1);
    this.scene.add(this.planet2);
    this.scene.add(this.planet3);

    // Helper function for creating point particles
    function createPointParticles({
      texture,
      size,
      total,
      transparent = true,
      max = 150,
      min = 70,
      pointY,
    }) {
      const positions = new Float32Array(total * 3);
      const originalY = new Float32Array(total);
      let point, idx;

      // Generate random positions on a sphere
      for (let i = 0; i < total; i++) {
        point = self.randomPointSphere(THREE.MathUtils.randInt(max, min));
        idx = i * 3;
        positions[idx] = point.x;
        positions[idx + 2] = point.z;
        if (pointY !== undefined) {
          // If an explicit y-value was provided
          positions[idx + 1] = pointY;
          originalY[i] = point.y;
        } else positions[idx + 1] = point.y;
      }

      const pointGeometry = new THREE.BufferGeometry();
      pointGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
      pointGeometry.setAttribute(
        "originalY",
        new THREE.BufferAttribute(originalY, 1)
      );

      let blending = transparent
        ? THREE.AdditiveBlending
        : THREE.NormalBlending;
      const pointMaterial = new THREE.PointsMaterial({
        size: size,
        blending: blending,
        transparent: true,
        depthWrite: false,
      });

      return new THREE.Points(pointGeometry, pointMaterial);
    }
  }

  // MARK: -createMovingStars
  // Builds a set of stars that move from the outer boundary of the scene toward the center
  createMovingStars() {
    const totalStars = 5;
    const positions = new Float32Array(totalStars * 3);
    const velocities = new Float32Array(totalStars);
    const startPositions = new Float32Array(totalStars * 3);
    let point, radius, idx;

    for (let i = 0; i < totalStars; i++) {
      // Creates random points far from the center
      radius = THREE.MathUtils.randFloat(200, 300);
      point = this.randomPointSphere(radius);
      idx = i * 3;

      positions[idx] = point.x;
      positions[idx + 1] = point.y;
      positions[idx + 2] = point.z;

      startPositions[idx] = point.x;
      startPositions[idx + 1] = point.y;
      startPositions[idx + 2] = point.z;

      velocities[i] = THREE.MathUtils.randInt(50, 400);
    }

    const starsGeometry = new THREE.BufferGeometry();
    starsGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    starsGeometry.setAttribute(
      "velocity",
      new THREE.BufferAttribute(velocities, 1)
    );
    starsGeometry.setAttribute(
      "startPosition",
      new THREE.BufferAttribute(startPositions, 3)
    );

    const starsMaterial = new THREE.PointsMaterial({
      size: 14,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.stars = new THREE.Points(starsGeometry, starsMaterial);
    this.stars.name = "moving_stars";
    this.stars.visible = false;
    this.scene.add(this.stars);
  }

  // MARK: -randomPointSphere
  // Generates random coordinates on a sphere using the provided radius
  randomPointSphere(radius) {
    theta = 2 * Math.PI * Math.random();
    phi = Math.acos(2 * Math.random() - 1);
    dx = 0 + radius * Math.sin(phi) * Math.cos(theta);
    dy = 0 + radius * Math.sin(phi) * Math.sin(theta);
    dz = 0 + radius * Math.cos(phi);

    return new THREE.Vector3(dx, dy, dz);
  }

  //MARK: -onResize
  // Keeps camera and renderer in sync with the window size
  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // MARK: -limitFPS
  // Caps the rendering loop to a specified frame interval
  limitFPS(interval) {
    this.rafAnimate = requestAnimationFrame(this.limitFPS.bind(this, interval));
    this.delta += this.clock.getDelta();

    if (this.delta > interval) {
      this.loop();
      this.delta = this.delta % interval;
    }
  }

  //MARK: -updateNucleus
  // Expands and displaces the nucleus based on noise after a delay
  updateNucleus() {
    if (Date.now() < animationStartTime3) return;

    const animationEasing1 = Math.min(
      1,
      (Date.now() - animationStartTime3) / 2000
    );

    for (let i = 0; i < this.nucleusPosition.count; i++) {
      const xNucleus = this.originalPositions[i * 3];
      const yNucleus = this.originalPositions[i * 3 + 1];
      const zNucleus = this.originalPositions[i * 3 + 2];

      // Normalize the position
      const lengthNucleus = Math.sqrt(
        xNucleus * xNucleus + yNucleus * yNucleus + zNucleus * zNucleus
      );
      const nxNucleus = xNucleus / lengthNucleus;
      const nyNucleus = yNucleus / lengthNucleus;
      const nzNucleus = zNucleus / lengthNucleus;

      // Displace vertices using Perlin-like noise
      const distanceNucleus =
        20 +
        this.noise(
          nxNucleus + this.time * 0.0004,
          nyNucleus + this.time * 0.0004
        ) *
          this.blobScale *
          animationEasing1;

      // Apply the updated coordinates
      this.nucleusPosition.array[i * 3] = nxNucleus * distanceNucleus;
      this.nucleusPosition.array[i * 3 + 1] = nyNucleus * distanceNucleus;
      this.nucleusPosition.array[i * 3 + 2] = nzNucleus * distanceNucleus;
    }
    this.nucleusPosition.needsUpdate = true;
    this.nucleus.geometry.computeVertexNormals();
  }

  //MARK: -updateMovingStars
  // Animates stars flying toward the center after a delay
  updateMovingStars() {
    if (Date.now() < animationStartTime6) return;

    const movingStarsEasing = Math.min(
      1,
      (Date.now() - animationStartTime6) / 2000
    );

    for (let i = 0; i < this.positionsStar.count; i++) {
      const idx = i * 2;
      this.updateSingleMovingStar(i, idx, movingStarsEasing);
    }

    this.positionsStar.needsUpdate = true;
    this.velocitiesStar.needsUpdate = true;
  }

  // Fine-tunes individual star movement
  updateSingleMovingStar(i, idx, easing) {
    const moveAmount =
      easing *
      ((0 - this.positionsStar.array[idx]) / this.velocitiesStar.array[i]);

    this.positionsStar.array[idx] += moveAmount;
    this.positionsStar.array[idx + 1] +=
      easing *
      ((0 - this.positionsStar.array[idx + 1]) / this.velocitiesStar.array[i]);
    this.positionsStar.array[idx + 2] +=
      easing *
      ((0 - this.positionsStar.array[idx + 2]) / this.velocitiesStar.array[i]);

    this.velocitiesStar.array[i] -= 0.1 * easing;

    this.resetStarIfAtCenter(i, idx);
  }

  // Resets a star to its start position once it reaches the center
  resetStarIfAtCenter(i, idx) {
    if (
      this.positionsStar.array[idx] <= 2 &&
      this.positionsStar.array[idx] >= -2 &&
      this.positionsStar.array[idx + 2] <= 2 &&
      this.positionsStar.array[idx + 2] >= -2
    ) {
      this.positionsStar.array[idx] = this.startPositions.array[idx];
      this.positionsStar.array[idx + 1] = this.startPositions.array[idx + 1];
      this.positionsStar.array[idx + 2] = this.startPositions.array[idx + 2];
      this.velocitiesStar.array[i] = 120;
    }
  }

  //MARK: -updatePointStars2
  // Manages positioning for a secondary star group, handling multiple animation phases
  updatePointStars2() {
    for (let i = 0; i < this.originalY.count; i++) {
      this.updateSinglePointStar2(i);
    }
    this.pointStars2.geometry.attributes.position.needsUpdate = true;
  }

  // Helper function for updating a single star in the secondary group
  updateSinglePointStar2(i) {
    const positions = this.pointStars2.geometry.attributes.position;
    const currentY = positions.array[i * 3 + 1];
    const targetY = this.originalY.array[i];

    this.handleInitialYAnimation(i, currentY, targetY);
    this.handleExpansionAnimation(i);
    this.handleContractionAnimation(i);
    this.handleCenteringAnimation(i);
  }

  //MARK: -updateRotations
  // Subtle rotation updates for backgrounds, stars, comets, and planets
  updateRotations() {
    // Background spheres
    //this.sphereBg.rotation.x -= 0.006;
    //this.sphereBg.rotation.y += 0.001;

    // Star fields / comets
    this.pointStars.rotation.y -= 0.0007;
    this.pointComet1.rotation.z -= 0.01;
    this.pointComet1.rotation.y += 0.001;
    //this.pointStars2.rotation.z -= 0.01;
    this.pointStars2.rotation.x -= 0.001;

    // Planets
    this.planet1.rotation.y += 0.001;
    this.planet2.rotation.z += 0.003;
    this.planet3.rotation.x += 0.0005;
  }

  //MARK: -loop
  // Core animation loop called at each frame or limited interval
  loop() {
    this.nucleusPosition = this.nucleus.geometry.attributes.position;
    this.originalY = this.pointStars2.geometry.attributes.originalY;
    this.time = Date.now();

    this.updateNucleus();

    this.positionsStar = this.stars.geometry.attributes.position;
    this.velocitiesStar = this.stars.geometry.attributes.velocity;
    this.startPositions = this.stars.geometry.attributes.startPosition;

    this.updateMovingStars();
    this.updatePointStars2();
    this.updateRotations();

    // Start the point-star contraction if it’s time
    if (Date.now() >= pointStarsContractStartTime) {
      this.updatePointStarsContraction();
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  //MARK: -updatePointStarsContraction
  // Pulls distant point stars toward a target radius
  updatePointStarsContraction() {
    timeSinceStartContraction = Date.now() - pointStarsContractStartTime;
    easingContraction = Math.min(
      1,
      timeSinceStartContraction / pointStarsContractDuration
    );
    positionsContraction = this.pointStars.geometry.attributes.position;

    this.pointStars.material.size = 0.4 + 0.7 * easingContraction;

    for (let i = 0; i < positionsContraction.count; i++) {
      this.updateSinglePointStarContraction(
        positionsContraction,
        i,
        easingContraction
      );
    }

    positionsContraction.needsUpdate = true;
  }

  // Phase 1: Move secondary stars along Y-axis after the nucleus movement starts
  handleInitialYAnimation(i, currentY, targetY) {
    if (Date.now() >= animationStartTime3) {
      newYInitial = currentY + (targetY - currentY) * 0.02;
      this.pointStars2.geometry.attributes.position.array[i * 3 + 1] =
        newYInitial;
    }
  }

  // Phase 2: Gradual expansion, pushing stars outward
  handleExpansionAnimation(i) {
    if (Date.now() >= expansionStartTime && Date.now() < contractionStartTime) {
      positionsExpansion = this.pointStars2.geometry.attributes.position;
      xExpansion = positionsExpansion.array[i * 3];
      yExpansion = positionsExpansion.array[i * 3 + 1];
      zExpansion = positionsExpansion.array[i * 3 + 2];

      currentDistanceExpansion = Math.sqrt(
        xExpansion * xExpansion +
          yExpansion * yExpansion +
          zExpansion * zExpansion
      );

      if (currentDistanceExpansion < MAX_EXPANSION_DISTANCE) {
        distanceRatioExpansion =
          currentDistanceExpansion / MAX_EXPANSION_DISTANCE;
        expansionFactor = 1 + 0.008 * (1 - distanceRatioExpansion);

        positionsExpansion.array[i * 3] = xExpansion * expansionFactor;
        positionsExpansion.array[i * 3 + 1] = yExpansion * expansionFactor;
        positionsExpansion.array[i * 3 + 2] = zExpansion * expansionFactor;
      }
    }
  }

  // Phase 3: Contraction, pulling stars closer to a tighter radius
  handleContractionAnimation(i) {
    if (Date.now() >= contractionStartTime) {
      timeSinceStartContr = Date.now() - contractionStartTime;
      easingContr = Math.min(1, timeSinceStartContr / contractionDuration);
      positionsContr = this.pointStars2.geometry.attributes.position;

      xContr = positionsContr.array[i * 3];
      yContr = positionsContr.array[i * 3 + 1];
      zContr = positionsContr.array[i * 3 + 2];

      currentDistanceContr = Math.sqrt(
        xContr * xContr + yContr * yContr + zContr * zContr
      );
      originalRadiusContr = THREE.MathUtils.randFloat(25, 33);

      normalizedXContr = (xContr / currentDistanceContr) * originalRadiusContr;
      normalizedYContr = (yContr / currentDistanceContr) * originalRadiusContr;
      normalizedZContr = (zContr / currentDistanceContr) * originalRadiusContr;

      contractionSpeedContr = 0.02 * easingContr;
      positionsContr.array[i * 3] =
        xContr + (normalizedXContr - xContr) * contractionSpeedContr;
      positionsContr.array[i * 3 + 1] =
        yContr + (normalizedYContr - yContr) * contractionSpeedContr;
      positionsContr.array[i * 3 + 2] =
        zContr + (normalizedZContr - zContr) * contractionSpeedContr;
    }
  }

  // Phase 4: Centering, gathering stars at the scene’s origin
  handleCenteringAnimation(i) {
    if (Date.now() >= centeringStartTime) {
      timeSinceStartCenter = Date.now() - centeringStartTime;
      easingCenter = Math.min(1, timeSinceStartCenter / centeringDuration);
      positionsCenter = this.pointStars2.geometry.attributes.position;

      xCenter = positionsCenter.array[i * 3];
      yCenter = positionsCenter.array[i * 3 + 1];
      zCenter = positionsCenter.array[i * 3 + 2];

      centeringSpeed = 0.02 * easingCenter;
      positionsCenter.array[i * 3] = xCenter + (0 - xCenter) * centeringSpeed;
      positionsCenter.array[i * 3 + 1] =
        yCenter + (0 - yCenter) * centeringSpeed;
      positionsCenter.array[i * 3 + 2] =
        zCenter + (0 - zCenter) * centeringSpeed;

      this.pointStars2.material.opacity = 1 - easingCenter;

      // Hide these stars and reveal the moving stars
      if (easingCenter >= 1) {
        this.pointStars2.visible = false;
        this.stars.visible = true;
      }
    }
  }

  // Moves each star from its current position to the target radius
  updateSinglePointStarContraction(positions, i, easing) {
    xPointContr = positions.array[i * 3];
    yPointContr = positions.array[i * 3 + 1];
    zPointContr = positions.array[i * 3 + 2];

    currentDistancePointContr = Math.sqrt(
      xPointContr * xPointContr +
        yPointContr * yPointContr +
        zPointContr * zPointContr
    );

    nxPointContr = xPointContr / currentDistancePointContr;
    nyPointContr = yPointContr / currentDistancePointContr;
    nzPointContr = zPointContr / currentDistancePointContr;

    targetXPointContr = nxPointContr * TARGET_RADIUS;
    targetYPointContr = nyPointContr * TARGET_RADIUS;
    targetZPointContr = nzPointContr * TARGET_RADIUS;

    contractionSpeedPointContr = 0.02 * easing;
    positions.array[i * 3] =
      xPointContr +
      (targetXPointContr - xPointContr) * contractionSpeedPointContr;
    positions.array[i * 3 + 1] =
      yPointContr +
      (targetYPointContr - yPointContr) * contractionSpeedPointContr;
    positions.array[i * 3 + 2] =
      zPointContr +
      (targetZPointContr - zPointContr) * contractionSpeedPointContr;
  }
  
    bannerInit() {
    const banner = document.querySelector(".banner");
    const controls = this.controls;

    // Function to hide banner
    const hideBanner = () => {
      if (!this.hasInteracted && banner) {
        banner.style.opacity = "0";
        banner.style.transition = "opacity 0.5s ease";
        // Remove banner from DOM after fade out
        setTimeout(() => {
          banner.remove();
        }, 500);
        this.hasInteracted = true;
      }
    };

    // Listen for scroll/zoom
    window.addEventListener("wheel", hideBanner, { once: true });

    // Listen for drag start
    this.renderer.domElement.addEventListener("pointerdown", hideBanner, {
      once: true,
    });
  }
  
}

const effect = new Effect();
effect.init();
