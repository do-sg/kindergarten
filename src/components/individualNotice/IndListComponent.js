import React, { useState } from "react";
import MyClass from "../user/MyClass";
import {
  IndBot,
  IndCon,
  IndIcon,
  IndList,
  IndListBox,
  IndListWrap,
  IndName,
  IndTitle,
  IndTop,
  IndUser,
} from "../../styles/individualNotice/ind";
import { Link } from "react-router-dom";
import useCustomLogin from "../../hooks/useCustomLogin";

const IndListComponent = ({ listData, year, ikid, iclass, page }) => {
  const { loginState, isLogin, isParentLogin } = useCustomLogin();
  const classState = state => {
    const className =
      state === 1
        ? "무궁화반"
        : state === 2
        ? "해바라기반"
        : state === 3
        ? "장미반"
        : state === -1
        ? "퇴소"
        : state === -2
        ? "졸업"
        : "";
    return className;
  };

  return (
    <IndListWrap>
      <IndList>
        {Array.isArray(listData) && listData[0].inotice === 0 ? (
          <div
            style={{ textAlign: "center", width: "100%", marginTop: "5rem" }}
          >
            조회되는 정보가 없습니다.
          </div>
        ) : (
          Array.isArray(listData) &&
          listData.map((item, index) => (
            <IndListBox
              key={index}
              className={item.noticeCheck === 1 ? "notice" : ""}
            >
              <Link
                to={
                  isLogin
                    ? `/ind/details/${item.inotice}?year=${year}&page=${page}&iclass=${iclass}`
                    : `/ind/details/${item.inotice}?year=${year}&page=${page}&ikid=${ikid}`
                }
              >
                <IndTop>
                  <IndName>
                    {classState(item.iclass)} {item.kidNm}
                  </IndName>
                  <IndTitle>
                    {item.noticeCheck === 1 ? (
                      <img
                        src={
                          process.env.PUBLIC_URL +
                          "/images/common/warning_icon.svg"
                        }
                        alt="file"
                      />
                    ) : null}
                    <span>{item.createdAt.split(" ")[0]}</span>
                    <b>{item.noticeTitle}</b>
                  </IndTitle>
                  <IndIcon>
                    {item.picCheck === 1 ? (
                      <img
                        src={
                          process.env.PUBLIC_URL +
                          "/images/common/file_icon.svg"
                        }
                        alt="file"
                      />
                    ) : null}
                    {item.cmtCheck === 1 ? (
                      <img
                        src={
                          process.env.PUBLIC_URL +
                          "/images/common/chat_icon.svg"
                        }
                        alt="file"
                      />
                    ) : null}
                  </IndIcon>
                </IndTop>
                <IndCon>
                  <span>{item.noticeContents}</span>
                </IndCon>
                <IndUser>
                  {item.teacherNm || item.parentNm ? (
                    <>
                      <img
                        src={
                          process.env.PUBLIC_URL +
                          "/images/common/user_icon.svg"
                        }
                        alt="user"
                      />
                      {item.parentNm === null
                        ? "[선생님] " + item.teacherNm
                        : "[학부모] " + item.parentNm}
                    </>
                  ) : null}
                </IndUser>
              </Link>
            </IndListBox>
          ))
        )}
      </IndList>
    </IndListWrap>
  );
};

export default IndListComponent;
