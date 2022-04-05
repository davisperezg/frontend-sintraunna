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

export const Table = styled.div`
  padding: 10px;

  table {
    width: 100%;
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`;
