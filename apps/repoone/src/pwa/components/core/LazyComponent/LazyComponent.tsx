import React, { Suspense } from 'react';
import Loading from '../Loading';

const LazyComponent = (srcRelativeImportPath: string, props: {} = {}) => {
  const Component = React.lazy(() =>
    import(`../../../${srcRelativeImportPath}`),
  );

  return (
    <Suspense fallback={<Loading />}>
      <Component {...props} />
    </Suspense>
  );
};

export default LazyComponent;
