import shortId from 'short-uuid';
import { dateYMD, xAmzDate } from "./Date";
import { throwError } from "./ErrorThrower";
import GetUrl from "./Url";
import Policy from "./Policy";
import Signature from "./Signature";
class ReactS3Client {
    constructor(config) {
        this.config = config;
    }
    async uploadFile(file, newFileName) {
        throwError(this.config, file);
        const fd = new FormData();
        
        const fileName = `${newFileName || shortId.generate()}`;
        const key = `${this.config.dirName ? this.config.dirName + "/" : ""}${fileName}`;
        const url = GetUrl(this.config);
        fd.append("key", key);
        fd.append("acl", "public-read");
        fd.append("Content-Type", file.type);
        fd.append("Content-Disposition", "attachment");
        fd.append("x-amz-meta-uuid", "14365123651274");
        fd.append("x-amz-server-side-encryption", "AES256");
        fd.append("X-Amz-Credential", `${this.config.accessKeyId}/${dateYMD}/${this.config.region}/s3/aws4_request`);
        fd.append("X-Amz-Algorithm", "AWS4-HMAC-SHA256");
        fd.append("X-Amz-Date", xAmzDate);
        fd.append("x-amz-meta-tag", "");
        fd.append("Policy", Policy.getPolicy(this.config));
        fd.append("X-Amz-Signature", Signature.getSignature(this.config, dateYMD, Policy.getPolicy(this.config)));
        fd.append("file", file);
        const data = await fetch(url, { method: "post", body: fd });
        if (!data.ok)
            return Promise.reject(data);
        return Promise.resolve({
            bucket: this.config.bucketName,
            key: `${this.config.dirName ? this.config.dirName + "/" : ""}${fileName}`,
            location: `${url}/${this.config.dirName ? this.config.dirName + "/" : ""}${fileName}`,
            status: data.status
        });
    }
    async deleteFile(fileName) {
        const url = `https://${this.config.bucketName}.s3${this.config.region ? "-" + this.config.region : ""}.amazonaws.com/${this.config.dirName ? this.config.dirName + "/" : ""}${fileName}`;
        const deleteResult = await fetch(url, { method: "delete" });
        if (!deleteResult.ok)
            return Promise.reject(deleteResult);
        return Promise.resolve({
            ok: deleteResult.ok,
            status: deleteResult.status,
            message: "File Deleted",
            fileName: fileName
        });
    }
}
export default ReactS3Client;
