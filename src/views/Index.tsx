import Modules from "../components/modules/Modules";
import { ContentTitle, Title } from "./IndexStyle";

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
