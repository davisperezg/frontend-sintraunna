import styled from "styled-components";

export const ContentButtons = styled.div`
  display: grid;
  background-color: #fff;
  grid-template-columns: repeat(6, 1fr);
  gap: 30px;
`;

export const Button = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: auto;
  position: relative;
  border-radius: 16px;
  text-decoration: none;
  padding-top: 10px;
  padding-bottom: 10px;
  cursor: pointer;
  outline: none;
  border: none;
  background-color: #2b56ab;
`;

export const MyIconButton = styled.div`
  color: hsla(0, 0%, 100%, 0.5);
`;

export const TitleButton = styled.div`
  color: #eee;
  font-size: 16px;
  font-weight: 700;
  text-align: center;
  display: block;
  padding: 0 12px;
  margin-top: 8px;
`;
