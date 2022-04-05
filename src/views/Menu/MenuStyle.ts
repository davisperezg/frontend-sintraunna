import styled from "styled-components";
import { Link } from "react-router-dom";

export const Back = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;
`;

export const TitleBack = styled(Link)`
  text-decoration: none;
  color: rgba(0, 0, 0, 0.6);
`;
