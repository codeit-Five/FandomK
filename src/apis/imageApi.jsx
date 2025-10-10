import { useState, useRef } from 'react';
import styled from 'styled-components';
import axios, { apiCall } from './baseApi';

// 이미지 생성
export async function postImage(file) {
  const formData = new FormData();
  formData.append('image', file);

  const res = await axios.post(
    'https://fandom-k-api.vercel.app/images/upload',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return res.data;
}

const ImageUploadWrap = styled.div`
  margin-top: 50px;

  & button {
    display: inline-block;
    padding: 2px 10px;
    border: 1px solid #fff;
  }
`;

const ImageUpload = () => {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [apiData, setApiData] = useState([]);

  function handleSelectFile(e) {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  }

  const handleUpload = async () => {
    if (!selectedFile) return;
    const result = await apiCall(postImage, selectedFile);
    if (result) {
      setApiData(result); // 성공
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } else {
      setApiData([]); // 에러 처리 (토스트 등)
    }
  };
  return (
    <ImageUploadWrap>
      <h2>이미지업로드</h2>
      <input type="file" onChange={handleSelectFile} ref={fileInputRef} />
      <button onClick={handleUpload} disabled={!selectedFile}>
        확인
      </button>
      <div>경로 : {apiData.url}</div>
    </ImageUploadWrap>
  );
};

export default ImageUpload;
