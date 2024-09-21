export interface HtmlHeadPassedProps {}

export type HtmlHeadPublicProps = HtmlHeadPassedProps;

export interface HtmlHeadProps extends HtmlHeadPublicProps {
  title?: string;
  metaKeywords?: string;
  metaImage?: string;
  metaDescription?: string;
  canonicalLink?: string;
}
