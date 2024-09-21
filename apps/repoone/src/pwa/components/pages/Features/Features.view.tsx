import { type FC, type FormEvent, type ReactElement } from "react";
import React from "react";
import { type SubmitFormParams } from "opc-types/lib/api/requests/SubmitFormParams";

import MainLayout from "../../layouts/MainLayout";
import T, { P } from "../../primitives/Typo";
import GridCols from "../../primitives/GridCols";
import GridItem from "../../primitives/GridCols/GridItem.view";

import { type FeaturesProps } from "./Features.props";
import css from "./Features.module.scss";
import Box from "../../primitives/Box";
import { type Nullable } from "opc-types/lib/util/Nullable";
import Input from "../../primitives/Input/Input.view";
import InputLabel from "../../layouts/InputLabel";
import Button from "../../primitives/Button";

const DEFAULT_FORM: SubmitFormParams["body"] = {
  name: "",
  email: "",
  message: "",
  formType: "membership-enquiry",
  updates: "yes",
};

const FeaturesView: FC<FeaturesProps> = (
  _props: FeaturesProps
): ReactElement<"div"> => {
  const [form, setForm] = React.useState(DEFAULT_FORM);
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
  const toggleUpdates = React.useCallback(() => {
    setForm((s) => ({ ...s, updates: s.updates === "yes" ? "" : "yes" }));
  }, [setForm]);

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
    <MainLayout
      nestedCard
      title="Features and membership - Options profit calculator"
      initialPageTitle="Features"
    >
      <T h2 tagName="h1" className="hide-mob">
        Features
      </T>
      <Box mt={1}>
        <GridCols>
          <GridItem cols={[12, 6, 4]} className={css.featureTile}>
            <T className={css._title}>See estimated profit and loss</T>
          </GridItem>
          <GridItem cols={[12, 6, 4]} className={css.featureTile}>
            <T className={css._title}>
              Choose from a range of popular options strategies
            </T>
          </GridItem>
          <GridItem cols={[12, 6, 4]} className={css.featureTile}>
            <T className={css._title}>
              Keep track of your calculations{" "}
              <span className={css.newTag}>new</span>
            </T>
          </GridItem>
          <GridItem cols={[12, 6, 4]} className={css.featureTile}>
            <T className={css._title}>
              Add anticipated IV changes <span className={css.newTag}>new</span>
            </T>
          </GridItem>
          <GridItem cols={[12, 6, 4]} className={css.featureTile}>
            <T className={css._title}>
              Probability of reaching price{" "}
              <span className={css.newTag}>new</span>
            </T>
          </GridItem>
          <GridItem cols={[12, 6, 4]} className={css.featureTile}>
            <T className={css._title}>
              Find options based on target stock price
            </T>
          </GridItem>
        </GridCols>
      </Box>
      <Box className="formatted-content">
        <T h3>Upcoming features</T>
        <P>
          We're going to be rolling out extra tools to assist you with your
          trading as part of a premium members service.
        </P>
        <P>Here are just some of the ideas we're looking at including:</P>
        <T h4>Custom strategies</T>
        <P>Create your own strategy calculation by adding more options legs.</P>
        {/*<T h4>Standard deviation overlay</T>*/}
        {/*<P>*/}
        {/*  Additional info showing standard deviation lines / percentage probability of price*/}
        {/*  being reached, based on current implied volatility.*/}
        {/*</P>*/}
        <T h4>Compare against alternatives</T>
        <P>
          Quickly see the effect of adjusting the strike price, option expiry or
          spread widths of your strategy.
        </P>
        <T h4>Download spreadsheet</T>
        <P>Download an excel or csv spreadsheet of search results.</P>
        <T h4>Popular searches</T>
        <P>
          See the most popular calculations and trending searches over the week
          or month.
        </P>
        <T h4>Ad-free</T>
        <P>Members will enjoy the site ad-free.</P>
        <T h3 no-margin mt={3}>
          Register to get updates on the rollout of these new features
        </T>
        <form ref={formRef} onSubmit={onSubmit} className={css.form}>
          <Box mv={1} className={css.lineInput}>
            <InputLabel inline-fullsize label="Your email address">
              <Input
                value={form.email}
                onChange={updateField}
                data-field={"email"}
                placeholder={"your@email.com"}
                spellCheck={false}
                noTrack
              />
            </InputLabel>
          </Box>
          <Box mv={1}>
            <InputLabel
              inline-fullsize
              label="Are there any other site features you would find useful?"
            >
              <Box mt={1 / 4}>
                <textarea
                  placeholder="(optional suggestions)"
                  className={css.messageBox}
                  value={form.message}
                  data-field={"message"}
                  onChange={(e) => updateField(e.target.value, e)}
                  rows={8}
                />
              </Box>
            </InputLabel>
          </Box>
          <Box mv={1}>
            <T tagName={"label"}>
              <input
                type="checkbox"
                className={"styled"}
                value="yes"
                name="updates"
                checked={form.updates === "yes"}
                onChange={toggleUpdates}
              />
              &nbsp;Keep me updated on new features
            </T>
          </Box>
          {msgReceived && (
            <T className={"text-success"} mv={2}>
              Your message has been received
            </T>
          )}
          <Box>
            <Button secondary loading={isSending} text={"Send"} type="submit" />
          </Box>
        </form>
      </Box>
    </MainLayout>
  );
};

export default FeaturesView;
