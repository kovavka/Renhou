import * as THREE from 'three'

export function initGL(): void {
    const width = window.innerWidth
    const height = window.innerHeight
    const camera = new THREE.PerspectiveCamera( 70,  width / height, 0.01, 10 );
    camera.position.z = 1;

    const scene = new THREE.Scene();



    const geometry = new THREE.BoxGeometry( width, height, 0.2 );
    const material = new THREE.MeshBasicMaterial();
    material.color.set("#444")

    // const mesh = new THREE.Mesh( geometry, material );
    // mesh.position.z = -1
    // scene.add( mesh );

    addCube(scene)

    // const light = new THREE.AmbientLight( 0x404040 ); // soft white light
    // light.position.x = 0.2
    // scene.add( light );

    const renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( width, height);


    renderer.render( scene, camera );

    document.body.appendChild( renderer.domElement );
}

function addCube(scene) {
    const geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
    const material = new THREE.MeshDistanceMaterial();
    // material.color.set("#444")
    // material.

    const mesh = new THREE.Mesh( geometry, material );

    mesh.position.z = 0.2


    mesh.rotation.x = 40;
    mesh.rotation.y = 0;

    scene.add( mesh );
}
