import { alpha, styled } from "@mui/material/styles";
import { Footer } from "./Footer";
import { SideNav } from "./SideNav";
import { Outlet } from "react-router-dom";

const SIDE_NAV_WIDTH = 250;
const TOP_NAV_HEIGHT = 64;

const LayoutRoot = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  display: "flex",
  flex: "1 1 auto",
  maxWidth: "100%",
  marginTop: `${TOP_NAV_HEIGHT}px`,
  marginLeft: "50px",
}));

const LayoutContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flex: "1 1 auto",
  flexDirection: "column",
  height: "calc(100vh - 100px)",
  width: "100%",
  overflow: "auto",
  "::-webkit-scrollbar": {
    width: "3px",
  },
  "::-webkit-scrollbar-track": {
    backgroundColor: theme.palette.background.default,
  },
  "::-webkit-scrollbar-thumb": {
    backgroundColor: theme.palette.primary.main,
    borderRadius: "10px",
  },
  "::-webkit-scrollbar-thumb:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <SideNav width={SIDE_NAV_WIDTH} height={TOP_NAV_HEIGHT} />
      <LayoutRoot>
        <LayoutContainer>
          {children}
          <Footer />
        </LayoutContainer>
      </LayoutRoot>
    </>
  );
};

const DashboardLayout: React.FC = () => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default DashboardLayout;
