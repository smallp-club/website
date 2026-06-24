import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

const CONFIRM_URL_PLACEHOLDER = '{{ .ConfirmationURL }}';
const BASE_URL = 'https://smallp.club';

export default function MagicLinkEmail() {
  return (
    <Html lang="de">
      <Head>
        <meta name="color-scheme" content="light" />
        <meta name="supported-color-schemes" content="light" />
        <style>{`
          :root {
            color-scheme: light;
            supported-color-schemes: light;
          }
          body {
            background-color: #F7F6F2 !important;
          }
          /* Outlook.com dark mode override */
          [data-ogsc] body,
          [data-ogsb] body {
            background-color: #F7F6F2 !important;
          }
          [data-ogsc] .spc-container {
            background-color: #F7F6F2 !important;
          }
          [data-ogsc] .spc-heading,
          [data-ogsc] .spc-text {
            color: #0A0A0A !important;
          }
          [data-ogsc] .spc-muted {
            color: #525B66 !important;
          }
          [data-ogsc] .spc-button {
            background-color: #7BDCB5 !important;
            color: #0A0A0A !important;
          }
          [data-ogsc] .spc-link {
            color: #1D5556 !important;
          }
          /* Apple Mail / iOS dark mode override */
          @media (prefers-color-scheme: dark) {
            body, .spc-container {
              background-color: #F7F6F2 !important;
            }
            .spc-heading, .spc-text {
              color: #0A0A0A !important;
            }
            .spc-muted {
              color: #525B66 !important;
            }
            .spc-button {
              background-color: #7BDCB5 !important;
              color: #0A0A0A !important;
            }
            .spc-link {
              color: #1D5556 !important;
            }
          }
        `}</style>
      </Head>
      <Preview>ein link, eine stunde, einmal nutzbar.</Preview>
      <Body style={body}>
        <Container style={container} className="spc-container">
          <Section style={headerSection}>
            <Img
              src={`${BASE_URL}/brand/smallpclub-wordmark-black.png`}
              alt="small p club"
              width={160}
              height={24}
              style={wordmark}
            />
          </Section>

          <Section style={heroSection}>
            <Heading as="h1" style={lede} className="spc-heading">
              einmal klicken. dann bist du drin.
            </Heading>
            <Text style={paragraph} className="spc-text">
              das ist alles. kein passwort, kein gedöns.
              ein link, eine stunde gültig, einmal nutzbar.
            </Text>

            <Section style={buttonWrapper}>
              <Button
                href={CONFIRM_URL_PLACEHOLDER}
                style={button}
                className="spc-button"
              >
                klick rein.
              </Button>
            </Section>

            <Text style={small} className="spc-muted">
              oder direkt hier:
            </Text>
            <Text style={fallbackLinkWrap} className="spc-muted">
              <Link
                href={CONFIRM_URL_PLACEHOLDER}
                style={fallbackLink}
                className="spc-link"
              >
                {CONFIRM_URL_PLACEHOLDER}
              </Link>
            </Text>

            <Text style={small} className="spc-muted">
              falls du das nicht warst, ignorier diese mail.
              hier passiert nichts ohne dich.
            </Text>
          </Section>

          <Section style={signOffSection}>
            <Text style={signOffStatement} className="spc-text">
              mit-glied. auch ohne-glied.
            </Text>
            <Text style={signOffWordmark} className="spc-muted">
              small p club
            </Text>
            <Text style={tagline} className="spc-text">
              no measure, no pressure.
            </Text>
            <Text style={legalLinks} className="spc-muted">
              <Link
                href={`${BASE_URL}/datenschutz`}
                style={legalLink}
                className="spc-link"
              >
                datenschutz
              </Link>
              {' · '}
              <Link
                href={`${BASE_URL}/impressum`}
                style={legalLink}
                className="spc-link"
              >
                impressum
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const OFFWHITE = '#F7F6F2';
const BLACK = '#0A0A0A';
const TURQUOISE = '#7BDCB5';
const DARK_TURQUOISE = '#1D5556';
const SLATE = '#525B66';

const fontStack =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif';

const body: React.CSSProperties = {
  backgroundColor: OFFWHITE,
  fontFamily: fontStack,
  margin: 0,
  padding: '48px 16px',
};

const container: React.CSSProperties = {
  backgroundColor: OFFWHITE,
  maxWidth: '520px',
  margin: '0 auto',
};

const headerSection: React.CSSProperties = {
  margin: '0 0 56px',
};

const wordmark: React.CSSProperties = {
  display: 'block',
  height: 'auto',
};

const heroSection: React.CSSProperties = {
  margin: '0 0 56px',
};

const lede: React.CSSProperties = {
  color: BLACK,
  fontSize: '36px',
  fontWeight: 300,
  letterSpacing: '-0.02em',
  lineHeight: 1.05,
  margin: '0 0 20px',
};

const paragraph: React.CSSProperties = {
  color: BLACK,
  fontSize: '17px',
  lineHeight: 1.5,
  margin: '0 0 36px',
};

const buttonWrapper: React.CSSProperties = {
  margin: '0 0 32px',
};

const button: React.CSSProperties = {
  backgroundColor: TURQUOISE,
  borderRadius: '999px',
  color: BLACK,
  display: 'inline-block',
  fontSize: '17px',
  fontWeight: 500,
  padding: '18px 32px',
  textDecoration: 'none',
};

const small: React.CSSProperties = {
  color: SLATE,
  fontSize: '14px',
  lineHeight: 1.6,
  margin: '0 0 8px',
};

const fallbackLinkWrap: React.CSSProperties = {
  color: SLATE,
  fontSize: '13px',
  lineHeight: 1.5,
  margin: '0 0 28px',
  wordBreak: 'break-all',
};

const fallbackLink: React.CSSProperties = {
  color: DARK_TURQUOISE,
  textDecoration: 'underline',
};

const signOffSection: React.CSSProperties = {
  borderTop: `1px solid rgba(10, 10, 10, 0.08)`,
  paddingTop: '32px',
  margin: 0,
};

const signOffStatement: React.CSSProperties = {
  color: BLACK,
  fontSize: '15px',
  fontWeight: 400,
  letterSpacing: '-0.01em',
  margin: '0 0 4px',
};

const signOffWordmark: React.CSSProperties = {
  color: SLATE,
  fontSize: '13px',
  margin: '0 0 4px',
};

const tagline: React.CSSProperties = {
  color: BLACK,
  fontSize: '15px',
  fontWeight: 400,
  letterSpacing: '-0.01em',
  margin: '0 0 20px',
};

const legalLinks: React.CSSProperties = {
  color: SLATE,
  fontSize: '12px',
  margin: 0,
};

const legalLink: React.CSSProperties = {
  color: SLATE,
  textDecoration: 'underline',
};
