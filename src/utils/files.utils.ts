import {FileTransfer} from '..';

export const createFileTransferFromFile = async (
  file: File,
): Promise<FileTransfer> => {
  const buffer = await file.arrayBuffer();

  return {
    name: file.name,
    type: file.type,
    size: file.size,
    buffer,
  };
};

export const createFileFromFileTransfer = (file: FileTransfer) => {
  const blob = new Blob([file.buffer], {type: file.type});
  const newFile = new File([blob], file.name, {type: file.type});
  return newFile;
};

export const createBlobFileFromFileTransfer = (file: FileTransfer) => {
  return new Blob([file.buffer], {type: file.type});
};

export const createURLFromFileTransfer = (file: FileTransfer) => {
  const bufferBase64 = Buffer.from(file.buffer).toString('base64');

  return (
    `data:${file.type || 'application/octet-stream'};base64,` + bufferBase64
  );
};

export const fileToDataUrl = async (file: File): Promise<string> => {
  const reader = new FileReader();
  reader.readAsDataURL(structuredClone(file));

  return new Promise(resolve => {
    reader.onload = () => {
      resolve(reader.result as string);
    };
  });
};

export const imageToFileTransfer = async (
  url: string,
): Promise<FileTransfer> => {
  url;

  /* const file = await Image(url);

  console.log(file); */

  return null!;
};
