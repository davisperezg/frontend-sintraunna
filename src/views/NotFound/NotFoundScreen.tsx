import { Link } from "@mui/material";
import { ContentNotFound } from "./NotFoundStyle";

const NotFoundScreen = () => {
  return (
    <ContentNotFound>
      Pagina no encontrada. <Link href="/">Ir a inicio</Link>
    </ContentNotFound>
  );
};

export default NotFoundScreen;
