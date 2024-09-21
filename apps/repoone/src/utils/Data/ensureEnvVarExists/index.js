// eslint-disable-next-line @typescript-eslint/no-var-requires
const R = require("ramda");

const ensureEnvVarExists = (keys, envVars) => {
  R.pipe(
    R.reduce((errors, key) => {
      if (envVars && envVars[key] === undefined) return errors.concat([key]);
      return errors;
    }, []),
    (errors) => {
      if (errors.length) {
        throw new Error(
          `The following env vars were undefined: ${errors.join(", ")}`
        );
      }
    }
  )(keys);
};

module.exports = ensureEnvVarExists;
