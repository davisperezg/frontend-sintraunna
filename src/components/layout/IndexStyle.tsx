import styled from "styled-components";

export const Head = styled.div`
  background-color: #2b56ab;
  width: 100%;
  height: 75px;
  display: flex;
`;

export const Logo = styled.div`
  width: 250px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: #fff;
  font-weight: bold;
  font-size: 24px;
  margin-left: 10px;
`;

export const Navigation = styled.div`
  width: calc(100% - 240px);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  color: #fff;
  font-weight: 500;
  font-size: 15px;
`;

export const User = styled.div`
  width: auto;
  margin-right: 10px;
  cursor: pointer;
`;

export const Body = styled.div`
  width: 100%;
`;

export const Foote = styled.div`
  background-color: rgb(33, 33, 33);
  width: 100%;
  height: 64px;
  position: absolute;
  bottom: 0;
  left: 0;
  color: #fff;
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Copy = styled.div`
  text-align: center;
  width: 450px;
`;

export const Main = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding-bottom: 200px;

  @media (max-width: 1440px) {
    padding: 20px;
    padding-bottom: 200px;
  }
`;
