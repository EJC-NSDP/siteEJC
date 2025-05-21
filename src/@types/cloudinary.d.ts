export interface UploadWidget {
  open: () => void
  close: () => void
  upload: () => void
}

export interface UploadWidgetError {
  message: string
}

export interface UploadWidgetResult {
  event: string
  info: {
    secure_url: string
    public_id: string
    coordinates?: {
      custom?: Array<{
        width: number
        height: number
        x: number
        y: number
      }>
    }
    [key: string]: unknown
  }
}

export interface CloudinaryUploadSignature {
  cloudName: string
  apiKey: string
  signature: string
  timestamp: number
  publicId: string
  folder: string
}
