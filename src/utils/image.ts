export async function urlContentToDataUri(url: string): Promise<string> {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  const data = Buffer.from(buffer).toString('base64');
  const contentType = response.headers.get('Content-Type');
  return `data:${contentType};base64,${data}`;
}
