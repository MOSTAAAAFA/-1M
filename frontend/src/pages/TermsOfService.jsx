import React from 'react';
import { motion } from 'framer-motion';

export default function TermsOfService() {
  return (
    <div style={styles.container}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={styles.content}
      >
        <h1 style={styles.title}>Terms of Service</h1>
        <p style={styles.updated}>Last Updated: July 28, 2026</p>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>1. Agreement to Terms</h2>
          <p style={styles.text}>
            By accessing or using 1M Motors services, you agree to be bound by these Terms of Service
            and all applicable laws and regulations. If you do not agree with any of these terms,
            you are prohibited from using this site.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>2. Use License</h2>
          <p style={styles.text}>
            Permission is granted to temporarily access the materials on 1M Motors' website for
            personal, non-commercial transitory viewing only. This is the grant of a license,
            not a transfer of title, and under this license you may not:
          </p>
          <ul style={styles.list}>
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose</li>
            <li>Attempt to decompile or reverse engineer any software</li>
            <li>Remove any copyright or proprietary notations</li>
            <li>Transfer the materials to another person</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>3. Vehicle Purchases</h2>
          <p style={styles.text}>
            All vehicle purchases through 1M Motors are subject to availability and confirmation.
            Prices are subject to change without notice. We reserve the right to refuse any order.
          </p>
          <ul style={styles.list}>
            <li>All sales are final once payment is processed</li>
            <li>Delivery times are estimates and not guaranteed</li>
            <li>Buyers are responsible for registration and insurance</li>
            <li>Vehicles are sold "as described" with manufacturer warranties</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>4. Payment Terms</h2>
          <p style={styles.text}>
            Payment must be made in full before vehicle delivery. We accept major credit cards
            and wire transfers. All transactions are processed securely through Stripe.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>5. User Accounts</h2>
          <p style={styles.text}>
            When you create an account with us, you must provide accurate and complete information.
            You are responsible for safeguarding your password and for all activities under your account.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>6. Intellectual Property</h2>
          <p style={styles.text}>
            The service and its original content, features, and functionality are owned by 1M Motors
            and are protected by international copyright, trademark, patent, trade secret, and other
            intellectual property laws.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>7. Disclaimer</h2>
          <p style={styles.text}>
            The materials on 1M Motors' website are provided on an 'as is' basis. 1M Motors makes
            no warranties, expressed or implied, and hereby disclaims all other warranties including,
            without limitation, implied warranties of merchantability, fitness for a particular purpose.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>8. Limitations of Liability</h2>
          <p style={styles.text}>
            In no event shall 1M Motors or its suppliers be liable for any damages (including,
            without limitation, damages for loss of data or profit, or due to business interruption)
            arising out of the use or inability to use the materials on 1M Motors' website.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>9. Governing Law</h2>
          <p style={styles.text}>
            These terms and conditions are governed by and construed in accordance with the laws
            of [Your Jurisdiction] and you irrevocably submit to the exclusive jurisdiction of
            the courts in that location.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>10. Contact Information</h2>
          <p style={styles.text}>
            If you have any questions about these Terms, please contact us at:
          </p>
          <p style={styles.contact}>
            Email: legal@1mmotors.com<br />
            Phone: +1 (555) 123-4567<br />
            Address: 123 Luxury Lane, Beverly Hills, CA 90210
          </p>
        </section>
      </motion.div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'var(--black)',
    paddingTop: 'var(--nav-offset)',
    padding: '120px 24px 80px',
  },
  content: {
    maxWidth: '900px',
    margin: '0 auto',
    color: 'var(--white)',
  },
  title: {
    fontSize: 'clamp(32px, 5vw, 48px)',
    fontWeight: 700,
    marginBottom: '12px',
    background: 'linear-gradient(135deg, var(--gold), var(--gold-light))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  updated: {
    color: 'var(--white-40)',
    fontSize: '14px',
    marginBottom: '48px',
  },
  section: {
    marginBottom: '40px',
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: 600,
    color: 'var(--white)',
    marginBottom: '16px',
  },
  text: {
    color: 'var(--white-70)',
    lineHeight: '1.8',
    fontSize: '16px',
    marginBottom: '16px',
  },
  list: {
    color: 'var(--white-70)',
    lineHeight: '1.8',
    fontSize: '16px',
    paddingLeft: '24px',
    marginTop: '12px',
  },
  contact: {
    color: 'var(--gold)',
    lineHeight: '1.8',
    fontSize: '16px',
    marginTop: '12px',
  },
};
