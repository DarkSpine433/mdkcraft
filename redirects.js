const redirects = async () => {
  const internetExplorerRedirect = {
    destination: '/ie-incompatible.html',
    has: [
      {
        type: 'header',
        key: 'user-agent',
        value: '(.*Trident.*)', // all ie browsers
      },
    ],
    permanent: false,
    source: '/:path((?!ie-incompatible.html$).*)', // all pages except the incompatibility page
  }

  const mdkTechRedirect = {
    destination: '/kontakt',
    permanent: true,
    source: '/mdktech',
  }

  const redirects = [internetExplorerRedirect, mdkTechRedirect]

  return redirects
}

export default redirects
