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
        minHeight: '80vh',
        padding: '2rem',
        backgroundColor: '#f8d7da',
        color: '#721c24',
        textAlign: 'center',
      }}
    >
      <Image
        src={notFoundImage}
        alt="Page Not Found Illustration"
        width={300}
        height={250}
        style={{ marginBottom: '2rem' }}
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
          backgroundColor: '#dc3545',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '0.375rem',
          fontWeight: 'bold',
          transition: 'background-color 0.2s ease-in-out',
        }}
      >
        Go to Homepage
      </Link>
    </div>
  );
}
