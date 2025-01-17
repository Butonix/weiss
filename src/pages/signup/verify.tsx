import { useEffect, useState } from 'react';
import { Spacer, Text, Button, Input, Card, Image } from '@geist-ui/core';
import Navbar from 'components/Navbar';
import { observer } from 'mobx-react-lite';
import { destroyCookie, parseCookies, setCookie } from 'nookies';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/router';
import UserStore from 'stores/user';
import SettingsStore from 'stores/settings';
import { Translation, useTranslation } from 'components/intl/Translation';
import useSettings from 'components/settings';

const Verify = observer(() => {
  const settings = useSettings();
  const cookie = parseCookies();
  const router = useRouter();
  const [code, setCode] = useState('');
  const [_code, _setCode] = useState<{ data?: string; code?: number }>({});

  const [{ user, getUser, updateUser }] = useState(() => new UserStore());

  useEffect(() => {
    let _code: any =
      cookie && cookie._w_code ? JSON.parse(cookie._w_code) : null;
    _setCode(_code);
  }, []);

  const verify = async () => {
    if (Number(code) !== _code.code) {
      toast.error(
        useTranslation({
          lang: settings?.language,
          value: 'Code is incorrect or expired.'
        })
      );
    } else {
      await getUser(_code.data!).then(async (res: any) => {
        if (res.success) {
          await updateUser({ id: _code.data, status: 'active' });
          destroyCookie(null, '_w_code');
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

          toast.success(
            useTranslation({
              lang: settings?.language,
              value: 'Account verified successfully!'
            })
          );
          router.push('/');
        } else {
          toast.error(
            useTranslation({
              lang: settings?.language,
              value: 'Unable to verify user. Please try again later.'
            })
          );
        }
      });
    }
  };

  return (
    <div className="polkadot">
      <Navbar
        title={useTranslation({
          lang: settings?.language,
          value: 'Account verification'
        })}
        description={useTranslation({
          lang: settings?.language,
          value: 'Account verification'
        })}
        hide
      />
      <Toaster />
      <div>
        <div className="page-container top-100">
          <div className="boxed">
            <div className="logo-container center">
              {settings.siteLogo ? (
                <Image src={`/storage/${settings.siteLogo}`} height={'65px'} />
              ) : (
                <Text h2 width={'100%'}>
                  {settings.siteName}
                </Text>
              )}
            </div>

            <Card shadow width="100%">
              <Text h3>
                <Translation
                  lang={settings?.language}
                  value="Account verification"
                />
              </Text>
              <Spacer h={2} />
              <Input
                className="uppercase"
                width="100%"
                scale={4 / 3}
                onChange={(e) => setCode(e.target.value)}
              >
                <Translation
                  lang={settings?.language}
                  value="Enter code sent to your email"
                />
              </Input>
              <Spacer h={1.5} />
              <Button shadow type="secondary" width="100%" onClick={verify}>
                <Translation lang={settings?.language} value="Continue" />{' '}
                &nbsp;&rarr;
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Verify;
