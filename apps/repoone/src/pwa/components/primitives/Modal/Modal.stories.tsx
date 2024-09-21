import React from "react";
import Modal, { useModalContext } from "./ModalProvider";
import StoryView from "../Story";
import Button from "../Button";
import Input from "../Input";

const renderDefaultContent = () => {
  return (
    <div>
      <p>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        industry. Lorem Ipsum has been the industry's standard dummy text ever
        since the 1500s, when an unknown printer took a galley of type and
        scrambled it to make a type specimen book. It has survived not only five
        centuries, but also the leap into electronic typesetting, remaining
        essentially unchanged. It was popularised in the 1960s with the release
        of Letraset sheets containing Lorem Ipsum passages, and more recently
        with desktop publishing software like Aldus PageMaker including versions
        of Lorem Ipsum.
      </p>
    </div>
  );
};

const renderContentWithInput = () => {
  return (
    <div>
      <Input placeholder="My input" />
    </div>
  );
};

const ModalStories = () => {
  const { showModal } = useModalContext();
  return (
    <div className={"theme--light grid"}>
      <StoryView title={"Default"} className={"_4"}>
        <Button onClick={() => showModal({ content: renderDefaultContent })}>
          Launch Modal
        </Button>
      </StoryView>

      <StoryView title={"With Header"} className={"_4"}>
        <Button
          onClick={() =>
            showModal({
              content: renderDefaultContent,
              headerString: "This is a Modal With header",
            })
          }
        >
          Launch Modal
        </Button>
      </StoryView>

      <StoryView title={"With Input"} className={"_4"}>
        <Button
          onClick={() =>
            showModal({
              content: renderContentWithInput,
              headerString: "This is a Modal With Input",
            })
          }
        >
          Launch Modal
        </Button>
      </StoryView>
    </div>
  );
};
export default function ModalStory() {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const modalRef = React.useRef(null);

  return (
    <>
      <div ref={modalRef}></div>
      {modalRef.current && (
        <Modal modalElement={modalRef.current}>
          <ModalStories />
        </Modal>
      )}
    </>
  );
}
