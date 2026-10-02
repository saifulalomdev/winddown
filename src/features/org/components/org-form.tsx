import { useState } from 'react';
import { Controller, type UseFormReturn } from 'react-hook-form';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import { CameraIcon, ImagePlus, Building2 } from 'lucide-react';
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

  // Auto-generate slug from agency/route name
  const handleNameChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (val: string) => void
  ) => {
    const value = e.target.value;
    onChange(value);

    // Only auto-slug if user hasn't manually altered the slug field significantly
    const autoSlug = value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');

    form.setValue('slug', autoSlug, { shouldValidate: true });
  };

  // Photo pickers using Capacitor Camera
  const handleTakePhoto = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
      });

      if (image.webPath) setLogo(image.webPath);
    } catch (error) {
      console.log('Camera cancelled:', error);
    }
  };

  const handlePickPhoto = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos,
      });

      if (image.webPath) setLogo(image.webPath);
    } catch (error) {
      console.log('Photo picker cancelled:', error);
    }
  };

  const setLogo = (path: string) => {
    setLogoPreview(path);
    form.setValue('logo', path, { shouldValidate: true, shouldDirty: true });
  };

  const handleRemoveLogo = () => {
    setLogoPreview(undefined);
    form.setValue('logo', undefined, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4 rounded-lg">
        
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

        {/* Unique Identifier / Slug */}
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

        {/* Agency Logo / Banner Photo */}
        <Field>
          <FieldLabel>Agency Photo or Logo (Optional)</FieldLabel>
          <FieldDescription>
            Add a logo or photo for your distribution point.
          </FieldDescription>

          {logoPreview ? (
            <div className="relative mt-2 size-24 rounded-lg border overflow-hidden">
              <img
                src={logoPreview}
                alt="Agency Logo"
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={handleRemoveLogo}
                className="absolute top-1 right-1 rounded-full bg-red-600 p-1 text-white text-xs"
              >
                ✕
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                disabled={isLoading}
                onClick={handleTakePhoto}
              >
                <CameraIcon className="size-4 mr-2" /> Take Photo
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={isLoading}
                onClick={handlePickPhoto}
              >
                <ImagePlus className="size-4 mr-2" /> Pick Photo
              </Button>
            </div>
          )}
        </Field>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            disabled={isLoading}
            onClick={onCancel}
            className="w-full"
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={isLoading}
          className={onCancel ? 'w-full' : 'w-full col-span-2'}
        >
          <Building2 className="size-4 mr-2" />
          {isLoading ? 'Creating...' : submitLabel}
        </Button>
      </div>
    </form>
  );
}