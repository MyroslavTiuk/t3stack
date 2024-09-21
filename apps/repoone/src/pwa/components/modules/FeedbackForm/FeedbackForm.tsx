import React, { type FormEvent } from "react";
import { type Nullable } from "opc-types/lib/util/Nullable";

import css from "../../pages/Contact/Contact.module.scss";
import GridCols from "../../primitives/GridCols";
import Box from "../../primitives/Box";
import InputLabel from "../../layouts/InputLabel";
import Input from "../../primitives/Input/Input.view";
import T from "../../primitives/Typo";
import Button from "../../primitives/Button";

const makeDefaultForm = (formType = "contact") => ({
  name: "",
  email: "",
  message: "",
  formType,
});

export const FeedBackForm = ({ formType }: { formType: string }) => {
  const [form, setForm] = React.useState(makeDefaultForm(formType));
  const [isSending, setIsSending] = React.useState(false);
  const [msgReceived, setMsgRecieved] = React.useState(false);
  const formRef = React.useRef<Nullable<HTMLFormElement>>(null);

  const updateField = React.useCallback(
    (val: string, evt: React.SyntheticEvent<HTMLElement>) => {
      // @ts-ignore
      // eslint-disable-next-line no-unsafe-optional-chaining
      const { field } = evt.target?.dataset;
      setForm((s) => ({ ...s, [field]: val }));
    },
    [setForm]
  );

  const onSubmit = React.useCallback(
    (e: FormEvent) => {
      e.preventDefault();

      const { current: formElement } = formRef;
      if (formElement && !isSending) {
        setIsSending(true);
        // todo: IE compatibility
        fetch("/api/submit-form", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
          .then((resp) => {
            if (!resp.ok) throw Error("Not received");
            setMsgRecieved(true);
            setIsSending(false);
          })
          .catch(() => {
            setIsSending(false);
          });
      }
    },
    [formRef, form, isSending]
  );

  return (
    <form ref={formRef} onSubmit={onSubmit} className={css.form}>
      <GridCols>
        <Box mb={2} className={["_cols-12 _cols-tab-plus-6", css.lineInput]}>
          <InputLabel inline-fullsize label="Your name">
            <Input
              value={form.name}
              onChange={updateField}
              data-field={"name"}
              noTrack
              placeholder={"(Optional)"}
            />
          </InputLabel>
        </Box>
        <Box mb={2} className={["_cols-12 _cols-tab-plus-6", css.lineInput]}>
          <InputLabel inline-fullsize label="Email">
            <Input
              value={form.email}
              onChange={updateField}
              data-field={"email"}
              noTrack
              placeholder={"(Optional)"}
            />
          </InputLabel>
        </Box>
        <Box mb={2} className={"_cols-12"}>
          <InputLabel inline-fullsize label="Message">
            <Box mt={1 / 4}>
              <textarea
                className={css.messageBox}
                value={form.message}
                data-field={"message"}
                onChange={(e) => updateField(e.target.value, e)}
                rows={8}
              />
            </Box>
          </InputLabel>
        </Box>
      </GridCols>
      {msgReceived && (
        <T className={"text-success"} mv={2}>
          Your message has been received
        </T>
      )}
      <Box>
        <Button secondary loading={isSending} text={"Send"} type="submit" />
      </Box>
    </form>
  );
};
