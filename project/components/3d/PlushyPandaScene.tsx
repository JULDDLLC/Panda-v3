'use client';

import * as THREE from 'three';
import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PlushyPandaSceneProps {
  glbUrl: string;
}

export default function PlushyPandaScene({ glbUrl }: PlushyPandaSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!glbUrl || !mountRef.current) return;

    let cleanup: (() => void) | null = null;
    setIsLoading(true);
    setError(null);

    const setupScene = async () => {
      try {
        const width = mountRef.current!.clientWidth;
        const height = mountRef.current!.clientHeight;

        // Scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0c1445); // Match the deep blue background

        // Camera
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        camera.position.set(0, 1.2, 3);

        // Renderer
        const renderer = new THREE.WebGLRenderer({ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        mountRef.current!.appendChild(renderer.domElement);

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        
        // Add some colored lights for a magical effect
        const orangeLight = new THREE.PointLight(0xff6b35, 0.5, 10);
        orangeLight.position.set(-3, 2, 2);
        
        const purpleLight = new THREE.PointLight(0x8b5cf6, 0.5, 10);
        purpleLight.position.set(3, 2, -2);

        scene.add(ambientLight, directionalLight, orangeLight, purpleLight);

        // Controls
        const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js');
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.1;
        controls.target.set(0, 0.5, 0);
        controls.enableZoom = true;
        controls.enablePan = false;
        controls.maxPolarAngle = Math.PI / 1.5;
        controls.minDistance = 2;
        controls.maxDistance = 8;
        controls.update();

        // Load model with error handling
        const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
        const loader = new GLTFLoader();
        
        // Add loading manager for better error handling
        const loadingManager = new THREE.LoadingManager();
        loadingManager.onError = (url) => {
          console.error('Error loading resource:', url);
          setError(`Failed to load 3D model from: ${url}`);
          setIsLoading(false);
        };

        loader.manager = loadingManager;

        loader.load(
          glbUrl,
          (gltf) => {
            try {
              const model = gltf.scene;
              
              // Apply plushy material effects
              model.traverse((child) => {
                if ((child as THREE.Mesh).isMesh) {
                  const mesh = child as THREE.Mesh;
                  mesh.castShadow = true;
                  mesh.receiveShadow = true;

                  // Create enhanced plushy material
                  if (mesh.material) {
                    const plushyMaterial = new THREE.MeshStandardMaterial({
                      color: 0xffffff,
                      roughness: 0.9,
                      metalness: 0.0,
                      envMapIntensity: 0.5,
                    });
                    
                    // If the original material has a map, use it
                    if ((mesh.material as THREE.MeshStandardMaterial).map) {
                      plushyMaterial.map = (mesh.material as THREE.MeshStandardMaterial).map;
                    }
                    
                    mesh.material = plushyMaterial;
                  }
                }
              });

              // Scale and position the model
              model.scale.set(1.5, 1.5, 1.5);
              model.position.y = -0.5;
              scene.add(model);

              // Add a simple ground plane for shadows
              const groundGeometry = new THREE.PlaneGeometry(10, 10);
              const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.3 });
              const ground = new THREE.Mesh(groundGeometry, groundMaterial);
              ground.rotation.x = -Math.PI / 2;
              ground.position.y = -1;
              ground.receiveShadow = true;
              scene.add(ground);

              // Animation loop
              let animationId: number;
              const animate = () => {
                animationId = requestAnimationFrame(animate);
                
                // Gentle rotation
                model.rotation.y += 0.005;
                
                // Gentle floating animation
                model.position.y = -0.5 + Math.sin(Date.now() * 0.001) * 0.1;
                
                controls.update();
                renderer.render(scene, camera);
              };
              animate();

              setIsLoading(false);
              console.log('✅ 3D Panda model loaded successfully');

              // Cleanup function
              cleanup = () => {
                if (animationId) {
                  cancelAnimationFrame(animationId);
                }
                controls.dispose();
                renderer.dispose();
                scene.clear();
                if (mountRef.current && renderer.domElement.parentElement === mountRef.current) {
                  mountRef.current.removeChild(renderer.domElement);
                }
              };

            } catch (modelError) {
              console.error('Error processing 3D model:', modelError);
              setError('Error processing 3D model');
              setIsLoading(false);
            }
          },
          (progress) => {
            const percent = (progress.loaded / progress.total * 100);
            console.log('Loading progress:', percent + '%');
          },
          (error) => {
            console.error('❌ Failed to load panda model:', error);
            setError(`Failed to load 3D model: ${error instanceof Error ? error.message : 'Unknown error'}`);
            setIsLoading(false);
          }
        );

        // Handle resize
        const handleResize = () => {
          if (!mountRef.current) return;
          const newWidth = mountRef.current.clientWidth;
          const newHeight = mountRef.current.clientHeight;
          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, newHeight);
        };

        window.addEventListener('resize', handleResize);

        // Add resize cleanup to main cleanup
        const originalCleanup = cleanup;
        cleanup = () => {
          window.removeEventListener('resize', handleResize);
          if (originalCleanup) originalCleanup();
        };

      } catch (setupError) {
        console.error('❌ Error setting up 3D scene:', setupError);
        setError(`Scene setup error: ${setupError instanceof Error ? setupError.message : 'Unknown error'}`);
        setIsLoading(false);
      }
    };

    setupScene();

    return () => {
      if (cleanup) cleanup();
    };
  }, [glbUrl]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-xl">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/80 text-sm">Loading 3D Panda...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-900/20 to-orange-900/20 rounded-xl">
        <div className="text-center p-6">
          <AlertTriangle className="w-12 h-12 text-orange-400 mx-auto mb-4" />
          <p className="text-orange-400 mb-4 text-sm">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline" 
            className="text-white border-white/20 hover:bg-white/10"
            size="sm"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return <div ref={mountRef} className="w-full h-full rounded-xl overflow-hidden" />;
}