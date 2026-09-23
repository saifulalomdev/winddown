import { useState } from 'react';
import { Camera } from '@capacitor/camera';

export default function App() {
  const [photo, setPhoto] = useState<string | null>(null);

  const takePhoto = async () => {
    try {
      // Configured exactly as the official docs recommend
      const result = await Camera.takePhoto({
        quality: 90,
        includeMetadata: true, 
        saveToGallery: true,
        editable: "external",
        presentationStyle: "popover",
      });

      // result.webPath can be set directly as the src of an image element
      if (result.webPath) {
        setPhoto(result.webPath);
      }

      // Optional: Access metadata if needed
      if (result.metadata) {
        console.log('Format:', result.metadata.format);
        console.log('Resolution:', result.metadata.resolution);
      }
    } catch (e) {
      const error = e as any;
      // Structured error code handling from the docs
      const message = error.code ? `[${error.code}] ${error.message}` : error.message;
      console.error('takePhoto failed:', message);
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Capacitor Camera Demo</h2>

      <button 
        onClick={takePhoto} 
        style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
      >
        Take Photo
      </button>

      {photo && (
        <div style={{ marginTop: '20px' }}>
          <h3>Captured Photo:</h3>
          <img 
            src={photo} 
            alt="Captured" 
            style={{ width: '100%', maxWidth: '300px', borderRadius: '8px' }} 
          />
        </div>
      )}
    </div>
  );
}
