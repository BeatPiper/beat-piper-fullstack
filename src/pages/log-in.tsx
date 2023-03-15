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
import {IconArrowBigRight, IconBrandGoogle} from '@tabler/icons-react';
import {useForm, zodResolver} from '@mantine/form';
import {IUser, userSchema} from '@/common/validation/auth';
import Link from "next/link";
import {useCallback} from "react";
import Head from "next/head";
import {signIn} from "next-auth/react";
import {useRouter} from "next/router";

function LogIn() {
    const router = useRouter();

    const theme = useMantineTheme();
    const form = useForm({
        validate: zodResolver(userSchema),
        initialValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = useCallback(
        async (data: IUser) => {
            try {
                const result = await signIn('credentials', {...data, redirect: false });
                if (result?.ok) {
                    form.reset();
                    await router.push('/');
                } else {
                    form.setErrors({ email: 'Wrong email or password' });
                }
            } catch (err) {
                console.error(err);
            }
        },
        [form, router]
    );

    return (
        <>
            <Head>
                <title>Log in</title>
            </Head>
            <Group position="center">
                <Card radius="lg" p="xl" withBorder style={{minWidth: 400}}>

                    <Stack spacing="sm">
                        <Stack spacing={2}>
                            <Title order={2}>Welcome back</Title>
                            <Text color={theme.colors.gray[5]}>Please enter your credentials to continue</Text>
                        </Stack>

                        <Button leftIcon={<IconBrandGoogle/>} variant="outline" color="gray" fullWidth my="sm">
                            <Group spacing="xs">
                                Log in with Google
                                <Badge variant="light" size="sm">
                                    Soon
                                </Badge>
                            </Group>
                        </Button>

                        <Divider label="Or continue with email" labelPosition="center"/>

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

                                <Button type="submit" leftIcon={<IconArrowBigRight/>}>
                                    Log in
                                </Button>
                                <Group position="center">
                                    Don&apos;t have an account?{' '}
                                    <Anchor
                                        component={Link}
                                        href="/sign-up"
                                    >
                                        Sign up
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

export default LogIn;
