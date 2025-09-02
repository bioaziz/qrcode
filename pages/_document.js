import Document, { Html, Head, Main, NextScript } from "next/document";

export default function MyDocument(props) {
  const { locale } = props;
  return (
    <Html lang={locale || "en"}>
      <Head />
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

MyDocument.getInitialProps = async (ctx) => {
  const initialProps = await Document.getInitialProps(ctx);
  return { ...initialProps, locale: ctx.locale };
};
