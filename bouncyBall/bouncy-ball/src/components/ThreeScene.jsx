import React, { Component } from "react";
const { THREE } = window;

class ThreeScene extends Component {
  /**
   * INIT
   */
  componentDidMount() {
    this.data = {
      size: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      incrementors: {
        camDelta: 0
      }
    };

    this.objects = {};
    
    const sizes = {
      x: 500,
      y: 200,
      z: 300,
      wallWidth: 5,
      ballR: 20
    };

    // ADD SCENE
    this.scene = new THREE.Scene();

    // ADD CAMERA
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.data.size.width / this.data.size.height,
      0.1,
      1000
    );
    this.camera.position.y = sizes.y / 0.9;

    // ADD RENDERER
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setClearColor("#222222");
    this.renderer.setSize(this.data.size.width, this.data.size.height);
    this.mount.appendChild(this.renderer.domElement);

    // ADD LIGHTS
    (() => {
      this.hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
      this.hemiLight.position.set(0, 500, 0);
      this.scene.add(this.hemiLight);

      this.dirLight = new THREE.DirectionalLight(0xffffff, 1);
      this.dirLight.position.set(-1, 0.75, 1);
      this.dirLight.position.multiplyScalar(50);
      this.dirLight.name = "dirlight";

      this.scene.add(this.dirLight);

      this.dirLight.castShadow = true;
      this.dirLight.shadow.mapSize.width = this.dirLight.shadow.mapSize.height = 1024 * 2;

      var d = 300;

      this.dirLight.shadow.camera.left = -d;
      this.dirLight.shadow.camera.right = d;
      this.dirLight.shadow.camera.top = d;
      this.dirLight.shadow.camera.bottom = -d;

      this.dirLight.shadow.camera.far = 3500;
      this.dirLight.shadow.bias = -0.0001;
    })();

    // ADD CUBES
    (() => {
      const material = new THREE.MeshLambertMaterial({
        color: "#aec6cf",
        transparent: true,
        opacity: 0.5,
      });

      this.objects.walls = {};
      // BOTTOM
      (() => {
        const geometry = new THREE.BoxGeometry(sizes.x, sizes.wallWidth, sizes.z);
        this.objects.walls.bottom = new THREE.Mesh(geometry, material);
        this.scene.add(this.objects.walls.bottom);
      })();

      // TOP
      (() => {
        const geometry = new THREE.BoxGeometry(sizes.x - (2*sizes.wallWidth), sizes.wallWidth, sizes.z);
        this.objects.walls.top = new THREE.Mesh(geometry, material);
        this.objects.walls.top.position.set(
          0,
          sizes.y - sizes.wallWidth,
          0
        );
        this.scene.add(this.objects.walls.top);
      })();

      // SIDE1
      (() => {
        const geometry = new THREE.BoxGeometry(sizes.x, sizes.y, sizes.wallWidth);
        this.objects.walls.side1 = new THREE.Mesh(geometry, material);
        this.objects.walls.side1.position.set(
          0, 
          sizes.y * 0.5 - (sizes.wallWidth/2), 
          sizes.z * 0.5 + (sizes.wallWidth/2)
        );
        this.scene.add(this.objects.walls.side1);
      })();

      // SIDE2
      (() => {
        const geometry = new THREE.BoxGeometry(sizes.x, sizes.y, sizes.wallWidth);
        this.objects.walls.side2 = new THREE.Mesh(geometry, material);
        this.objects.walls.side2.position.set(
          0, 
          sizes.y * 0.5 - (sizes.wallWidth/2), 
          sizes.z * -0.5 - (sizes.wallWidth/2)
        );
        this.scene.add(this.objects.walls.side2);
      })();

      // SIDE3
      (() => {
        const geometry = new THREE.BoxGeometry(sizes.wallWidth, sizes.y - sizes.wallWidth, sizes.z);
        this.objects.walls.side3 = new THREE.Mesh(geometry, material);
        this.objects.walls.side3.position.set(
          sizes.x * 0.5 - (sizes.wallWidth/2), 
          sizes.y * 0.5, 
          0
        );
        this.scene.add(this.objects.walls.side3);
      })();

      // SIDE4
      (() => {
        const geometry = new THREE.BoxGeometry(sizes.wallWidth, sizes.y - sizes.wallWidth, sizes.z);
        this.objects.walls.side4 = new THREE.Mesh(geometry, material);
        this.objects.walls.side4.position.set(
          sizes.x * -0.5 + (sizes.wallWidth/2), 
          sizes.y * 0.5, 
          0
        );
        this.scene.add(this.objects.walls.side4);
      })();

    })();

