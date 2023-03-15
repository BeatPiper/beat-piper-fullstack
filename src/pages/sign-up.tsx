import {
  Anchor,
  Badge,
  Button,
  Card,
  Divider,
  Group,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { IconArrowBigRight, IconBrandGoogle } from '@tabler/icons-react';
import { useForm, zodResolver } from '@mantine/form';
import { IUser, userSchema } from '@/common/validation/auth';
import Link from 'next/link';
import { useCallback } from 'react';
import { trpc } from '@/utils/trpc';
import { useRouter } from 'next/router';
import Head from 'next/head';

function SignUp() {
  const router = useRouter();

  const theme = useMantineTheme();
  const form = useForm({
    validate: zodResolver(userSchema),
    initialValues: {
      email: '',
      password: '',
    },
  });

  const mutation = trpc.signup.useMutation();

  const onSubmit = useCallback(
    async (data: IUser) => {
      try {
        const result = await mutation.mutateAsync(data);
        if (result.status === 201) {
          await router.push('/log-in');
        }
      } catch (err) {
        if (mutation.error?.data?.httpStatus === 409) {
          form.setErrors({ email: 'User already exists' });
        }
      }
    },
    [form, mutation, router]
  );

  return (
    <>
      <Head>
        <title>Sign up</title>
      </Head>
      <Group position="center">
        <Card radius="lg" p="xl" withBorder style={{ minWidth: 400 }}>
          <Stack spacing="sm">
            <Stack spacing={2}>
              <Title order={2}>Create a new account</Title>
              <Text color={theme.colors.gray[5]}>Please enter your credentials to sign up</Text>
            </Stack>

            <Button leftIcon={<IconBrandGoogle />} variant="outline" color="gray" fullWidth my="sm">
              <Group spacing="xs">
                Sign up with Google
                <Badge variant="light" size="sm">
                  Soon
                </Badge>
              </Group>
            </Button>

            <Divider label="Or continue with email" labelPosition="center" />

            <form onSubmit={form.onSubmit(onSubmit)}>
              <Stack>
                <TextInput
                  id="email"
                  required
                  autoFocus
                  name="email"
                  type="email"
                  label="Email address"
                  placeholder="hello@email.com"
                  autoComplete="email"
                  {...form.getInputProps('email')}
                />

                <PasswordInput
                  id="password"
                  required
                  name="password"
                  label="Password"
                  placeholder="Your password"
                  autoComplete="new-password"
                  {...form.getInputProps('password')}
                />

                <Button type="submit" leftIcon={<IconArrowBigRight />}>
                  Sign up
                </Button>
                <Group position="center">
                  Already have an account?{' '}
                  <Anchor component={Link} href="/log-in">
                    Log in
                  </Anchor>
                </Group>
              </Stack>
            </form>
          </Stack>
        </Card>
      </Group>
    </>
  );
}

export default SignUp;
