import {
  CldUploadWidget,
  type CldUploadWidgetPropsChildren,
  type CloudinaryUploadWidgetResults,
} from 'next-cloudinary'
import { Button } from '../ui/button'

interface UploadWidgetWrapperProps {
  folder: string
  publicId: string
  aspectRatio: number
  type: 'profile' | 'capa' | 'cartaz'
  handleUpload: (result: CloudinaryUploadWidgetResults) => void
}

export function UploadWidgetWrapper({
  folder,
  publicId,
  aspectRatio,
  type,
  handleUpload,
}: UploadWidgetWrapperProps) {
  return (
    <CldUploadWidget
      signatureEndpoint="/api/cloudinary/sign-upload"
      uploadPreset="signed_upload"
      options={{
        folder,
        publicId,
        cropping: true,
        croppingAspectRatio: aspectRatio,
        croppingShowDimensions: true,
        clientAllowedFormats: ['jpg', 'jpeg', 'png'],
        multiple: false,
      }}
      onSuccess={(result) => {
        handleUpload(result)
      }}
    >
      {({ open }: CldUploadWidgetPropsChildren) => {
        return (
          <Button
            type="button"
            variant={type === 'profile' ? 'default' : 'secondary'}
            onClick={() => open()}
          >
            Selecionar imagem
          </Button>
        )
      }}
    </CldUploadWidget>
  )
}
