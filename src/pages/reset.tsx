import { useEffect, useState } from 'react';
import {
  Spacer,
  Text,
  Link,
  Button,
  Input,
  Grid,
  Card,
  Page
} from '@geist-ui/core';
import Navbar from 'components/Navbar';
import { observer } from 'mobx-react-lite';
import { setCookie } from 'nookies';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/router';
import UserStore from 'stores/user';
import SettingsStore from 'stores/settings';

const Reset = observer(() => {
  const router = useRouter();
  const { verify } = router.query;
  const [{ settings, getSettings }] = useState(() => new SettingsStore());
  const [{ loading, user, setUser, login }] = useState(() => new UserStore());

  useEffect(() => {
    getSettings();
  }, [router]);

  const signIn = async () => {
    const { email, password } = user;
    await login({ email, password }).then((res: any) => {
      if (res.success) {
        const { name, id, role, photo, username } = res.data;
        setCookie(
          null,
          '_w_auth',
          JSON.stringify({ name, id, role, photo, username }),
          {
            maxAge: 30 * 24 * 60 * 60,
            path: '/'
          }
        );
        toast.success('Successfully signed in!');
        router.push('/');
      } else {
        toast.error('Incorrect username/email or password!');
      }
    });
  };

  return (
    <div>
      <Navbar title="Forgot password" description="Forgot password" hide />
      <Toaster />
      <Page dotBackdrop dotSpace={0.5}>
        <div className="page-container top-100">
          <Grid.Container width="100%" justify="center" mb="100px">
            <Grid xs={24} lg={24}>
              <div className="logo-container center">
                {settings.siteLogo ? (
                  <img src={`/storage/${settings.siteLogo}`} />
                ) : (
                  <Text h2 width={'100%'}>
                    {settings.siteName}
                  </Text>
                )}
              </div>
            </Grid>
            <Grid xs={24} lg={10}>
              <Card shadow width="100%">
                <Text h3>Reset your password</Text>
                <Spacer h={2} />
                {verify ? (
                  <>
                    <Input
                      placeholder=""
                      width="100%"
                      scale={4 / 3}
                      onChange={(e) =>
                        setUser({ ...user, ...{ email: e.target.value } })
                      }
                    >
                      Enter code sent to your email
                    </Input>
                    <Spacer h={1.5} />
                    <Button
                      shadow
                      type="secondary"
                      width="100%"
                      loading={loading}
                      onClick={signIn}
                    >
                      Continue &rarr;
                    </Button>
                  </>
                ) : (
                  <>
                    <Input.Password
                      placeholder="New Password"
                      width="100%"
                      scale={4 / 3}
                      onChange={(e) =>
                        setUser({ ...user, ...{ password: e.target.value } })
                      }
                    />
                    <Spacer h={1.5} />
                    <Input.Password
                      placeholder="Retype Password"
                      width="100%"
                      scale={4 / 3}
                      onChange={(e) =>
                        setUser({ ...user, ...{ password: e.target.value } })
                      }
                    />
                    <Spacer h={1.5} />
                    <Button
                      shadow
                      type="secondary"
                      width="100%"
                      loading={loading}
                      onClick={signIn}
                    >
                      Reset Password
                    </Button>
                  </>
                )}
              </Card>
            </Grid>
          </Grid.Container>
        </div>
      </Page>
    </div>
  );
});

export default Reset;
