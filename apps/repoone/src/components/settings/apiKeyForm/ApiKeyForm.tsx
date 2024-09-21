import { ApiKeys } from "opcalc-database";
import React, { FC, useState } from "react";
import { api } from "~/utils/api";

const ApiKeyForm: FC = () => {
  const [isFormShown, setIsFormShown] = useState<boolean>(false);
  const [apiKeyName, setApiKeyName] = useState<string>("");
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [disableBtn, setDisableBtn] = useState<boolean>(false);
  const [copiedElement, setCopiedElement] = useState<string>("");

  const {
    data: allApiKeys,
    isLoading,
    refetch,
  } = api.apiKeys.getAll.useQuery();

  const apiKeysCreateMutation = api.apiKeys.generate.useMutation();
  const apiKeysRemoveMutation = api.apiKeys.delete.useMutation();

  const handleForm = async () => {
    setDisableBtn(true);
    const data = await apiKeysCreateMutation.mutateAsync({
      name: apiKeyName,
    });
    if (data.error.length > 0) {
      setFormErrors(data);
    }
    setIsFormShown(false);
    setDisableBtn(false);
    refetch();
  };

  const removeApiKey = async (
    e: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => {
    e.currentTarget.disabled = true;
    const response = window.confirm(
      "Are you sure that you want to delete the key?"
    );

    if (response) {
      const data = await apiKeysRemoveMutation.mutateAsync({
        id,
      });
      if (data.error.length > 0) {
        setFormErrors(data);
      }
      refetch();
    } else {
      e.currentTarget.disabled = false;
    }
  };

  return (
    <div className="flex w-full flex-col items-center justify-between overflow-x-scroll">
      <div className="flex w-full items-center justify-between">
        <h2 className="text-xl font-semibold text-neutral-700">API KEY</h2>
        {allApiKeys && allApiKeys.data.length < 1 && (
          <button
            onClick={() => {
              setIsFormShown(true);
            }}
            type="button"
            className="flex items-center gap-2 rounded-lg bg-blue px-1 py-1 text-sm font-semibold uppercase text-white no-underline drop-shadow transition duration-150 ease-in-out hover:bg-blue/70 hover:bg-opacity-10 md:px-2 lg:text-base"
          >
            generate a new key
          </button>
        )}
      </div>

      {isFormShown && (
        <div className="flex w-full">
          <form
            className="flex w-full gap-2 py-5"
            onSubmit={(e) => {
              e.preventDefault();
              handleForm();
            }}
          >
            <input
              type="text"
              id="generate-key"
              value={apiKeyName}
              onChange={(e) => {
                setApiKeyName(e.currentTarget.value);
              }}
              className="h-9 rounded-lg"
              placeholder="Enter key name..."
            />
            <button
              disabled={disableBtn}
              type="submit"
              className="flex items-center gap-2 rounded-lg bg-blue px-1 py-1 text-sm font-semibold uppercase text-white no-underline drop-shadow transition duration-150 ease-in-out hover:bg-blue/70 hover:bg-opacity-10 md:px-2 lg:text-base"
            >
              Generate
            </button>
          </form>
        </div>
      )}

      {formErrors.length > 0 && (
        <div className="py-5">
          {formErrors.map((item) => (
            <p className="text-red" key={item}>
              {item}
            </p>
          ))}
        </div>
      )}

      <table className="ml-[70px] mt-5 overflow-x-scroll sm:ml-0">
        <thead className="ml-10 bg-gray-200">
          <tr className="text-start">
            <th className="p-1 py-3  text-start text-gray-600">NAME</th>
            <th className="p-1 py-3  text-start text-gray-600">KEY</th>
            <th className="border-l  p-1 py-3  text-start text-gray-600">
              DATE CREATED
            </th>
            <th className="p-1 py-3  text-start text-gray-600">ACTION</th>
          </tr>
        </thead>
        <tbody>
          {isLoading && "Loading..."}
          {allApiKeys &&
            allApiKeys.data.map((item: ApiKeys) => {
              return (
                <tr className="border-b border-gray-300" key={item.id}>
                  <td className="p-1 py-3 text-start text-gray-600">
                    {`${
                      item.name.length > 20
                        ? item.name.slice(0, 20) + "..."
                        : item.name
                    }`}
                  </td>
                  <td className="p-1 py-3 text-start text-gray-600">
                    <div
                      className="group relative cursor-pointer"
                      onClick={() => {
                        navigator.clipboard
                          .writeText(item.key)
                          .then(() => {
                            setCopiedElement(item.id);
                          })
                          .catch(() => {
                            setCopiedElement("");
                          });
                      }}
                    >
                      {`${item.key.slice(0, 20)}...${item.key.slice(-3)}`}
                      <div className="absolute right-12 top-0 z-20 hidden rounded-md bg-gray-700 p-2 text-white group-hover:inline-block">
                        &#128196;{" "}
                        {copiedElement.length > 0 && copiedElement === item.id
                          ? "Copied"
                          : "Click To Copy"}
                      </div>
                    </div>
                  </td>
                  <td className="p-1 py-3 text-start text-gray-600">
                    {item.dateAdded.toDateString()}
                  </td>
                  <td className="p-1 py-3 text-start text-gray-600">
                    <button
                      onClick={(e) => {
                        removeApiKey(e, item.id);
                      }}
                      type="button"
                      className="flex cursor-pointer items-center gap-2 rounded-lg bg-red-500 px-1 py-1 text-sm font-semibold text-white no-underline drop-shadow transition duration-150 ease-in-out hover:bg-red-500/70 hover:bg-opacity-10 md:px-2 lg:text-base"
                    >
                      delete
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default ApiKeyForm;
