type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function TopicPage({ params }: Props) {
  const { slug } = await params;
  return <main>{/* Topic: {slug} — MDX-Content kommt hier */}</main>;
}
