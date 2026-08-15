import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TestDriveBooking = ({ carName, carId }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    message: '',
  });
  const [isBooked, setIsBooked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsBooked(true);

      // Reset after 5 seconds
      setTimeout(() => {
        setIsBooked(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          date: '',
          time: '',
          message: '',
        });
      }, 5000);
    }, 1500);
  };

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00',
    '14:00', '15:00', '16:00', '17:00'
  ];

  return (
    <div style={{
      padding: '40px',
      borderRadius: '20px',
      background: 'linear-gradient(135deg, rgba(17,17,23,0.95) 0%, rgba(25,25,33,0.95) 100%)',
      border: '1px solid rgba(201,168,76,0.3)',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    }}>
      <AnimatePresence mode="wait">
        {!isBooked ? (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '32px',
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #C9A84C 0%, #E0C06A 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#000',
                fontSize: '28px',
              }}>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 17H3v-6l2-5h14l2 5v6h-2" />
                  <path d="M3 17h18" />
                  <circle cx="7.5" cy="17.5" r="2.5" />
                  <circle cx="16.5" cy="17.5" r="2.5" />
                </svg>
              </div>
              <div>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '28px',
                  fontWeight: 700,
                  color: 'var(--gold)',
                  marginBottom: '4px',
                }}>
                  Book a Test Drive
                </h3>
                <p style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '14px',
                  color: 'rgba(240,237,232,0.6)',
                }}>
                  Experience the {carName} firsthand
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <input
                  type="text"
                  placeholder="Full Name *"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  style={{
                    padding: '14px 18px',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(201,168,76,0.2)',
                    color: 'var(--white)',
                    fontFamily: 'var(--font-ui)',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                  }}
                />

                <input
                  type="email"
                  placeholder="Email *"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  style={{
                    padding: '14px 18px',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(201,168,76,0.2)',
                    color: 'var(--white)',
                    fontFamily: 'var(--font-ui)',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                  }}
                />
              </div>

              <input
                type="tel"
                placeholder="Phone Number *"
                required
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                style={{
                  padding: '14px 18px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(201,168,76,0.2)',
                  color: 'var(--white)',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                }}
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontFamily: 'var(--font-ui)',
                    fontSize: '12px',
                    color: 'rgba(240,237,232,0.6)',
                    marginBottom: '8px',
                  }}>
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      borderRadius: '12px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(201,168,76,0.2)',
                      color: 'var(--white)',
                      fontFamily: 'var(--font-ui)',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontFamily: 'var(--font-ui)',
                    fontSize: '12px',
                    color: 'rgba(240,237,232,0.6)',
                    marginBottom: '8px',
                  }}>
                    Time Slot *
                  </label>
                  <select
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      borderRadius: '12px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(201,168,76,0.2)',
                      color: 'var(--white)',
                      fontFamily: 'var(--font-ui)',
                      fontSize: '14px',
                      outline: 'none',
                      cursor: 'none',
                    }}
                  >
                    <option value="" style={{ background: 'var(--black)' }}>Select time</option>
                    {timeSlots.map(slot => (
                      <option key={slot} value={slot} style={{ background: 'var(--black)' }}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <textarea
                placeholder="Additional message (optional)"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                rows="3"
                style={{
                  padding: '14px 18px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(201,168,76,0.2)',
                  color: 'var(--white)',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '14px',
                  outline: 'none',
                  resize: 'vertical',
                  transition: 'all 0.3s ease',
                }}
              />

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                style={{
                  padding: '18px',
                  borderRadius: '12px',
                  background: isSubmitting
                    ? 'rgba(201,168,76,0.5)'
                    : 'linear-gradient(135deg, #C9A84C 0%, #E0C06A 100%)',
                  border: 'none',
                  color: '#000',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: isSubmitting ? 'not-allowed' : 'none',
                  boxShadow: '0 4px 20px rgba(201,168,76,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                }}
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      style={{
                        width: '20px',
                        height: '20px',
                        border: '2px solid #000',
                        borderTopColor: 'transparent',
                        borderRadius: '50%',
                      }}
                    />
                    Booking...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    Confirm Booking
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            style={{
              padding: '60px 40px',
              textAlign: 'center',
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              style={{
                fontSize: '80px',
                marginBottom: '24px',
              }}
            >
              ✅
            </motion.div>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '32px',
              fontWeight: 700,
              color: '#25D366',
              marginBottom: '16px',
            }}>
              Booking Confirmed!
            </h3>
            <p style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '16px',
              color: 'rgba(240,237,232,0.8)',
              lineHeight: 1.6,
              marginBottom: '8px',
            }}>
              Your test drive has been scheduled for
            </p>
            <p style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '18px',
              fontWeight: 600,
              color: 'var(--gold)',
            }}>
              {new Date(formData.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })} at {formData.time}
            </p>
            <p style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '14px',
              color: 'rgba(240,237,232,0.6)',
              marginTop: '20px',
            }}>
              We'll send you a confirmation email shortly
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TestDriveBooking;
