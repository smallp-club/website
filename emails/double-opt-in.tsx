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

const CONFIRM_URL_PLACEHOLDER = '{{ params.DOUBLE_OPT_IN_URL }}';
const BASE_URL = 'https://smallp.club';

export default function DoubleOptInEmail() {
  return (
    <Html lang="de">
      <Head />
      <Preview>ein klick noch. dann bist du dabei.</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={headerSection}>
            <Img
              src={`${BASE_URL}/brand/smallpclub-wordmark-black.svg`}
              alt="small p club"
              width={160}
              height={32}
              style={wordmark}
            />
          </Section>

          <Section style={heroSection}>
            <Heading as="h1" style={lede}>
              eine sache noch.
            </Heading>
            <Text style={paragraph}>
              kurz drücken. wir melden uns viermal im jahr.
              und wenn was wichtig ist.
            </Text>

            <Section style={buttonWrapper}>
              <Button href={CONFIRM_URL_PLACEHOLDER} style={button}>
                ja, mit-glied.
              </Button>
            </Section>

            <Text style={small}>
              warst du das nicht? ignorier die mail.
              <br />
              wir nehmen&apos;s nicht persönlich.
            </Text>
          </Section>

          <Section style={legalSection}>
            <Text style={legalText}>
              wenn du bestätigst, speichern wir deine mail. nur dafür,
              dir den newsletter zu schicken. mehr nicht. kein tracking,
              keine weitergabe, nicht für google, nicht für meta.
            </Text>
            <Text style={legalText}>
              klickst du nicht, vergessen wir die mail-adresse wieder.
            </Text>
            <Text style={legalLinks}>
              <Link href={`${BASE_URL}/datenschutz`} style={legalLink}>
                datenschutz
              </Link>
              {' · '}
              <Link href={`${BASE_URL}/impressum`} style={legalLink}>
                impressum
              </Link>
              {' · '}
              abmelden geht immer.
            </Text>
          </Section>

          <Section style={taglineSection}>
            <Text style={tagline}>no measure, no pressure.</Text>
            <Text style={website}>
              <Link href={BASE_URL} style={websiteLink}>
                smallp.club
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
  fontSize: '48px',
  fontWeight: 300,
  letterSpacing: '-0.02em',
  lineHeight: 1.0,
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
  margin: 0,
};

const legalSection: React.CSSProperties = {
  margin: '0 0 56px',
};

const legalText: React.CSSProperties = {
  color: SLATE,
  fontSize: '13px',
  lineHeight: 1.6,
  margin: '0 0 12px',
};

const legalLinks: React.CSSProperties = {
  color: SLATE,
  fontSize: '13px',
  lineHeight: 1.6,
  margin: 0,
};

const legalLink: React.CSSProperties = {
  color: DARK_TURQUOISE,
  textDecoration: 'underline',
};

const taglineSection: React.CSSProperties = {
  margin: 0,
};

const tagline: React.CSSProperties = {
  color: BLACK,
  fontSize: '15px',
  fontWeight: 400,
  letterSpacing: '-0.01em',
  margin: '0 0 8px',
};

const website: React.CSSProperties = {
  color: SLATE,
  fontSize: '13px',
  margin: 0,
};

const websiteLink: React.CSSProperties = {
  color: SLATE,
  textDecoration: 'underline',
};
