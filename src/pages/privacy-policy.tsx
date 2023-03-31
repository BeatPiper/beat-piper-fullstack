import { Anchor, Card, Container, List, Stack, Table, Text, Title } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';

function PrivacyPolicy() {
  return (
    <Container>
      <Card radius="lg" p="xl" withBorder style={{ minWidth: 400 }}>
        <Stack spacing="sm">
          <Stack spacing={2}>
            <Title>Privacy Policy</Title>
            <Text color="dimmed">Last updated: 2023-03-31</Text>
          </Stack>
          <Text>
            Your privacy is important to us. We want to be transparent about the data we collect and how
            we use it.
          </Text>
          <Table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Reason</th>
                <th>Persisted</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Spotify ID</td>
                <td>To identify you</td>
                <td>
                  <IconCheck />
                </td>
              </tr>
              <tr>
                <td>Spotify Display Name</td>
                <td>To greet you</td>
                <td>
                  <IconCheck />
                </td>
              </tr>
              <tr>
                <td>Spotify Email</td>
                <td>To contact you</td>
                <td>
                  <IconCheck />
                </td>
              </tr>
              <tr>
                <td>Spotify Profile Picture</td>
                <td>To display it</td>
                <td>
                  <IconCheck />
                </td>
              </tr>
              <tr>
                <td>Spotify OAuth token data</td>
                <td>To access the data above</td>
                <td>
                  <IconCheck />
                </td>
              </tr>
              <tr>
                <td>Your saved playlists</td>
                <td>To provide you with the service</td>
                <td>
                  <IconX />
                </td>
              </tr>
            </tbody>
          </Table>
          <Title order={2}>How do we collect your data?</Title>
          <Text>
            You directly provide us with most of the data we collect. We collect data and process data
            when you
          </Text>
          <List>
            <List.Item>Log in with Spotify</List.Item>
            <List.Item>Use our service</List.Item>
          </List>
          <Title order={2}>How will we use your data?</Title>
          <Text>
            We will use your data only to provide you with the service you requested. We will not share
            your data with any third parties.
          </Text>
          <Title order={2}>How do we store your data?</Title>
          <Text>We securely store your data in a database.</Text>
          <Title order={2}>How can I be sure that my data is secure?</Title>
          <Text>
            We use industry standard security measures to protect your data. Our code is{' '}
            <Anchor href="https://github.com/BeatPiper" target="_blank">
              open source
            </Anchor>{' '}
            and auditable.
          </Text>
        </Stack>
      </Card>
    </Container>
  );
}

export default PrivacyPolicy;
