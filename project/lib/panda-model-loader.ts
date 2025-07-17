import * as THREE from 'three';

export async function loadPandaModel(url: string): Promise<THREE.Group> {
  return new Promise((resolve, reject) => {
    const loadModel = async () => {
      const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader');
      const loader = new GLTFLoader();

      loader.load(
        url,
        (gltf) => {
          const model = gltf.scene;
          model.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              mesh.castShadow = true;
              mesh.receiveShadow = true;

              // Optional: Add plushy effect by tweaking material
              if (Array.isArray(mesh.material)) {
                mesh.material.forEach((m) => {
                  m.flatShading = false;
                  m.needsUpdate = true;
                });
              } else {
                mesh.material.flatShading = false;
                mesh.material.needsUpdate = true;
              }
            }
          });

          resolve(model);
        },
        undefined,
        (error) => {
          reject(error);
        }
      );
    };
    
    loadModel().catch(reject);
  });
}
