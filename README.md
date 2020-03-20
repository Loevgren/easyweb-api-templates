# easyweb-api-templates
Base templates for Next.js and .NET Core+Angular/React with Easyweb API-capabilities added for getting started with SPA+API.

## nEWxt
A small Next.js-project with included examples of OAuth2-API calls and how one could map bracket routing directly to the API /routes-endpoint for direct request/page data.   

1. Enter folder
2. Run 'npm install'
3. Run 'npm run dev'
4. Try http://localhost:3000
5. ??
6. Try creating a page in Easyweb and navigate to https://localhost:3000/[page-SEO]

All API-requests are served through /api.

Read more: https://nextjs.org/docs/getting-started

## angEWlar
A default Angular template using Node express engine for passing through Easyweb API-requests and also serving server side rendering (SSR).

1. Enter folder
2. Run 'npm install'
3. Update the 'easywebSettings'-section in package.json with your own values
3. Run 'npm run dev'
4. Try http://localhost:4200

All API-requests are served through /api.
For production, run 'npm run prod'

## CoreactEW
A setup of the default .NET Core React package with Easyweb API-request autothroughput via /api for getting started with SPA+API.

Read more: https://docs.microsoft.com/en-us/aspnet/core/client-side/spa/react?view=aspnetcore-3.1&tabs=visual-studio

## CoregularEW
A setup of the default .NET Core Angular package with Easyweb API-request autothroughput via /api for getting started with SPA+API.

Read more: https://docs.microsoft.com/en-us/aspnet/core/client-side/spa/angular?view=aspnetcore-3.1&tabs=visual-studio
