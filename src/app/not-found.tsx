import Link from 'next/link';
import Image from 'next/image';
import notFoundImage from '@/assets/undraw_page-not-found_6wni.svg';

export default function NotFound() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh', // Use most of the viewport height
        padding: '2rem',
        backgroundColor: '#f8d7da', // Light destructive red/pink
        color: '#721c24', // Dark destructive red for text
        textAlign: 'center',
      }}
    >
      {/*
        Replace with your chosen unDraw SVG or image.
        For example, from https://undraw.co/search, search for "404" or "page not found".
        Download the SVG, place it in your /public folder (e.g., /public/undraw_page_not_found.svg)
        and use <Image src="/undraw_page_not_found.svg" alt="Page Not Found Illustration" width={300} height={300} />
        For now, using a placeholder:
      */}
      <Image
        src={notFoundImage}
        alt="Page Not Found Illustration"
        width={300}
        height={250}
        style={{ marginBottom: '2rem' }} // maxWidth can be handled by parent or specific styling if needed
      />
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#721c24' }}>
        404 - Page Not Found
      </h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: '#721c24' }}>
        Sorry, the page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        style={{
          display: 'inline-block',
          padding: '0.75rem 1.5rem',
          backgroundColor: '#dc3545', // Destructive red
          color: 'white',
          textDecoration: 'none',
          borderRadius: '0.375rem', // Equivalent to Tailwind's rounded-md
          fontWeight: 'bold',
          transition: 'background-color 0.2s ease-in-out',
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#c82333')}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#dc3545')}
      >
        Go to Homepage
      </Link>
    </div>
  );
}
