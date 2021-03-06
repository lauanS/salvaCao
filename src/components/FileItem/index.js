import React, { useEffect, useState, useCallback } from "react";

import FileViewer, { useFileViewer } from "../FileViewer";
import { getFileType, getBase64 } from "../../utils/base64";

import prettyBytes from "pretty-bytes";

import defaultImg from "../../assets/no-image-placeholder.jpg";
import defaultVideoImg from "../../assets/no-video-placeholder.png";
import "./styles.css";

export default function FileItem(props) {
  const defaultUrl = defaultImg;
  const [filePreview, setFilePreview] = useState(defaultUrl);
  const [isLoading, setIsLoading] = useState(true);

  const {
    fileViewerTitle,
    setFileViewerTitle,
    fileViewerVisible,
    setFileViewerVisible,
    toggleFileViewerVisible,
  } = useFileViewer();

  const { file } = props;

  const onClickPreviewImg = () => {
    onPreviewFile(file);
  };

  const onPreviewFile = async (file) => {
    if (!file.url && !file.preview && !file.fileBase64) {
      file.preview = await getBase64(file.originFileObj);
    } else if (file.fileBase64) {
      file.preview = file.fileBase64;
    }

    setFilePreview(file.url || file.preview);
    setFileViewerTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
    setFileViewerVisible(true);
  };

  /* Função para definir a URL de prévia inicial */
  const urlPreview = useCallback(async () => {
    setIsLoading(true);
    let preview;
    if (!file.url && !file.preview && !file.fileBase64) {
      preview = await getBase64(file.originFileObj);
    } else if (file.fileBase64) {
      preview = file.fileBase64;
    }
    setFilePreview(file.url || file.preview || preview);
    setIsLoading(false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* Carrega a url de prévia inicial */
  useEffect(() => {
    urlPreview();
  }, [urlPreview]);

  const preview = () => {
    if(isLoading){
      return defaultUrl;
    }
    if(getFileType(filePreview) === "video"){
      return defaultVideoImg;
    }
    return filePreview;
  }

  return (
    <>
      <div className="container-file-item">
        <div className="info-file-item">
          <div
            className="preview-file-item"
            alt="Imagem enviada"
            style={{
              backgroundImage: `url(${preview()})`,
            }}
            onClick={onClickPreviewImg}
          />
          <div className="content-file-item">
            <div className="content-file-title">
              <strong style={{ fontSize: "0.875rem" }}>{file.name}</strong>
            </div>
            <span className="span-file-item">{prettyBytes(file.size)}</span>
          </div>
        </div>
        {props.children}
      </div>
      <FileViewer
        fileViewerTitle={fileViewerTitle}
        fileViewerVisible={fileViewerVisible}
        toggleFileViewerVisible={toggleFileViewerVisible}
        filePreview={filePreview}
      />
    </>
  );
}
