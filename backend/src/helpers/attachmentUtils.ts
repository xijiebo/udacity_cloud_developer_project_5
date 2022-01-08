import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const bucketName = process.env.ATTACHMENT_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

const XAWS = AWSXRay.captureAWS(AWS)

const s3 = new XAWS.S3({
    signatureVersion: 'v4'
  })
  
export function getUploadUrl(imageId: string) {
    return s3.getSignedUrl('putObject', {
      Bucket: bucketName,
      Key: imageId,
      Expires: parseInt(urlExpiration)
    })
  }