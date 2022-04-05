import Footer from "./Footer";
import Header from "./Header";
import { Body, Main } from "./IndexStyle";

interface Props {
  children: JSX.Element | JSX.Element[];
}

const Layout = ({ children }: Props) => {
  return (
    <>
      <Header />
      <Main>
        <Body>{children}</Body>
      </Main>
      <Footer />
    </>
  );
};

export default Layout;
