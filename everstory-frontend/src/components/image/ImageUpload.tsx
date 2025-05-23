import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { postService } from '../../services/post.service';
import { FaImage, FaTimes } from 'react-icons/fa';
import { useAuthStore } from '../../store/auth.store';
import { toast } from 'sonner';

export const ImageUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      setFile(file);
      setPreview(URL.createObjectURL(file));
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select an image');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);

      const response = await postService.uploadImage(file);
      if (response) {
        toast.success('Image uploaded successfully');
        setFile(null);
        setPreview(null);
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Failed to upload image');
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${
            preview ? 'border-primary' : 'border-border'
          }`}
        >
          <input {...getInputProps()} />
          {preview ? (
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="max-h-96 mx-auto rounded-lg"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                  setPreview(null);
                }}
                className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-lg"
              >
                <FaTimes className="text-red-500" />
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <FaImage className="text-4xl mx-auto text-gray-400" />
              <p className="text-gray-500">
                Drag and drop an image here, or click to select
              </p>
              <p className="text-sm text-gray-400">
                Supports: JPG, PNG, GIF
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}

        <button
          type="submit"
          className="btn-primary w-full"
          disabled={!file || isUploading}
        >
          {isUploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  );
};
