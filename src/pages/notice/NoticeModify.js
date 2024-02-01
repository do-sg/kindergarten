import React, { useState, useEffect } from "react";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Upload, Modal } from "antd";
import { PageTitle } from "../../styles/basic";
import { GreenBtn, PinkBtn } from "../../styles/ui/buttons";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getDetail, putNotice } from "../../api/notice/notice_api";
import { SERVER_URL } from "../../api/config";

const path = `${SERVER_URL}/api/full`;

const NoticeModify = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();
  const { tno } = useParams();

  const [initialData, setInitialData] = useState({
    fullTitle: "",
    fullContents: "",
    pics: [],
  });

  const onChange = e => {
    console.log(`checked = ${e.target.checked}`);
  };

  const handleChange = info => {
    let fileList = [...info.fileList];

    fileList = fileList.map(file => {
      if (file.response) {
        file.url = file.response.url;
      }
      return file;
    });

    setFileList(fileList);
  };

  const handleImageRemove = file => {
    const newFileList = fileList.filter(item => item.uid !== file.uid);
    setFileList(newFileList);
  };

  const customRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess();
    }, 1000);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleCancelConfirmation = () => {
    Modal.confirm({
      title: "정말 취소할까요?",
      content: "작성된 내용은 저장되지 않습니다.",
      onOk: handleCancelOk,
      okText: "확인",
      cancelText: "취소",
      onCancel: () => {},
    });
  };

  const onFinish = async data => {
    try {
      const formData = new FormData();
      const dto = new Blob(
        [
          JSON.stringify({
            iteacher: 1,
            fullTitle: data.fullTitle,
            fullContents: data.fullContents,
          }),
        ],
        { type: "application/json" },
      );
      formData.append("dto", dto);
      fileList.forEach(file => {
        formData.append("pics", file.originFileObj);
      });
      putNotice({
        product: formData,
        successFn: handleSuccess,
        failFn: handleFail,
        errorFn: handleError,
      });
    } catch (error) {
      console.error("수정 에러:", error);
    }
  };

  const handleSuccess = data => {
    setIsModalVisible(true);
    console.log("게시글 수정 성공:", data);
  };

  const handleFail = error => {
    console.error("게시글 수정 실패:", error);
  };

  const handleError = error => {
    console.error("게시글 수정 에러:", error);
  };

  const handleCancelOk = () => {
    navigate("/notice");
    setIsModalVisible(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getDetail({
          tno,
          successFn: data => {
            console.log("데이터 가져오기 성공:", data);
            setInitialData({
              fullTitle: data.fullTitle,
              fullContents: data.fullContents,
              pics: data.pics,
            });
            form.setFieldsValue({
              fullTitle: data.fullTitle,
              fullContents: data.fullContents,
            });
          },
          failFn: error => {
            console.error("데이터 가져오기 실패:", error);
          },
          errorFn: error => {
            console.error("데이터 가져오기 에러:", error);
          },
        });
      } catch (error) {
        console.error("데이터 가져오기 중 에러 발생:", error);
      }
    };

    fetchData();
  }, [tno]);

  return (
    <div>
      <PageTitle>유치원 소식 수정</PageTitle>
      <div
        style={{
          width: "100%",
          height: 560,
          padding: 16,
          borderTop: "1.5px solid #00876D",
          borderBottom: "1.5px solid #00876D",
          background: "#FAFAFA",
          marginTop: 30,
        }}
      >
        <Checkbox onChange={onChange} style={{ marginBottom: 10 }}>
          상단고정
        </Checkbox>

        <Form form={form} onFinish={onFinish} initialValues={initialData}>
          <Form.Item
            name="fullTitle"
            rules={[{ required: true, message: "제목을 입력해주세요!" }]}
          >
            <Input placeholder="제목 입력" />
          </Form.Item>

          <Form.Item
            style={{ height: "150px" }}
            name="fullContents"
            rules={[{ required: true, message: "내용을 입력해주세요!" }]}
          >
            <Input.TextArea
              placeholder="내용 입력"
              style={{ height: "150px" }}
            />
          </Form.Item>

          <Upload
            action={`${path}`}
            listType="picture"
            fileList={fileList}
            onChange={handleChange}
            customRequest={customRequest}
            className="upload-list-inline"
            maxCount={3}
          >
            <Button icon={<UploadOutlined />}>업로드 (최대 3개 파일)</Button>
          </Upload>

          {initialData.pics.length > 0 && (
            <div style={{ marginTop: 20, display: "flex" }}>
              {initialData.pics.map((pic, index) => (
                <div key={index} style={{ marginBottom: 10 }}>
                  <img
                    src={`${SERVER_URL}/pic/fullnotice/${tno}/${pic}`}
                    alt={`file-${index}`}
                    style={{ width: 100, height: 100, marginRight: 10 }}
                  />
                  <Button
                    icon={<DeleteOutlined />}
                    onClick={() => handleImageRemove(index)}
                  />
                </div>
              ))}
            </div>
          )}
        </Form>
      </div>
      <div
        style={{
          marginTop: 35,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <GreenBtn htmlType="submit" onClick={onFinish}>
          수정
        </GreenBtn>
        <PinkBtn onClick={handleCancelConfirmation} style={{ marginLeft: 20 }}>
          취소
        </PinkBtn>
      </div>

      <Link to="/notice">
        <Modal
          title="수정 완료"
          open={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          okText="확인"
          cancelButtonProps={{ style: { display: "none" } }}
          width={350}
        >
          <p>성공적으로 수정되었습니다.</p>
        </Modal>
      </Link>
    </div>
  );
};

export default NoticeModify;
