import React, { Component } from "react";
const { THREE } = window;

class ThreeScene extends Component {

  /**
   * 
   */
  constructor(props) {
    super(props);

    this.state = {
      numberOfLines: 0,
      numberOfPoints: 10
    };
  }

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
      },
      animatedObj: null
    };

    this.objects = {};
    this.objects.balls = [];

    // ADD SCENE
    this.scene = new THREE.Scene();

    // ADD CAMERA
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.data.size.width / this.data.size.height,
      0.1,
      1000
    );

    this.camera.position.set(0, 0, 200);

    // ADD RENDERER
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setClearColor("#222222");
    this.renderer.setSize(this.data.size.width, this.data.size.height);
    this.mount.appendChild(this.renderer.domElement);

    // ADD LIGHTS
    (() => {
      this.hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
      this.hemiLight.position.set(0, 0, 0);
      this.scene.add(this.hemiLight);

      let dirLight = new THREE.PointLight(0xffffff, 1);
      dirLight.position.set(0, 0, 0);
      this.scene.add(dirLight);
    })();

    // ADD POINTS
    (n => {
      for (let i = 0; i < n; i++) {
        const x = Math.random() * 300 - 150;
        const y = Math.random() * 300 - 150;
        const z = Math.random() * 300 - 150;

        const randomColor = "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});
        
        const ball = new THREE.Mesh(
          new THREE.SphereGeometry(5, 32, 32),
          new THREE.MeshLambertMaterial({color: randomColor})
        );
        ball.position.set(x, y, z);
        ball.COLOR = randomColor;
        this.scene.add(ball);
        this.objects.balls.push(ball);
      }
    })(this.state.numberOfPoints);

    // DRAW LINES
    (() => {
      let lines = 0;
      this.objects.balls.forEach((ball, i) => {
        const material = new THREE.LineBasicMaterial({
          color: ball.COLOR,
          linewidth: 1,
        });
        const geometry = new THREE.Geometry();
        this.objects.balls.forEach((b, j) => {
          if (i === j) {
            return;
          }
          geometry.vertices.push(
            new THREE.Vector3(
              ball.position.x + (i / 8),
              ball.position.y + (i / 8),
              ball.position.z + (i / 8)
            ),
            new THREE.Vector3(
              b.position.x + (i / 8),
              b.position.y + (i / 8),
              b.position.z + (i / 8)
            )
          );
          const line = new THREE.Line(geometry, material);
          this.scene.add(line);
          lines++;
        });
      });
      this.setState({
        numberOfLines: lines
      });
    })();

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
    this.camera.position.x = Math.sin(incrementors.camDelta) * 100;
    this.camera.position.z = Math.cos(incrementors.camDelta) * 100;
    this.camera.position.y = Math.sin(incrementors.camDelta) * 100;
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
      <>
        <h3 style={{
          position: "absolute",
          left: 0,
          top: 0,
          padding: "0.5rem",
          color: "#eee",
        }}>{ this.state.numberOfPoints } Positions, { this.state.numberOfLines } lines</h3>
        <div
          style={{ width: "100vw", height: "100vh" }}
          ref={mount => {
            this.mount = mount;
          }}
        />
      </>
    );
  }
}

export default ThreeScene;
