import { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { Card, Text, Grid, Link, Spacer } from '@geist-ui/core';
import { observer } from 'mobx-react-lite';
import Navbar from 'components/Navbar';
import CategoryStore from 'stores/category';
import { Translation, useTranslation } from 'components/intl/Translation';
import useSettings from 'components/settings';

const Category = observer(() => {
  const settings = useSettings();
  const [{ categories, getCategories }] = useState(() => new CategoryStore());

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <div>
      <Navbar
        title={useTranslation({
          lang: settings?.language,
          value: 'Categories'
        })}
        description="Categories"
      />
      <div className="page-container top-100">
        <h2>
          <Translation lang={settings?.language} value="Categories" />
        </h2>
        <div className="category-grid">
          {categories.slice().map((item) => (
            <div key={item.id}>
              <NextLink href={`/category/${item.slug}`}>
                <Link width="100%">
                  <Card
                    type={'default'}
                    width="100%"
                    style={{ background: item.color }}
                    className="text-category"
                  >
                    <Text
                      h4
                      my={0}
                      // style={{ textTransform: 'uppercase' }}
                    >
                      {item.title}
                    </Text>
                    <Text p>{item.description}</Text>
                  </Card>
                </Link>
              </NextLink>
            </div>
          ))}
        </div>
        <Spacer h={5} />
      </div>
    </div>
  );
});

export default Category;
