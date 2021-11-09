import * as THREE from "three";
import bgImg from "./bg.jpg";

const RADIUS = 1000;
const MOVE_RATIO = 0.1;
export class PanoramaScene {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;

  private lon = 0;
  private lat = 0;

  private marks:{text: string, position: THREE.Vector3}[] = [];

  constructor(container: HTMLElement) {
    this.renderer = new THREE.WebGLRenderer();
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    /** scene */
    const scene = this.scene;
    scene.background = new THREE.Color(0xf0f0f0);
    const renderer = this.renderer;
    renderer.setSize(container.clientWidth, container.clientHeight);

    /** camera */
    const camera = this.camera;

    // 开发用，之后删掉
    // camera.position.set(0, 0, 2);

    camera.lookAt(new THREE.Vector3(0, 0, 0));

    const texture = new THREE.TextureLoader().load(bgImg);
    const sphereGeometry = new THREE.SphereGeometry(RADIUS, 50, 50);
    sphereGeometry.scale(-1, 1, 1);
    const sphereMaterial = new THREE.MeshBasicMaterial({ map: texture });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);

    /** run! */
    container.appendChild(renderer.domElement);
    this.animate();
  }

  teardown() {
    console.log("TODO: implement");
  }

  move(offsetX: number, offsetY: number) {
    const lon = offsetX * MOVE_RATIO + this.lon;
    const lat = Math.max(-85, Math.min(85, offsetY * MOVE_RATIO + this.lat));

    const [phi, theta] = getAngle(lon, lat);
    const newLookat = sphericalToCartesian(phi, theta);

    this.camera.lookAt(newLookat);

    this.lat = lat;
    this.lon = lon;
  }

  // TODO: make to module private
  getPoint(clientX: number, clientY: number) {
    const lon = clientX * MOVE_RATIO + this.lon;
    const lat =
      0 - Math.max(-85, Math.min(85, clientY * MOVE_RATIO + this.lat));

    return [lon, lat];
  }

  createSprite(clientX: number, clientY: number, mark: string) {
    const [phi, theta] = this.getPoint(clientX, clientY);
    const position = sphericalToCartesian(phi, theta, 500);

    this.marks.push({
      position,
      text: mark
    })
  }

  private animate() {
    this.marks.forEach(mark=>{
      // TODO: render marks

    })

    requestAnimationFrame(this.animate?.bind(this));
    this.renderer.render(this.scene, this.camera);
  }
}

/** 经纬度坐标系换算成球坐标系角度 */
function getAngle(lon: number, lat: number) {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lon);

  return [phi, theta];
}

/** 球坐标到直角坐标系 */
function sphericalToCartesian(phi: number, theta: number, radius = RADIUS) {
  return new THREE.Vector3(
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}
