import React, { Component } from "react";
import * as THREE from "three";
import { vertex } from "../shaders/Vertex";
import { fragment } from "../shaders/Fragment";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import img2 from "../img/img2.jpg";
import img1 from "../img/img1.jpg";
import img3 from "../img/img3.jpg";
import gsap from "gsap";

class Scene extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textures: [],

      current: 0,
    };
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.animate = this.animate.bind(this);
  }

  componentDidMount() {
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer();

    this.width = this.mount.clientWidth;
    this.height = this.mount.clientHeight;
    this.renderer.setClearColor(0x000000, 1);
    this.renderer.setSize(this.width, this.height);
    this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.textures = [
      new THREE.TextureLoader().load(img1),
      new THREE.TextureLoader().load(img2),
      new THREE.TextureLoader().load(img3),
    ];
    this.container = document.getElementById("scene");

    this.mount.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      75,
      this.width / this.height,
      0.1,
      1000
    );
    this.current = 0;

    this.camera.position.set(0, 0, 4);
    // this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.mouse = new THREE.Vector2();
    this.prevsmouse = new THREE.Vector2();
    this.time = 0;
    this.targetSpeed = 0;
    this.setupResize();
    this.addObjects();
    this.resize();
    this.mouseEvents();
    this.animate();
    this.mouseMoveEvent();
  }

  mouseEvents() {
    /*  document.addEventListener("mousedown", () => {
        console.log("click")
        this.next()
    }) */
    document.addEventListener("click", () => {
      if (this.props.isPushed) {
        console.log(this.props.isPushed)
        this.props.setPushed(false)
        console.log(this.props.isPushed)
        this.material.uniforms.direction.value = 0;
        gsap.to(this.material.uniforms.progress, {
          value: 1,
          duration: 0.5,
        });
      } else {
        console.log(this.props.isPushed)
        this.props.setPushed(true)
        console.log(this.props.isPushed)
        this.material.uniforms.direction.value = 1;
        gsap.to(this.material.uniforms.progress, {
          value: 0,
          duration: 0.5,
        });
        
      }
  
    });

/*     document.addEventListener("mouseup", () => {
      this.props.setPushed(false)
      this.material.uniforms.direction.value = 1;
      gsap.to(this.material.uniforms.progress, {
        value: 0,
        duration: 0.5,
      });
    }); */
  }

  getSpeed() {
    this.speed = Math.sqrt(
      (this.prevsmouse.x - this.mouse.x) ** 2 +
        (this.prevsmouse.y - this.mouse.y) ** 2
    );

    this.targetSpeed += 0.1 * (this.speed - this.targetSpeed);
    this.prevsmouse.x = this.mouse.x;
    this.prevsmouse.y = this.mouse.y;
  }

  next() {
    let len = this.textures.length;
    let nextTexture = this.textures[(this.current + 1) % len];
    console.log(nextTexture);
    console.log("nextTexture");
    this.current++;
    this.material.uniforms.texture.value = nextTexture;
  }

  mouseMoveEvent() {
    document.addEventListener("mousemove", (e) => {
      //console.log(e);
      this.mouse.x = e.clientX / this.width;
      this.mouse.y = 1 - e.clientY / this.height;

      this.material.uniforms.mouse.value = this.mouse;
    });
  }

  addObjects() {
    let that = this;
    this.material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: {
        time: { type: "f", value: 0 },
        progress: { type: "f", value: 0 },
        speed: { type: "f", value: 0 },
        mouse: { type: "v2", value: new THREE.Vector2(0, 0) },
        direction: { type: "f", value: 0 },
        texture: { type: "t", value: this.textures[this.props.activeIndex] },
        resolution: { type: "v4", value: new THREE.Vector4() },
        uvRate1: {
          value: new THREE.Vector2(1, 1),
        },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
    });

    this.geometry = new THREE.PlaneGeometry(1, 1, 100, 100);

    this.plane = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.plane);

    // this.scene.add(this.cube);
  }

  componentWillUnmount() {
    this.stop();
    this.mount.removeChild(this.renderer.domElement);
  }

  setupResize = () => {
    window.addEventListener("resize", this.resize);
  };

  resize = () => {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    console.log("resize");

    this.imageAspect = 853 / 1280;

    let a1;
    let a2;

    if (this.height / this.width > this.imageAspect) {
      a1 = (this.width / this.height) * this.imageAspect;
      a2 = 1;
    } else {
      a1 = 1;
      a2 = this.height / this.width / this.imageAspect;
    }

    this.material.uniforms.resolution.value.x = this.width;
    this.material.uniforms.resolution.value.y = this.height;
    this.material.uniforms.resolution.value.z = a1;
    this.material.uniforms.resolution.value.w = a2;

    const dist = this.camera.position.z;
    const height = 1;
    this.camera.fov = 2 * (180 / Math.PI) * Math.atan(height / (2 * dist));

    if (this.width / this.height > 1) {
      this.plane.scale.x = this.camera.aspect;
    } else {
      this.plane.scale.y = 1 / this.camera.aspect;
    }

    this.camera.updateProjectionMatrix();
    console.log(this.camera);
  };

  start() {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate);
    }
  }

  stop() {
    cancelAnimationFrame(this.frameId);
  }

  animate() {
    //this.cube.rotation.x += 0.01;
    //this.cube.rotation.y += 0.01;

    this.time += 0.05;
    this.getSpeed();
    this.material.uniforms.texture.value = this.textures[this.props.activeIndex];
    this.material.uniforms.time.value = this.time;
    this.material.uniforms.speed.value = this.targetSpeed;
    this.frameId = requestAnimationFrame(this.animate);
    this.renderScene();
  }

  renderScene() {
    this.renderer.render(this.scene, this.camera);
  }

  render() {
    return (
     
        <div
          id="scene"
          ref={(mount) => {
            this.mount = mount;
          }}
        />
 
    );
  }
}

export default Scene;
