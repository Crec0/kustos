import {
    S3_ACCESS_KEY,
    S3_BUCKET,
    S3_ENDPOINT,
    S3_PORT,
    S3_SECRET_KEY,
    S3_USE_SSL,
} from '$env/static/private';
import { Client, type BucketItem, type BucketStream } from 'minio';

const minio = new Client({
    endPoint: S3_ENDPOINT,
    port: Number(S3_PORT),
    useSSL: S3_USE_SSL.toLowerCase() === 'true',
    accessKey: S3_ACCESS_KEY,
    secretKey: S3_SECRET_KEY,
});

const streamToPromise = (stream: BucketStream<BucketItem>) =>
    new Promise<BucketItem[]>((resolve, reject) => {
        const data: BucketItem[] = [];

        stream.on('data', function (obj) {
            data.push(obj);
        });

        stream.on('end', function () {
            resolve(data);
        });

        stream.on('error', function (err) {
            reject(err);
        });
    });

export const listBucket = async (prefix: string = '', recursive: boolean = false) => {
    const stream = minio.listObjectsV2(S3_BUCKET, prefix, recursive);
    return streamToPromise(stream);
};

export const upload = async (name: string = '', stream: Promise<ArrayBuffer>) => {
    await minio.putObject(S3_BUCKET, name, Buffer.from(await stream));
};

export const deleteObject = async (name: string = '') => {
    await minio.removeObject(S3_BUCKET, name);
}