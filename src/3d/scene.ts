import * as THREE from "three";
import bgImg from './bg.jpg'

const RADIUS = 1000;
export class PanoramaScene {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;

  private lon = 0;
  private lat = 0;

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
    scene.background = new THREE.Color( 0xf0f0f0 );
    const renderer = this.renderer;
    renderer.setSize(container.clientWidth, container.clientHeight);

    /** camera */
    const camera = this.camera;

    // 开发用，之后删掉
    // camera.position.set(0, 0, 2);


    camera.lookAt(new THREE.Vector3(0, 0, 0))


    const texture = new THREE.TextureLoader().load(bgImg);
    const sphereGeometry = new THREE.SphereGeometry(RADIUS, 50, 50);
    sphereGeometry.scale(-1, 1, 1);
    const sphereMaterial = new THREE.MeshBasicMaterial({map: texture});
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);

    /** run! */
    container.appendChild(renderer.domElement);
    this.animate();
  }

  
  teardown() {
    console.log("TODO: implement");
  }
  
  move(offsetX: number, offsetY: number){
    const lon = offsetX + this.lon;
    const lat = Math.max(-85, Math.min(85, offsetY + this.lat));

    const phi = THREE.MathUtils.degToRad(90 - lat);
    const theta = THREE.MathUtils.degToRad(lon);

    this.camera.lookAt(
      RADIUS * Math.sin(phi) * Math.cos(theta),
      RADIUS * Math.cos(phi),
      RADIUS * Math.sin(phi) * Math.sin(theta),
    )

    this.lat = lat;
    this.lon = lon;
  };

  private animate() {
    requestAnimationFrame(this.animate?.bind(this));
    this.renderer.render(this.scene, this.camera);
  }

}
