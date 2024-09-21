import { FC } from 'react';

export type ContainerProps<PublicProps, ContainerProps = {}> = PublicProps & {
  View: FC<PublicProps & ContainerProps>;
};
