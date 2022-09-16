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
import { destroyCookie, parseCookies, setCookie } from 'nookies';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/router';
import UserStore from 'stores/user';
import SettingsStore from 'stores/settings';

const Login = observer(() => {
  const cookie = parseCookies();
  const router = useRouter();
  const [code, setCode] = useState('');
  const [_code, _setCode] = useState<{ data?: string; code?: number }>({});
  const [{ settings, getSettings }] = useState(() => new SettingsStore());
  const [{ user, getUser, updateUser }] = useState(() => new UserStore());

  useEffect(() => {
    getSettings();
    let _code: any =
      cookie && cookie._w_code ? JSON.parse(cookie._w_code) : null;
    _setCode(_code);
  }, []);

  const verify = async () => {
    if (Number(code) !== _code.code) {
      toast.error('Code is incorrect or expired.');
    } else {
      await getUser(_code.data!).then(async (res: any) => {
        if (res.success) {
          await updateUser({ id: _code.data, status: 'active' });
          destroyCookie(null, '_w_code');
          const { name, id, role, photo, username } = user;
          setCookie(
            null,
            '_w_auth',
            JSON.stringify({ name, id, role, photo, username }),
            {
              maxAge: 30 * 24 * 60 * 60,
              path: '/'
            }
          );

          toast.success('Account verified successfully!');
          router.push('/');
        } else {
          toast.error('Unable to verify user. Please try again later');
        }
      });
    }
  };

  return (
    <div className="polkadot">
      <Navbar
        title="Account verification"
        description="Account verification"
        hide
      />
      <Toaster />
      <div>
        <div className="page-container top-100">
          <div className="boxed">
            <div className="logo-container center">
              {settings.siteLogo ? (
                <img src={`/storage/${settings.siteLogo}`} />
              ) : (
                <Text h2 width={'100%'}>
                  {settings.siteName}
                </Text>
              )}
            </div>

            <Card shadow width="100%">
              <Text h3>Verify your account</Text>
              <Spacer h={2} />
              <Input
                className="uppercase"
                width="100%"
                scale={4 / 3}
                onChange={(e) => setCode(e.target.value)}
              >
                Enter code sent to your email
              </Input>
              <Spacer h={1.5} />
              <Button shadow type="secondary" width="100%" onClick={verify}>
                Continue
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Login;
