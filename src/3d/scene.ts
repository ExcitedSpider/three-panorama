import * as THREE from "three";

export class PanoramaScene {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;

  private lookat: THREE.Vector3;

  constructor(container: HTMLElement) {
    this.renderer = new THREE.WebGLRenderer();
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.lookat = new THREE.Vector3(0, 0, 0);

    /** scene */
    const scene = this.scene;
    const renderer = this.renderer;
    renderer.setSize(container.clientWidth, container.clientHeight);

    /** camera */
    const camera = this.camera;

    // 开发用，之后删掉
    camera.position.set(0, 0, 5);
    camera.lookAt(this.lookat)

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    // cube.position.set(0, 0, 5)
    scene.add(cube);

    /** run! */
    container.appendChild(renderer.domElement);

    this.animate();
  }

  
  teardown() {
    console.log("TODO: implement");
  }
  
  move(x: number, y: number){
    this.lookat = new THREE.Vector3(this.lookat.x + x, this.lookat.y + y, 0)

    this.camera.lookAt(this.lookat)
  };

  private animate() {
    requestAnimationFrame(this.animate?.bind(this));
    this.renderer.render(this.scene, this.camera);
  }

}
