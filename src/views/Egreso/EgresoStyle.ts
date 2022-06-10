import styled from "styled-components";

export const ButtonPrint = styled.button`
  position: absolute !important;
  top: 0;
  right: 0;
  display: block;
`;

export const TitlePrint = styled.h1`
  display: none;

  @media print {
    display: block;
  }
`;
