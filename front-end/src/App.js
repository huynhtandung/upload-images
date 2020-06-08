import React, { useState } from "react";
import { Upload, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import "./App.css";
import "antd/dist/antd.css";
import axios from "axios";

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

function App() {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div className="ant-upload-text">Chose file</div>
    </div>
  );

  const handlePreview = async (file) => {
    console.log("Preview image");
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewVisible(true);
    setPreviewImage(file.url || file.preview);
    setPreviewTitle(file.name || "image");
  };

  const handleChange = (fileList) => {
    console.log("Change image");
    setFileList(fileList.fileList);
  };

  const handleCancel = () => {
    setPreviewVisible(false);
  };

  const handleUpload = () => {
    const formData = new FormData();

    fileList.forEach((file, index) => {
      console.log(file);
      formData.append(`files`, file.originFileObj, "files");
    });

    for (var key of formData.entries()) {
      console.log(key[0] + ", " + key[1]);
    }

    axios
      .post("http://localhost:8080/file/uploads", formData)
      .then((res) => {});
  };

  return (
    <div className="clearfix">
      <Upload
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        beforeUpload={() => false}
      >
        {fileList.length >= 4 ? null : uploadButton}
      </Upload>
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
        width="50%"
      >
        <img alt="example" style={{ width: "100%" }} src={previewImage} />
      </Modal>
      <Button onClick={handleUpload}>
        <UploadOutlined /> Upload All
      </Button>
      <input type="file" name="file" id="vc" />
    </div>
  );
}

export default App;
