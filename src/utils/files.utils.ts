import {FileTransfer} from '..';

export const createFileFromFileTransfer = (file: FileTransfer) => {
  const blob = new Blob([file.buffer], {type: file.type});
  const newFile = new File([blob], file.name, {type: file.type});
  return newFile;
};
