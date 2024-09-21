// import _ from '_';

const addDotHtml = (url: string) => {
  const urlParts = url.split("?");
  return `${urlParts[0]}${
    urlParts.length > 1 ? `?${urlParts.slice(1).join("")}` : ""
  }`;
};

export default addDotHtml;
