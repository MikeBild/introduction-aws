import * as React from 'react';
import { StaticQuery, graphql } from 'gatsby';
import { CssBaseline } from '@material-ui/core';
import Header from './header';

interface TProps {
  children: JSX.Element[] | JSX.Element;
}

export default ({ children }: TProps) => (
  <>
    <CssBaseline />
    <StaticQuery
      query={graphql`
        query SiteTitleQuery {
          site {
            siteMetadata {
              title
            }
          }
        }
      `}
      render={data => (
        <>
          <Header siteTitle={data.site.siteMetadata.title} />
          <main>{children}</main>
          <footer />
        </>
      )}
    />
  </>
);
