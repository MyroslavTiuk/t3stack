import React, { useMemo, Fragment, useState } from "react";
import { CheckIcon } from "@heroicons/react/24/solid";

import Button from "~/components/atoms/button";
import ErrorMessage from "~/components/atoms/ErrorMessage";
import {
  PROPERTIES_DISPLAY_NAME,
  REQUIRED_PROPERTIES,
  Steps,
  SAMPLE_DATA,
  PROPERTIES,
  type MappedProperties,
  type Property,
} from "../data";
import { PropertySelect } from "./propertySelect";
import { Pattern } from "./patterns/pattern";
import ExampleEntries from "./exampleEntries";

const ParseCsv: React.FC<Props> = ({
  setStep,
  mappedProperties,
  setMappedProperties,
  csvArray,
}) => {
  const [activeProperty, setActiveProperty] = useState<string | null>(null);
  const [showMissing, setShowMissing] = useState(false);

  const originalColumnNames = useMemo(
    () => (csvArray.length > 0 ? Object.keys(csvArray[0]) : []),
    [csvArray]
  );

  const notMappedProperties = useMemo(
    () =>
      REQUIRED_PROPERTIES.filter((prop) => !mappedProperties[prop].csvColName),
    [mappedProperties]
  );

  const handlePreviewClick = () => {
    if (notMappedProperties.length) {
      setShowMissing(true);
      return;
    }
    setStep(Steps.previewCsv);
  };

  return (
    <>
      <table className="w-full table-fixed overflow-x-scroll text-left text-sm">
        <thead>
          <tr>
            <th className="w-36">Transaction Property</th>
            <th className="w-10" />
            <th className="w-72">CSV Column</th>
            <th>Example Value</th>
            <th>Expected Format</th>
          </tr>
        </thead>
        <tbody>
          {(Object.keys(PROPERTIES) as Property[]).map((property) => {
            return (
              <Fragment key={property}>
                <tr>
                  <td>
                    <p className="py-8 font-bold">
                      {PROPERTIES_DISPLAY_NAME[property]}
                      {REQUIRED_PROPERTIES.includes(property) && "*"}
                    </p>
                  </td>
                  <td>
                    {mappedProperties[property].csvColName && (
                      <CheckIcon className="h-8 w-8 text-orange" />
                    )}
                  </td>
                  <td>
                    <PropertySelect
                      mappedProperties={mappedProperties}
                      setMappedProperties={setMappedProperties}
                      property={property}
                      originalColumnNames={originalColumnNames}
                      setActiveProperty={setActiveProperty}
                    />
                  </td>
                  <td>
                    <ExampleEntries
                      csvArray={csvArray}
                      csvColName={mappedProperties[property].csvColName}
                    />
                  </td>
                  <td>
                    {SAMPLE_DATA?.[property]?.map((dataExample) => (
                      <Fragment key={dataExample}>
                        <span key={dataExample}>{dataExample}</span>
                        <br />
                      </Fragment>
                    ))}
                  </td>
                </tr>
                <tr className="border-b border-neutral-400">
                  <td colSpan={5}>
                    {property === activeProperty && (
                      <Pattern
                        property={property}
                        csvArray={csvArray}
                        mappedProperties={mappedProperties}
                        setMappedProperties={setMappedProperties}
                        originalColumnNames={originalColumnNames}
                      />
                    )}
                  </td>
                </tr>
              </Fragment>
            );
          })}
        </tbody>
      </table>
      {showMissing && !!notMappedProperties.length && (
        <ErrorMessage>
          {`These properties should be mapped: ${notMappedProperties
            .map((prop) => PROPERTIES_DISPLAY_NAME[prop])
            .join(", ")}`}
        </ErrorMessage>
      )}
      <div className="mt-4 flex justify-around">
        <Button
          variant="outlined"
          className="mx-auto"
          onClick={() => setStep(Steps.selectCsv)}
        >
          Back
        </Button>
        <Button className="mx-auto" onClick={handlePreviewClick}>
          Preview
        </Button>
      </div>
    </>
  );
};

type Props = {
  setStep: React.Dispatch<React.SetStateAction<keyof typeof Steps>>;
  mappedProperties: MappedProperties;
  setMappedProperties: React.Dispatch<React.SetStateAction<MappedProperties>>;
  csvArray: { [key: string]: string | null }[];
};

export default ParseCsv;
