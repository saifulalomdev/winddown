import { useState, useEffect } from 'react';
import { Controller, type UseFormReturn } from 'react-hook-form';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { useUploadFiles } from '@better-upload/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import { CameraIcon, Building2, Loader2, X } from 'lucide-react';
import { Storage } from '@/utils/storage-helper';
import type { CreateOrganizationInput } from '../org-schema';

interface CreateOrgFormProps {
  form: UseFormReturn<CreateOrganizationInput>;
  onSubmit: (data: CreateOrganizationInput) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  submitLabel?: string;
}

export function CreateOrgForm({
  form,
  onSubmit,
  onCancel,
  isLoading,
  submitLabel = 'Create Agency',
}: CreateOrgFormProps) {
  const [logoPreview, setLogoPreview] = useState<string | undefined>(
    form.getValues('logo')
  );
  const [isUploading, setIsUploading] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);

  // Load token on mount
  useEffect(() => {
    async function loadToken() {
      try {
        const token = await Storage.get<string>('session_token', { secure: true });
        if (token) setAuthToken(token);
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    }
    loadToken();
  }, []);

  // Configure upload client hook
  const { control } = useUploadFiles({
    api: `${import.meta.env.VITE_API_BASE_URL || ''}/api/upload`,
    route: 'images',
    // Always pass active header object dynamically
    headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
    onUploadComplete: ({ files }) => {
      if (files && files.length > 0) {
        const file = files[0];
        const cdnUrl = `https://cdn.ezorder.saifulalom.com/${file.objectInfo.key}`;

        setLogoPreview(cdnUrl);
        form.setValue('logo', cdnUrl, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
      setIsUploading(false);
    },
    // Reset state on error so the spinner doesn't run forever
    onError: (error) => {
      console.error('Upload failed:', error);
      setIsUploading(false);
    },
  });

  const handlePickPhoto = async () => {
    try {
      // 1. Lower quality setting (e.g. 60-70) for smaller file size
      const image = await Camera.getPhoto({
        quality: 70,
        width: 600, // Limit resolution for avatars/logos
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos,
      });

      if (!image.webPath) return;

      // Show local preview immediately
      setLogoPreview(image.webPath);
      setIsUploading(true);

      // Ensure token exists before triggering upload
      let currentToken = authToken;
      if (!currentToken) {
        currentToken = await Storage.get<string>('session_token', { secure: true });
        if (currentToken) setAuthToken(currentToken);
      }

      // Convert webPath to File
      const response = await fetch(image.webPath);
      const blob = await response.blob();
      const format = image.format || 'jpeg';
      const file = new File([blob], `logo-${Date.now()}.${format}`, {
        type: `image/${format}`,
      });

      // Execute upload
      await control.upload([file]);
    } catch (error) {
      console.error('Photo picker or upload error:', error);
      setIsUploading(false);
    }
  };

  const handleNameChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (val: string) => void
  ) => {
    const value = e.target.value;
    onChange(value);

    const autoSlug = value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');

    form.setValue('slug', autoSlug, { shouldValidate: true });
  };

  const handleRemoveLogo = () => {
    setLogoPreview(undefined);
    form.setValue('logo', '', { shouldValidate: true, shouldDirty: true });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4 rounded-lg">
        {/* Avatar Container */}
        <div className="relative size-32 mx-auto">
          <div className="size-full border rounded-full overflow-hidden bg-muted flex items-center justify-center relative">
            {logoPreview ? (
              <img
                src={logoPreview}
                alt="Logo preview"
                className="size-full object-cover"
              />
            ) : (
              <Building2 className="size-12 text-muted-foreground" />
            )}

            {isUploading && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Loader2 className="size-6 text-white animate-spin" />
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handlePickPhoto}
            disabled={isLoading || isUploading}
            className="absolute bottom-0 right-0 p-2 rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90 transition-colors disabled:opacity-50"
            aria-label="Upload photo"
          >
            <CameraIcon className="size-4" />
          </button>

          {logoPreview && !isUploading && (
            <button
              type="button"
              onClick={handleRemoveLogo}
              className="absolute top-0 right-0 p-1 rounded-full bg-destructive text-destructive-foreground shadow-md hover:bg-destructive/90 transition-colors"
              aria-label="Remove photo"
            >
              <X className="size-3" />
            </button>
          )}
        </div>

        {/* Agency / Route Name */}
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="org-name">Agency or Route Name *</FieldLabel>
              <Input
                {...field}
                value={field.value ?? ''}
                onChange={(e) => handleNameChange(e, field.onChange)}
                aria-invalid={fieldState.invalid}
                id="org-name"
                disabled={isLoading}
                placeholder="e.g., Sylhet Sadar Route"
              />
              <FieldDescription>
                This represents your primary distribution unit or area.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Slug */}
        <Controller
          name="slug"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="org-slug">Unique Handle (Slug) *</FieldLabel>
              <Input
                {...field}
                value={field.value ?? ''}
                id="org-slug"
                aria-invalid={fieldState.invalid}
                disabled={isLoading}
                placeholder="sylhet-sadar-route"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            disabled={isLoading || isUploading}
            onClick={onCancel}
            className="w-full"
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={isLoading || isUploading}
          className={onCancel ? 'w-full' : 'w-full col-span-2'}
        >
          <Building2 className="size-4 mr-2" />
          {isLoading ? 'Creating...' : submitLabel}
        </Button>
      </div>
    </form>
  );
}