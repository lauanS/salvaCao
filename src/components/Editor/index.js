import React, { useState, useEffect, useContext } from "react";
import { Form, Input, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";

import FileItemList from "../FileItemList";

import { postFile, deleteFile } from "../../services";
import { getBase64 } from "../../utils/base64";
import { Context } from "../../context/authContext";
import "./styles.css";

export default function Editor(props) {
  const { onChange, name, report, isLoading, upload, label } = props;
  const { attachedFiles, setAttachedFiles } = props;
  const { TextArea } = Input;
  const [fileList, setFileList] = useState([]);

  const { getUser } = useContext(Context);
  const userName = getUser();
  
  const uploadFile = async (options) => {
    const { onSuccess, onError, file } = options;
    
    if(upload === false){
      const obj = {
        reportId: -1, // Id da denúncia
        author: userName, // Nome de quem enviou o arquivo
        name: file.name, // Nome do arquivo (exemplo: img.png)
        originFile: file,
        fileBase64: await getBase64(file), // Arquivo base64
        size: file.size, // Tamanho do arquivo (em bytes)
        url: null, // URL no nosso servidor
      };

      onSuccess(file);
      setAttachedFiles([...attachedFiles, obj]);
      return;
    }
    const obj = {
      reportId: report.id, // Id da denúncia
      author: userName, // Nome de quem enviou o arquivo
      name: file.name, // Nome do arquivo (exemplo: img.png)
      fileBase64: await getBase64(file), // Arquivo base64
      size: file.size, // Tamanho do arquivo (em bytes)
      url: null, // URL no nosso servidor
    };

    postFile(obj)
      .then((res) => {
        file.id = res.data.id;
        onSuccess(file);
        setAttachedFiles([...attachedFiles, res.data]);
      })
      .catch((_) => {
        const error = new Error("Erro ao realizar o upload do arquivo");
        onError({ event: error });
      });
  };

  const removeFile = async (file) => {
    const id = file.id;
    if(id){
      try {
        await deleteFile(id);
        // Atualiza a lista de objetos
        const newFileList = fileList.filter(fileItem => fileItem.id !== id);
        const newAttachedFiles = attachedFiles.filter(fileItem => fileItem.id !== id);
        setAttachedFiles(newAttachedFiles);
        setFileList(newFileList);
      } catch (error) {
        console.debug(error);
      }
      return;
    }
    const newFileList = fileList.filter(fileItem => fileItem.uid !== file.uid);
    const newAttachedFiles = attachedFiles.filter(fileItem => fileItem.uid !== file.uid);
    setAttachedFiles(newAttachedFiles);
    setFileList(newFileList);
  }

  const onChangeFileList = (fileList) => {
    setFileList(fileList.fileList);
  };

  /* Remove os itens anexados após o envio */
  useEffect(() => {
    if(attachedFiles.length === 0){
      setFileList([]);
    }
  }, [attachedFiles]);

  return (
    <>
      <Form.Item
        name={name}
        label={label}
        rules={[
          {
            required: true,
            message: "Por favor, insira uma descrição",
          },
          {
            min: 2,
            message: "Descrição muito curta",
          },
        ]}
      >
        <TextArea rows={4} onChange={onChange} disabled={isLoading} />
      </Form.Item>

      <Form.Item label="Adicionar Anexos">
        <Form.Item
          name="dragger"
          valuePropName="fileList"
          getValueProps={() => fileList}
        >
          <Upload.Dragger
            name="files"
            listType="picture"
            accept="video/*,image/*"
            fileList={fileList}
            customRequest={uploadFile}
            onChange={onChangeFileList}
            itemRender={(originNode, file, currFileList) => {
              return (
                <FileItemList
                  originNode={originNode}
                  file={file}
                  fileList={currFileList}
                  removeFile={removeFile}
                />
              );
            }}
          >
            <p className="ant-upload-drag-icon p-drag">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text p-drag">
              Clique ou arraste o arquivo nesta área para envia-los
            </p>
            <p className="ant-upload-hint p-drag">
              Suporta o envio de um ou mais arquivos
            </p>
          </Upload.Dragger>
        </Form.Item>
      </Form.Item>
    </>
  );
}