    // ADD BALL
    (() => {
      const geometry = new THREE.SphereGeometry(sizes.ballR, 100, 100);
      const material = new THREE.MeshLambertMaterial({color: "#b22222"});
      this.objects.ball = new THREE.Mesh(geometry, material);
      this.objects.ball.position.set(0, sizes.y / 2, 0);
      this.objects.ball.deltaX = 3;
      this.objects.ball.deltaY = 3;
      this.objects.ball.deltaZ = 3;
      this.scene.add(this.objects.ball);
    })();

    this.data.box = {
      sizes: sizes
    };

    // START
    this.start();
  }

  /**
   *
   */
  componentWillUnmount() {
    this.stop();
    this.mount.removeChild(this.renderer.domElement);
  }

  /**
   * Start Animation
   */
  start = () => {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate);
    }
  };

  /**
   * Stop Animation
   */
  stop = () => {
    cancelAnimationFrame(this.frameId);
  };

  /**
   * Animation loop
   */
  animate = () => {
    const { objects } = this;
    const { sizes: boxSizes } = this.data.box;

    if (
      (objects.ball.position.x + boxSizes.ballR) >= (boxSizes.x / 2) - boxSizes.wallWidth
      || (objects.ball.position.x - boxSizes.ballR) <= -(boxSizes.x / 2) + boxSizes.wallWidth
      ) {
        objects.ball.deltaX *= -1;
    }
    if (
      (objects.ball.position.y + boxSizes.ballR) >= boxSizes.y - boxSizes.wallWidth
      || (objects.ball.position.y - boxSizes.ballR) <= 0
      ) {
        objects.ball.deltaY *= -1;
    }
    if (
      (objects.ball.position.z + boxSizes.ballR) >= (boxSizes.z / 2) - boxSizes.wallWidth
      || (objects.ball.position.z - boxSizes.ballR) <= -(boxSizes.z / 2) + boxSizes.wallWidth
      ) {
        objects.ball.deltaZ *= -1;
    }

    // MOVE BALL
    objects.ball.position.x += objects.ball.deltaX;
    objects.ball.position.y += objects.ball.deltaY;
    objects.ball.position.z += objects.ball.deltaZ;
    
    if (Math.abs(objects.ball.deltaX) < 15) {
      objects.ball.deltaX *= 1.001;
      objects.ball.deltaY *= 1.001;
      objects.ball.deltaZ *= 1.001;
    }

    this.animateCameraMovement();

    this.renderScene();
    this.frameId = window.requestAnimationFrame(this.animate);
  };

  /**
   * Rotate Camera around (0, 0, 0)
   */
  animateCameraMovement = () => {
    let { incrementors } = this.data;

    incrementors.camDelta += 0.005;

    this.camera.lookAt(0, 0, 0);
    this.camera.position.x = Math.sin(incrementors.camDelta) * 500;
    this.camera.position.z = Math.cos(incrementors.camDelta) * 500;
    this.camera.position.y = Math.cos(incrementors.camDelta) * 100 + 200;
  }

  /**
   *
   */
  renderScene = () => {
    this.renderer.render(this.scene, this.camera);
  };

  /**
   * Render Canvas
   */
  render() {
    return (
      <div
        style={{ width: "100vw", height: "100vh" }}
        ref={mount => {
          this.mount = mount;
        }}
      />
    );
  }
}

export default ThreeScene;
