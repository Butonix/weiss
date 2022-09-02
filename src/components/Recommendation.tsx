import { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import NextLink from 'next/link';
import { Text, Link, Spacer, Loading } from '@geist-ui/core';
import DiscussionStore from 'stores/discussion';

type recommendProps = {
  title: string;
  category: string;
};

const Recommendation = observer((props: recommendProps) => {
  const [{ loading, discussions, getRecommendation }] = useState(
    () => new DiscussionStore()
  );

  useEffect(() => {
    props.title ? getRecommendation(props.title, props.category) : null;
  }, []);

  const ellipsis = (val: string) => {
    val = val.length >= 80 ? val.substring(0, 75) + '....' : val;
    return val;
  };

  return (
    <>
      <Text h4>Recommend Discussions</Text>
      {loading ? <Loading /> : ''}

      {discussions.map((item, key) => (
        <div>
          <NextLink key={item.id} href={`/d/${item.slug}`}>
            <Link className="post-link">{ellipsis(item.title!)}</Link>
          </NextLink>
        </div>
      ))}

      <Spacer />
    </>
  );
});

export default Recommendation;
