import React from 'react';

const useWhatChanged = (deps: Record<string, any>) => {
  const [prevVals, setPrevVals] = React.useState(deps);
  React.useEffect(() => {
    Object.keys(deps).map((depName) => {
      if (deps[depName] !== prevVals[depName]) {
        console.info("Changed: ", depName, "=>", deps[depName]);
        setPrevVals((v) => ({ ...v, [depName]: deps[depName] }));
      }
    });
  }, Object.values(deps));
};

export default useWhatChanged;
