import { useEffect, useState } from 'react';
import * as THREE from 'three';
import { loadPandaModel } from './panda-model-loader';

export function usePlushyPanda(glbUrl: string | null) {
  const [model, setModel] = useState<THREE.Group | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!glbUrl) {
      setError('GLB URL is null');
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const fetchModel = async () => {
      try {
        const panda = await loadPandaModel(glbUrl);
        if (isMounted) {
          setModel(panda);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Failed to load panda model');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchModel();

    return () => {
      isMounted = false;
    };
  }, [glbUrl]);

  return { model, error, isLoading };
}
