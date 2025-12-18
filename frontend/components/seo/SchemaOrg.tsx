'use client'

interface SchemaOrgProps {
  type: 'LocalBusiness' | 'Service' | 'BreadcrumbList'
  data: any
}

export function SchemaOrg({ type, data }: SchemaOrgProps) {
  const getSchema = () => {
    switch (type) {
      case 'LocalBusiness':
        return {
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: data.name || 'Жалюзи-Петербург',
          image: data.image,
          '@id': data.url,
          url: data.url,
          telephone: data.telephone || '+7 (812) 123-45-67',
          address: {
            '@type': 'PostalAddress',
            streetAddress: data.address?.streetAddress || 'ул. Примерная, д. 1',
            addressLocality: 'Санкт-Петербург',
            addressCountry: 'RU',
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: data.geo?.latitude || '59.9343',
            longitude: data.geo?.longitude || '30.3351',
          },
          openingHoursSpecification: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '09:00',
            closes: '18:00',
          },
          priceRange: '$$',
        }

      case 'Service':
        return {
          '@context': 'https://schema.org',
          '@type': 'Service',
          serviceType: data.serviceType || 'Производство и установка жалюзи',
          provider: {
            '@type': 'LocalBusiness',
            name: 'Жалюзи-Петербург',
          },
          areaServed: {
            '@type': 'City',
            name: 'Санкт-Петербург',
          },
          description: data.description,
        }

      case 'BreadcrumbList':
        return {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: data.items.map((item: any, index: number) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
          })),
        }

      default:
        return null
    }
  }

  const schema = getSchema()
  if (!schema) return null

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

