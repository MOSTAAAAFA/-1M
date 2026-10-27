export default function Contact() {
  // ⚠️ غيّر السطرين دول لبياناتك الحقيقية
  const whatsappNumber = '201032849750'; // رقمك بالكود الدولي، من غير + أو صفر في الأول
  const instagramHandle = '1m_motors'; // يوزر نيم الانستجرام من غير @
  
  return (
    <section
      style={{
        minHeight: '100vh',
        background: 'var(--black, #050507)',
        color: 'var(--white, #ffffff)',
        paddingTop: 'calc(var(--nav-offset, 72px) + 96px)',
        paddingBottom: 120,
        paddingLeft: 48,
        paddingRight: 48,
      }}
    >
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        {/* Eyebrow */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <span style={{ width: 32, height: 1, background: 'var(--gold, #C9A84C)' }} />
          <span
            style={{
              fontFamily: 'var(--font-ui, Inter, system-ui, sans-serif)',
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '2.5px',
              textTransform: 'uppercase',
              color: 'var(--gold, #C9A84C)',
            }}
          >
            Get In Touch
          </span>
        </div>

        {/* Heading */}
        <h1
          style={{
            fontFamily: 'var(--font-display, Georgia, serif)',
            fontSize: 64,
            fontWeight: 300,
            marginBottom: 16,
          }}
        >
          Contact{' '}
          <span
            style={{
              fontStyle: 'italic',
              background: 'linear-gradient(135deg, var(--gold, #C9A84C), var(--gold-light, #E8CC7A))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Us
          </span>
        </h1>
        <p
          style={{
            color: 'var(--white-70, rgba(255,255,255,0.7))',
            maxWidth: 480,
            marginBottom: 64,
            fontSize: 16,
            lineHeight: 1.6,
          }}
        >
          Reach out directly — our team usually replies within the hour.
        </p>

        {/* Contact cards */}
        <div
          className="contact-grid"
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}
        >
          <ContactCard
            href={`https://wa.me/${whatsappNumber}`}
            label="WhatsApp"
            value="Chat with our team"
            icon={<WhatsAppIcon />}
          />
          <ContactCard
            href={`https://instagram.com/${instagramHandle}`}
            label="Instagram"
            value={`@${instagramHandle}`}
            icon={<InstagramIcon />}
          />
        </div>
      </div>

      <style>{`
        @media (max-width: 720px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

function ContactCard({ href, label, value, icon }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        padding: 28,
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 'var(--radius-sm, 8px)',
        textDecoration: 'none',
        color: 'var(--white, #ffffff)',
        transition: 'all 0.3s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)';
        e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
        e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(201,168,76,0.35)',
            color: 'var(--gold, #C9A84C)',
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
        <div>
          <p
            style={{
              fontFamily: 'var(--font-ui, Inter, system-ui, sans-serif)',
              fontSize: 11,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: 'var(--white-40, rgba(255,255,255,0.4))',
              marginBottom: 6,
            }}
          >
            {label}
          </p>
          <p style={{ fontSize: 17 }}>{value}</p>
        </div>
      </div>
      <span style={{ color: 'var(--gold, #C9A84C)' }}>→</span>
    </a>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3a9 9 0 0 0-7.79 13.5L3 21l4.7-1.23A9 9 0 1 0 12 3Z" />
      <path
        d="M8.5 9.3c.15-.5.5-1.3 1-1.3.35 0 .75 0 .95.4.2.4.7 1.7.75 1.85.05.15.05.3-.05.45-.15.25-.3.4-.45.55-.15.15-.3.3-.15.55.5.9 1.9 2.15 3.2 2.55.2.05.35 0 .5-.15.2-.25.6-.7.8-.95.2-.25.4-.2.65-.1.3.1 1.7.8 2 .95.2.1.35.15.4.25.05.2.05.65-.15 1.05-.2.4-.9.75-1.4.8-.55.05-1 .05-1.7-.15a9.2 9.2 0 0 1-4-2.7 9.2 9.2 0 0 1-1.9-3.3c-.15-.5-.1-1 .05-1.4Z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}
