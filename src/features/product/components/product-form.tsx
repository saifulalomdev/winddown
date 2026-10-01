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
import type { CreateProductInput } from '../server/product-types';
import { CameraIcon ,ImagePlus} from 'lucide-react';

interface ProductFormProps {
  form: UseFormReturn<CreateProductInput>;
  onSubmit: (data: CreateProductInput) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  submitLabel?: string;
}

export function ProductForm({
  form,
  onSubmit,
  onCancel,
  isLoading,
  submitLabel = 'Save Product',
}: ProductFormProps) {
  const [localImages, setLocalImages] = useState<string[]>(
    form.getValues('images') ?? []
  );

  // Take a photo using the device camera
  const handleTakePhoto = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
      });

      if (image.webPath) {
        addLocalImage(image.webPath);
      }
    } catch (error) {
      console.log('Camera cancelled or failed:', error);
    }
  };

  // Pick an image from the device gallery
  const handlePickPhoto = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos,
      });

      if (image.webPath) {
        addLocalImage(image.webPath);
      }
    } catch (error) {
      console.log('Photo picker cancelled or failed:', error);
    }
  };

  // Helper to append image and update form state
  const addLocalImage = (path: string) => {
    const updated = [...localImages, path];
    setLocalImages(updated);
    form.setValue('images', updated, { shouldValidate: true, shouldDirty: true });
  };

  // Remove an image from the list
  const handleRemoveImage = (indexToRemove: number) => {
    const updated = localImages.filter((_, index) => index !== indexToRemove);
    setLocalImages(updated);
    form.setValue('images', updated, { shouldValidate: true, shouldDirty: true });
  };

  return (
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4 rounded-lg">
          {/* Product Name */}
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="product-name">Product Name *</FieldLabel>
                <Input
                  {...field}
                  value={field.value ?? ''}
                  aria-invalid={fieldState.invalid}
                  id="product-name"
                  disabled={isLoading}
                  placeholder="e.g., Mango Juice 250ml"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* SKU */}
          <Controller
            name="sku"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="product-sku">SKU / Barcode</FieldLabel>
                <Input
                  {...field}
                  value={field.value ?? ''}
                  id="product-sku"
                  aria-invalid={fieldState.invalid}
                  disabled={isLoading}
                  placeholder="e.g., SKU-880123"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* Pricing Grid */}
          <div className="grid grid-cols-2 gap-3">
            <Controller
              name="distributorPrice"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="distributor-price">
                    Distributor Price *
                  </FieldLabel>
                  <Input
                    {...field}
                    type="number"
                    step="0.01"
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    id="distributor-price"
                    aria-invalid={fieldState.invalid}
                    disabled={isLoading}
                    placeholder="0.00"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="shopPrice"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="shop-price">Shop Price *</FieldLabel>
                  <Input
                    {...field}
                    type="number"
                    step="0.01"
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    id="shop-price"
                    aria-invalid={fieldState.invalid}
                    disabled={isLoading}
                    placeholder="0.00"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Controller
              name="mrp"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="product-mrp">MRP</FieldLabel>
                  <Input
                    {...field}
                    type="number"
                    step="0.01"
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(e.target.valueAsNumber || undefined)}
                    id="product-mrp"
                    aria-invalid={fieldState.invalid}
                    disabled={isLoading}
                    placeholder="0.00"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="unit"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="product-unit">Unit *</FieldLabel>
                  <Input
                    {...field}
                    value={field.value ?? 'pack'}
                    id="product-unit"
                    aria-invalid={fieldState.invalid}
                    disabled={isLoading}
                    placeholder="pack, box, piece"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>

          {/* Product Photos Section */}
          <Field>
            <FieldLabel>Product Images</FieldLabel>
            <FieldDescription>
              Photos are saved locally and synced to cloud when online.
            </FieldDescription>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                disabled={isLoading}
                onClick={handleTakePhoto}
              >
                <CameraIcon /> Take Photo
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={isLoading}
                onClick={handlePickPhoto}
              >
                <ImagePlus/> Pick Photo
              </Button>
            </div>

            {/* Image Preview Grid */}
            {localImages.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                {localImages.map((src, index) => (
                  <div key={index} className="relative aspect-square rounded-md border overflow-hidden group">
                    <img
                      src={src}
                      alt={`Product sample ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 rounded-full bg-red-600 p-1 text-white text-xs opacity-90 hover:opacity-100"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Field>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            disabled={isLoading}
            onClick={onCancel}
            className="w-full"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Saving...' : submitLabel}
          </Button>
        </div>
      </form>
  );
}