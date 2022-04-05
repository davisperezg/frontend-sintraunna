import styled from "styled-components";
import { Link } from "react-router-dom";

export const Back = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Options = styled.div`
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const TitleBack = styled(Link)`
  text-decoration: none;
  color: rgba(0, 0, 0, 0.6);
`;
