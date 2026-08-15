import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// SEO Component for dynamic meta tags
export default function SEOHelmet({
  title = '1M Motors - Luxury Automotive Excellence',
  description = 'Discover premium luxury vehicles at 1M Motors. Experience automotive perfection where engineering becomes art.',
  keywords = 'luxury cars, premium vehicles, sports cars, electric vehicles, automotive excellence',
  image = 'https://1mmotors.com/og-image.jpg',
  type = 'website'
}) {
  const location = useLocation();
  const url = `https://1mmotors.com${location.pathname}`;

  useEffect(() => {
    // Update page title
    document.title = title;

    // Update meta tags
    updateMetaTag('name', 'description', description);
    updateMetaTag('name', 'keywords', keywords);

    // Open Graph tags
    updateMetaTag('property', 'og:title', title);
    updateMetaTag('property', 'og:description', description);
    updateMetaTag('property', 'og:image', image);
    updateMetaTag('property', 'og:url', url);
    updateMetaTag('property', 'og:type', type);
    updateMetaTag('property', 'og:site_name', '1M Motors');

    // Twitter Card tags
    updateMetaTag('name', 'twitter:card', 'summary_large_image');
    updateMetaTag('name', 'twitter:title', title);
    updateMetaTag('name', 'twitter:description', description);
    updateMetaTag('name', 'twitter:image', image);

    // Canonical URL
    updateLink('canonical', url);

    // Structured Data (JSON-LD)
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'AutoDealer',
      name: '1M Motors',
      description: description,
      url: 'https://1mmotors.com',
      logo: 'https://1mmotors.com/logo.png',
      image: image,
      priceRange: '$$$$',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '123 Luxury Lane',
        addressLocality: 'Beverly Hills',
        addressRegion: 'CA',
        postalCode: '90210',
        addressCountry: 'US'
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+1-555-123-4567',
        contactType: 'Customer Service',
        email: 'support@1mmotors.com'
      },
      sameAs: [
        'https://facebook.com/1mmotors',
        'https://instagram.com/1mmotors',
        'https://twitter.com/1mmotors'
      ]
    };

    updateStructuredData(structuredData);

  }, [title, description, keywords, image, url, type]);

  return null;
}

// Helper functions
function updateMetaTag(attribute, key, content) {
  let element = document.querySelector(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function updateLink(rel, href) {
  let element = document.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
}

function updateStructuredData(data) {
  let script = document.querySelector('script[type="application/ld+json"]');
  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}
