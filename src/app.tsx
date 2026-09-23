import { useEffect, useState } from "react";
import { Camera } from "@capacitor/camera";
import { Capacitor } from "@capacitor/core";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Preferences } from "@capacitor/preferences";

type Photo = {
  id: string;
  fileName: string;
  webPath: string;
};

const STORAGE_KEY = "gallery-photos";

export default function App() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    loadPhotos();
  }, []);

  // Load saved photos when the app starts
  const loadPhotos = async () => {
    try {
      const { value } = await Preferences.get({
        key: STORAGE_KEY,
      });

      if (!value) return;

      const savedPhotos: Omit<Photo, "webPath">[] = JSON.parse(value);

      const loadedPhotos = await Promise.all(
        savedPhotos.map(async (photo) => {
          const uri = await Filesystem.getUri({
            directory: Directory.Data,
            path: photo.fileName,
          });

          return {
            ...photo,
            webPath: Capacitor.convertFileSrc(uri.uri),
          };
        })
      );

      setPhotos(loadedPhotos);
    } catch (error) {
      console.error("Failed to load photos:", error);
    }
  };

  const persistPhotos = async (photos: Photo[]) => {
    await Preferences.set({
      key: STORAGE_KEY,
      value: JSON.stringify(
        photos.map(({ id, fileName }) => ({
          id,
          fileName,
        }))
      ),
    });
  };

  const takePhoto = async () => {
    try {
      const result = await Camera.takePhoto({
        quality: 90,
        includeMetadata: true,
        editable: "in-app",
        presentationStyle: "popover",
      });

      if (!result.webPath) {
        console.error("No webPath returned from camera");
        return;
      }

      // Get the image from webPath
      const response = await fetch(result.webPath);
      const blob = await response.blob();

      // Convert Blob to base64
      const base64 = await blobToBase64(blob);

      const fileName = `photo-${crypto.randomUUID()}.jpg`;

      // Save the actual image permanently
      await Filesystem.writeFile({
        directory: Directory.Data,
        path: fileName,
        data: base64,
      });

      // Get a displayable URI
      const uri = await Filesystem.getUri({
        directory: Directory.Data,
        path: fileName,
      });

      const newPhoto: Photo = {
        id: crypto.randomUUID(),
        fileName,
        webPath: Capacitor.convertFileSrc(uri.uri),
      };

      const updatedPhotos = [newPhoto, ...photos];

      setPhotos(updatedPhotos);

      await persistPhotos(updatedPhotos);
    } catch (error) {
      console.error("Failed to capture photo:", error);
    }
  };

  const deletePhoto = async (photo: Photo) => {
    try {
      // Delete actual image
      await Filesystem.deleteFile({
        directory: Directory.Data,
        path: photo.fileName,
      });

      const updatedPhotos = photos.filter(
        (item) => item.id !== photo.id
      );

      setPhotos(updatedPhotos);

      await persistPhotos(updatedPhotos);

      if (selectedPhoto?.id === photo.id) {
        setSelectedPhoto(null);
      }
    } catch (error) {
      console.error("Failed to delete photo:", error);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 20,
        background: "#f5f5f5",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 800,
          margin: "0 auto",
        }}
      >
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <div>
            <h2 style={{ margin: 0 }}>Photo Gallery</h2>

            <p style={{ color: "#666" }}>
              {photos.length} photo
              {photos.length !== 1 ? "s" : ""}
            </p>
          </div>

          <button
            onClick={takePhoto}
            style={{
              padding: "12px 18px",
              border: 0,
              borderRadius: 8,
              background: "#111",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            📷 Capture
          </button>
        </header>

        {photos.length === 0 ? (
          <div
            style={{
              padding: 60,
              textAlign: "center",
              background: "#fff",
              borderRadius: 12,
            }}
          >
            <div style={{ fontSize: 40 }}>📷</div>

            <h3>No photos</h3>

            <p>Capture your first photo.</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(150px, 1fr))",
              gap: 12,
            }}
          >
            {photos.map((photo) => (
              <div
                key={photo.id}
                style={{
                  position: "relative",
                  aspectRatio: "1",
                  overflow: "hidden",
                  borderRadius: 10,
                  background: "#ddd",
                }}
              >
                <img
                  src={photo.webPath}
                  alt="Captured"
                  onClick={() => setSelectedPhoto(photo)}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    cursor: "pointer",
                  }}
                />

                <button
                  onClick={() => deletePhoto(photo)}
                  style={{
                    position: "absolute",
                    right: 8,
                    bottom: 8,
                    width: 36,
                    height: 36,
                    border: 0,
                    borderRadius: "50%",
                    background: "rgba(0,0,0,.7)",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(0,0,0,.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <button
            onClick={() => setSelectedPhoto(null)}
            style={{
              position: "fixed",
              top: 20,
              right: 20,
              width: 40,
              height: 40,
              border: 0,
              borderRadius: "50%",
              background: "#fff",
              fontSize: 20,
              cursor: "pointer",
            }}
          >
            ×
          </button>

          <img
            src={selectedPhoto.webPath}
            alt="Full size"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "100%",
              maxHeight: "90vh",
              objectFit: "contain",
            }}
          />
        </div>
      )}
    </div>
  );
}

async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      const result = reader.result as string;

      // Remove "data:image/jpeg;base64,"
      const base64 = result.split(",")[1];

      resolve(base64);
    };

    reader.onerror = reject;

    reader.readAsDataURL(blob);
  });
}