import Modules from "../components/modules/Modules";
import { Content, ContentTitle, Title } from "./IndexStyle";

const IndexScreen = () => {
  return (
    <>
      <ContentTitle>
        <Title>Modulos disponibles</Title>
      </ContentTitle>
      <Modules />
    </>
  );
};

export default IndexScreen;
