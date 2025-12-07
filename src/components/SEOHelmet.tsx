import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOHelmetProps {
    title: string;
    description: string;
    image?: string;
    url?: string;
}

const SEOHelmet = ({ title, description, image, url }: SEOHelmetProps) => {
    const location = useLocation();
    const currentUrl = url || `${window.location.origin}${location.pathname}`;
    const defaultImage = `${window.location.origin}/drilldown.png`;
    const ogImage = image || defaultImage;

    useEffect(() => {
        // Update title
        document.title = title;

        // Update meta tags
        const metaTags = [
            { name: 'description', content: description },
            { property: 'og:title', content: title },
            { property: 'og:description', content: description },
            { property: 'og:image', content: ogImage },
            { property: 'og:url', content: currentUrl },
            { property: 'og:type', content: 'website' },
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:title', content: title },
            { name: 'twitter:description', content: description },
            { name: 'twitter:image', content: ogImage },
        ];

        metaTags.forEach(({ name, property, content }) => {
            const attribute = name ? 'name' : 'property';
            const value = name || property;

            let meta = document.querySelector(`meta[${attribute}="${value}"]`);

            if (!meta) {
                meta = document.createElement('meta');
                meta.setAttribute(attribute, value!);
                document.head.appendChild(meta);
            }

            meta.setAttribute('content', content);
        });

        // Update canonical link
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.setAttribute('rel', 'canonical');
            document.head.appendChild(canonical);
        }
        canonical.setAttribute('href', currentUrl);
    }, [title, description, ogImage, currentUrl]);

    return null;
};

export default SEOHelmet;