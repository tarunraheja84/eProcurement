import { storage } from '@/utils/utils';
import  { format } from  'util'
const bucketName = "procurement_vendor_invoice"
const bucket = storage.bucket(bucketName);
export const uploadImage = (buffer:any, filename:string, fileType: string) => new Promise((resolve, reject) => {
  const blob = bucket.file(`${filename}.${fileType}`)
  const blobStream = blob.createWriteStream({
    resumable: false
  })
  blobStream.on('finish', () => {
    const publicUrl = format(
      `https://storage.googleapis.com/${bucket.name}/${blob.name}`
    )
    resolve(publicUrl)
  })
  .on('error', (e) => {
    reject(`Unable to upload image, something went wrong`)
  })
  .end(buffer)
})