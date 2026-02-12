import { TOKEN, resolve } from '../di'

export class CloudService {
  static readonly s3Repository = resolve(TOKEN.s3Repository)

  /**
   * Get S3 signed URL
   * @param key - Can be either:
   *   - S3 URI: s3://bucket-name/path/to/file.png
   *   - Legacy key: path/to/file.png (uses default bucket or provided bucket)
   * @param bucket - Optional bucket name (used only for legacy key format)
   */
  static async getS3SignedURL(key: string, bucket?: string) {
    return this.s3Repository().signUrl(key, bucket)
  }

  /**
   * Get thumbnail S3 signed URL
   * @param key - Can be either:
   *   - S3 URI: s3://bucket-name/path/to/thumbnail.png
   *   - Legacy key: path/to/thumbnail.png (uses default thumbnail bucket or provided bucket)
   * @param bucket - Optional bucket name (used only for legacy key format)
   */
  static async getThumbnailS3SignedURL(key: string, bucket?: string) {
    return this.s3Repository().signThumbnailUrl(key, bucket)
  }

  static async uploadFileToS3(key: string, fileBuffer: Buffer, fileType: string, bucket?: string) {
    return this.s3Repository().uploadFile(key, fileBuffer, fileType, bucket)
  }
}
