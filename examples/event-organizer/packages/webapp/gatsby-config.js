module.exports = {
  siteMetadata: {
    title: 'Event Organizer',
    description: 'An example Event-Organizer App',
    author: 'Mike Bild',
  },
  plugins: [
    'gatsby-plugin-typescript',
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: 'gatsby-source-modular-graphql',
      options: {
        path: './graphql',
        schemaModules: ['aws', 'events'],
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: `images`,
        path: `${__dirname}/graphql`,
      },
    },
    {
      resolve: `gatsby-plugin-material-ui`,
      options: {
        theme: {
          palette: {
            primary: { main: '#9c27b0' },
          },
        },
      },
    },
  ],
};
