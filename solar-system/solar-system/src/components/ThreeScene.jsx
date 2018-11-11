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

    // ADD SCENE
    this.scene = new THREE.Scene();

    // ADD CAMERA
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.data.size.width / this.data.size.height,
      0.1,
      1500
    );
    this.camera.position.set(600, 400, 0);
    this.camera.lookAt(0, 0, 0);

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
    })();

    // ADD SUN
    (() => {
      const geometry = new THREE.SphereGeometry(50, 32, 32);
      const material = new THREE.MeshPhongMaterial({
        color: 0xddaa00,
        emissive: 0xcd8a00,
      });
      this.objects.sun = new THREE.Mesh(geometry, material);
      this.objects.sun.position.set(0, 0, 0);

      const light = new THREE.PointLight(0xffffff, 1);
      light.position.set(0, 0, 0);
      this.scene.add(light);

      this.scene.add(this.objects.sun);
    })();

    // ADD planets
    this.objects.planets = [];
    (() => {
      this.addPlanet('Mercury', 100, 12, 0x363636, 0.01);
      this.addPlanet('Venus', 150, 16, 0x999999, 0.02);
      this.addPlanet('Earth', 200, 18, 0x3366aa, -0.0125);
      this.addPlanet('Mars', 250, 16, 0xc23222, 0.014);
      this.addPlanet('Jupiter', 350, 32, 0xf25232, -0.0172);
      this.addPlanet('Saturn', 425, 24, 0xa26262, 0.012);
      this.addPlanet('Uranus', 475, 20, 0x4040f0, -0.0075);
      this.addPlanet('Neptune', 515, 18, 0x2020d0, 0.009);
      this.addPlanet('Pluto', 545, 12, 0x6060e0, -0.011);
    })();

    // START
    this.start();
  }

  /**
   * 
   */
  addPlanet = (name = "", radius, size, color = 0x777777, speed) => {
    this.drawCircle(radius);
    const planet = new THREE.Mesh(
      new THREE.SphereGeometry(size, 32, 32),
      new THREE.MeshLambertMaterial({color: color})
    );
    planet.position.set(0, 0, radius);
    planet.RADIUS = radius;
    planet.NAME = name;
    planet.SPEED = speed;
    planet.incrementor = 0;
    this.scene.add(planet);
    this.objects.planets.push(planet);
  }

  /**
   * 
   */
  drawCircle = (r, color = 0xdddddd) => {
    var mesh = new THREE.Mesh(
      new THREE.RingGeometry(r - 1, r, 128), 
      new THREE.MeshBasicMaterial({color: color, side: THREE.DoubleSide})
    );
    mesh.position.set(0, 0, 0);
    mesh.rotation.x = Math.PI / 2;
    this.scene.add(mesh);
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


    objects.planets.forEach(planet => {
      planet.incrementor += planet.SPEED;
      planet.position.x = Math.sin(planet.incrementor) * planet.RADIUS;
      planet.position.z = Math.cos(planet.incrementor) * planet.RADIUS;
    });

    this.animateCameraMovement();

    this.renderScene();
    this.frameId = window.requestAnimationFrame(this.animate);
  };

  /**
   * Rotate Camera around (0, 0, 0)
   */
  animateCameraMovement = () => {
    let { incrementors } = this.data;

    incrementors.camDelta += 0.003;

    this.camera.lookAt(0, 0, 0);
    //this.camera.position.x = Math.sin(incrementors.camDelta) * 500;
    //this.camera.position.z = Math.cos(incrementors.camDelta) * 500;
    this.camera.position.y= Math.sin(incrementors.camDelta) * 150 + 175;
  };

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
