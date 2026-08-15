import React from 'react';
import { motion } from 'framer-motion';

export default function PrivacyPolicy() {
  return (
    <div style={styles.container}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={styles.content}
      >
        <h1 style={styles.title}>Privacy Policy</h1>
        <p style={styles.updated}>Last Updated: July 28, 2026</p>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>1. Introduction</h2>
          <p style={styles.text}>
            Welcome to 1M Motors. We respect your privacy and are committed to protecting your
            personal data. This privacy policy will inform you about how we handle your personal
            data, your privacy rights, and how the law protects you.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>2. Data We Collect</h2>
          <p style={styles.text}>We may collect, use, store and transfer different kinds of personal data about you:</p>
          <ul style={styles.list}>
            <li><strong>Identity Data:</strong> Name, username, date of birth</li>
            <li><strong>Contact Data:</strong> Email address, telephone number, billing address</li>
            <li><strong>Financial Data:</strong> Payment card details (processed securely via Stripe)</li>
            <li><strong>Transaction Data:</strong> Details of purchases and payments</li>
            <li><strong>Technical Data:</strong> IP address, browser type, device information</li>
            <li><strong>Usage Data:</strong> How you use our website and services</li>
            <li><strong>Marketing Data:</strong> Your preferences for marketing communications</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>3. How We Use Your Data</h2>
          <p style={styles.text}>We use your personal data for the following purposes:</p>
          <ul style={styles.list}>
            <li>To process and deliver your orders</li>
            <li>To manage your account and provide customer service</li>
            <li>To send you important information about purchases</li>
            <li>To personalize your experience on our website</li>
            <li>To improve our website and services</li>
            <li>To send you marketing communications (with your consent)</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>4. Data Security</h2>
          <p style={styles.text}>
            We have implemented appropriate security measures to prevent your personal data from
            being accidentally lost, used, or accessed in an unauthorized way. All payment
            information is encrypted using SSL technology and processed through Stripe's
            PCI-compliant infrastructure.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>5. Data Sharing</h2>
          <p style={styles.text}>
            We may share your personal data with third parties in the following circumstances:
          </p>
          <ul style={styles.list}>
            <li><strong>Payment Processors:</strong> Stripe for secure payment processing</li>
            <li><strong>Email Services:</strong> For sending transactional emails</li>
            <li><strong>Analytics Providers:</strong> Google Analytics (anonymized data)</li>
            <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
          </ul>
          <p style={styles.text}>
            We do not sell, trade, or rent your personal data to third parties for marketing purposes.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>6. Your Rights</h2>
          <p style={styles.text}>Under data protection laws, you have the following rights:</p>
          <ul style={styles.list}>
            <li><strong>Right to Access:</strong> Request copies of your personal data</li>
            <li><strong>Right to Rectification:</strong> Request correction of inaccurate data</li>
            <li><strong>Right to Erasure:</strong> Request deletion of your personal data</li>
            <li><strong>Right to Restrict Processing:</strong> Request limitation of processing</li>
            <li><strong>Right to Data Portability:</strong> Receive your data in a structured format</li>
            <li><strong>Right to Object:</strong> Object to processing of your personal data</li>
            <li><strong>Right to Withdraw Consent:</strong> Withdraw consent at any time</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>7. Cookies</h2>
          <p style={styles.text}>
            Our website uses cookies to distinguish you from other users and provide you with
            a good experience. Cookies are small text files stored on your device that help us:
          </p>
          <ul style={styles.list}>
            <li>Remember your preferences and settings</li>
            <li>Keep you signed in</li>
            <li>Understand how you use our website</li>
            <li>Improve website performance</li>
          </ul>
          <p style={styles.text}>
            You can set your browser to refuse cookies, but some features may not work properly.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>8. Data Retention</h2>
          <p style={styles.text}>
            We will retain your personal data only for as long as necessary to fulfill the
            purposes for which it was collected, including legal, accounting, or reporting
            requirements. Typically, we retain customer data for 7 years after the last transaction.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>9. International Transfers</h2>
          <p style={styles.text}>
            Your data may be transferred to and stored in countries outside your country of
            residence. We ensure appropriate safeguards are in place to protect your data in
            accordance with this privacy policy.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>10. Children's Privacy</h2>
          <p style={styles.text}>
            Our services are not intended for individuals under 18 years of age. We do not
            knowingly collect personal data from children. If you believe we have collected
            data from a child, please contact us immediately.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>11. Changes to This Policy</h2>
          <p style={styles.text}>
            We may update this privacy policy from time to time. We will notify you of any
            significant changes by posting the new policy on this page and updating the
            "Last Updated" date.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>12. Contact Us</h2>
          <p style={styles.text}>
            If you have any questions about this privacy policy or our data practices, please contact us:
          </p>
          <p style={styles.contact}>
            Email: privacy@1mmotors.com<br />
            Phone: +1 (555) 123-4567<br />
            Address: 123 Luxury Lane, Beverly Hills, CA 90210<br />
            Data Protection Officer: dpo@1mmotors.com
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
    paddingTop: 'var(--nav-h)',
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
