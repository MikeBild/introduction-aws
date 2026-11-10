module.exports = {
  siteMetadata: {
    title: 'Todo-App using Gatsby and GraphQL',
    description: 'An example Todo-App using Gatsby and AppSync GraphQL-API',
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
        schemaModules:
          process.env.NODE_ENV === 'remote'
            ? ['aws', 'todo-api-remote']
            : ['aws', 'todo-api', '@introduction-aws/todo-gatsby-graphql-auth'],
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
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'todo-app-gatsby',
        short_name: 'Todo-Gatsby',
        start_url: '/',
        background_color: '#663399',
        theme_color: '#663399',
        display: 'minimal-ui',
        icon: 'src/images/gatsby-icon.png',
      },
    },
  ],
};
