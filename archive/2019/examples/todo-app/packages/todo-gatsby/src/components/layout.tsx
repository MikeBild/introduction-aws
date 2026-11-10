import * as React from 'react';
import { StaticQuery, graphql, Link } from 'gatsby';
import Header from './header';
import './layout.css';

interface TProps {
  children: JSX.Element[] | JSX.Element;
}

export default ({ children }: TProps) => (
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
      <div
        style={{
          margin: `0 auto`,
          maxWidth: 960,
          padding: `0px 1.0875rem 1.45rem`,
          paddingTop: 0,
        }}>
        <Header siteTitle={data.site.siteMetadata.title} />
        <nav>
          <Link to='/'>Home</Link>|<Link to='/todos'>Todos</Link>|
          <Link to='/about'>About</Link>
        </nav>

        <main>{children}</main>
        <footer />
      </div>
    )}
  />
);
