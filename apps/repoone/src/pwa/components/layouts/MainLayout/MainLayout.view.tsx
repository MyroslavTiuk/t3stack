import React, { type FC } from "react";
// import { useRouter } from "next/router";
import { type Nullable } from "opc-types/lib/util/Nullable";
import Box from "../../primitives/Box";

import { type MainLayoutProps } from "./MainLayout.props";
import css from "./MainLayout.module.scss";
import ModalProvider from "../../primitives/Modal/ModalProvider";
import commonCss from "../../pages/common.module.scss";
import Card from "../../primitives/Card";
import useMediaQuery from "../../../../utils/Hooks/useMediaQuery";

interface LayoutContextType {
  pageTitle: string;
  setPageTitle: (title: string) => void;
}

const LayoutContext = React.createContext<LayoutContextType>({
  pageTitle: "",
  setPageTitle: () => {},
});

const useLayoutProvider = () => {
  return React.useContext(LayoutContext);
};

export const useUpdateLayoutTitle = (title: string) => {
  const { setPageTitle } = useLayoutProvider();
  React.useEffect(() => {
    setPageTitle(title);
  }, [title]);
};

// const SHOW_BETA_OPT_OUT = true;

const MainLayout: FC<MainLayoutProps> = (props: MainLayoutProps) => {
  // const router = useRouter();
  const [pageTitle, setPageTitle] = React.useState(
    props.initialPageTitle || ""
  );
  const modalRef = React.useRef<Nullable<HTMLDivElement>>(null);
  const [modalRefElement, setModalRefElement] =
    React.useState<Nullable<HTMLDivElement>>(null);
  const isMobile = useMediaQuery("tablet-down");

  const ContentNode = props.nestedCard ? (
    <Box className={commonCss.container}>
      <Card className={[commonCss.content]} no-radius={isMobile}>
        <Box mt={2}>{props.children}</Box>
      </Card>
    </Box>
  ) : (
    props.children
  );

  // this is required because the change in modalRef.current doesn't trigger ModalProvider.modalElement to refresh
  React.useEffect(() => {
    setModalRefElement(modalRef.current);
  }, [modalRef.current]);

  return (
    <Box
      className={[
        `theme--${props.theme || "light"}`,
        "--col --sec-stretch flex",
        css.container,
      ]}
    >
      <div ref={modalRef} />
      <ModalProvider modalElement={modalRefElement}>
        <>
          <Box
            tagName={"main"}
            className={["--col --sec-stretch flex flex-1", css["main-ctnr"]]}
          >
            <LayoutContext.Provider value={{ pageTitle, setPageTitle }}>
              {ContentNode}
            </LayoutContext.Provider>
          </Box>
        </>
      </ModalProvider>
    </Box>
  );
};

export default MainLayout;
