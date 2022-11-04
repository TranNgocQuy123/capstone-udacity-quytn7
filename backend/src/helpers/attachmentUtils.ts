import * as AWS from 'aws-sdk'
import { createLogger } from '../utils/logger'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('Attach S3')
const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})
const bucketName = process.env.ATTACHMENT_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION
export function createPresignedUrl(s3Key: string): string {
  return s3.getSignedUrl("putObject", {
    Bucket: bucketName,
    Key: s3Key,
    Expires: parseInt(urlExpiration),
  });
}
export function createDownloadedUrl(key: string): string {
  return s3.getSignedUrl("getObject", {
    Bucket: bucketName,
    Key: key,
    Expires: parseInt(urlExpiration),
  });
}
export async function removeAttachment(s3Key: string): Promise<void> {
  const params = {
    Bucket: bucketName,
    Key: s3Key,
  };
  try {
    await s3.headObject(params).promise();
    logger.info("File found in S3!");
    try {
      await s3.deleteObject(params).promise();
      logger.info("File successfully deleted...!");
    } catch (err) {
      logger.error("Failed to deleted: " + JSON.stringify(err));
    }
  } catch (err) {
    logger.error("File not found: " + err.code);
  }
}
