import { Link } from "react-router-dom";
import styled from "styled-components";

export const ContentBreadcrumbs = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 10px;
`;

export const Title = styled(Link)`
  text-decoration: none;
  color: rgba(0, 0, 0, 0.6);
`;
