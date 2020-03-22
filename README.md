# react-s3-aws

upload files to s3 bucket directly.

import React from "react";
import { withRouter } from "react-router-dom";
import S3 from "react-s3-aws/react-s3/react-aws-s3";
import Button from "@material-ui/core/Button";

const config = {
  bucketName: "your-s3-bucket-name",
  region: "your-s3-region",
  accessKeyId: "your-s3-akey",
  secretAccessKey: "skey",
  "Content-Type": "multipart/form-data",
  Accept: "*/*",
  "Access-Control-Allow-Origin": "*"
};
const ReactS3Client = new S3(config);
class FileUploadComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      files: undefined
    };
    this.uploadFile = this.uploadFile.bind(this);
    this.addFile = this.addFile.bind(this);
  }

  addFile(e) {
    var files = e.target.files[0];
    if (!files) {
      return;
    }
    this.setState({ files });
  }

  uploadFile() {
    var files = this.state.files;
    if (!files) {
      return;
    }
    var timestamp = Date.parse(new Date());
    const newFileName = timestamp.toString() + "_" + files.name;
    ReactS3Client.uploadFile(files, newFileName)
      .then(data => {
        console.log(data);
        alert("upload successfully");
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    return (
      <React.Fragment>
        <input
          type="file"
          className="fileInput"
          color="primary"
          onChange={this.addFile}
        />
        <Button
          onClick={this.uploadFile}
          color="secondary"
          variant="contained"
          disabled={this.state.files === undefined}
          className="marginTop15"
        >
          Upload
        </Button>
      </React.Fragment>
    );
  }
}
export default withRouter(FileUploadComponent);

 
