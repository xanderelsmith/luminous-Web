import React, { useState, useEffect, useRef } from 'react';
import './index.css';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    const currentVideo = videoRef.current;
    if (!currentVideo) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!currentVideo.src) {
              currentVideo.src = "/assets/luminous_web.mp4";
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(currentVideo);

    return () => {
      observer.unobserve(currentVideo);
    };
  }, []);

  const toggleFullScreen = async () => {
    if (!document.fullscreenElement) {
      if (wrapperRef.current) {
        try {
          await wrapperRef.current.requestFullscreen();
          if (window.screen && window.screen.orientation && window.screen.orientation.lock) {
            await window.screen.orientation.lock('landscape').catch(() => {});
          }
        } catch (err) {
          console.error(`Error enabling fullscreen: ${err.message}`);
        }
      }
    } else {
      document.exitFullscreen();
      if (window.screen && window.screen.orientation && window.screen.orientation.unlock) {
        window.screen.orientation.unlock();
      }
    }
  };

  const togglePiP = async () => {
    if (videoRef.current) {
      try {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
        } else {
          await videoRef.current.requestPictureInPicture();
        }
      } catch (err) {
        console.error(`Error with PiP: ${err.message}`);
      }
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setIsSubmitted(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    // We can submit the form to the hidden iframe
    form.submit();
    setTimeout(() => {
      setIsSubmitted(true);
    }, 1000);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="hero d-flex flex-column justify-content-start p-0">
        {/* Navbar */}
        <nav className="navbar navbar-expand-lg navbar-dark glass-nav">
          <div className="container">
            <a className="navbar-brand d-flex align-items-center" href="#">
              <img src="/assets/appicon.png" alt="Luminous App Icon" className="navbar-logo" />
              <span className="brand-text">Luminous</span>
            </a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
              aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item"><a className="nav-link" href="#features">Features</a></li>
                <li className="nav-item"><a className="nav-link" href="#demo">Demo</a></li>
                <li className="nav-item"><a className="nav-link" href="#cta">Get Started</a></li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="container flex-grow-1 d-flex align-items-center hero-content-container">
          <div className="row align-items-center w-100">
            <div className="col-lg-6 text-center text-lg-start mb-5 mb-lg-0 hero-text-col">
              <h1 className="display-4 fw-bold mb-3 hero-title animate-fade-up">The Modern EHR for a Brighter Healthcare Future</h1>
              <p className="lead mb-4 hero-subtitle animate-fade-up delay-100">Unify your patient data, streamline collaboration, and secure your practice with Luminous—the beautifully designed EHR.</p>
              <div className="animate-fade-up delay-200">
                <button onClick={openModal} className="btn btn-luminous btn-lg mb-4">Get Started</button>
              </div>
            </div>
            <div className="col-lg-6 d-flex justify-content-center hero-img-col animate-fade-up delay-300">
              <div className="hero-img-glass">
                <img src="/assets/image2.png" className="hero-img" alt="Luminous EHR dashboard screenshot" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Video Section */}
      <section id="demo" className="py-5 demo-section">
        <div className="container-fluid px-4 d-flex justify-content-center">
          <div style={{ maxWidth: '800px', width: '100%' }}>
            <h2 className="fw-bold text-center mb-4 section-title">Watch Our Demo</h2>
            <div ref={wrapperRef} className="demo-video-wrapper shadow-lg rounded">
              {isFullscreen && (
                <button 
                  onClick={toggleFullScreen} 
                  className="btn btn-dark rounded-circle position-absolute" 
                  style={{ top: '20px', right: '20px', zIndex: 1050, width: '48px', height: '48px', opacity: 0.7 }}
                  aria-label="Close Fullscreen"
                >
                  <i className="bi bi-x-lg fs-5"></i>
                </button>
              )}
              {!isPlaying && (
                <button 
                  onClick={() => videoRef.current?.play()}
                  className="custom-play-btn"
                  aria-label="Play Video"
                >
                  <i className="bi bi-play-fill"></i>
                </button>
              )}
              <video 
                ref={videoRef}
                controls 
                playsInline 
                loop 
                preload="none"
                poster="/assets/thumbnail.png"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                className="w-100"
              >
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="video-controls-custom mt-3 d-flex justify-content-end gap-3 px-2">
              <button onClick={toggleFullScreen} className="btn-video-primary">
                <i className="bi bi-arrows-fullscreen me-2"></i>Fullscreen
              </button>
              <button onClick={togglePiP} className="btn-video-action">
                <i className="bi bi-display me-2"></i>Mini Player
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-5 premium-features-section">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold section-title mb-3">Redefining Healthcare Management</h2>
            <p className="text-muted section-subtitle">Experience a fluid, uninterrupted workflow designed for modern clinics.</p>
          </div>

          {/* Feature 1: Unified Patient Journal */}
          <div className="row align-items-center feature-row">
            <div className="col-lg-6 mb-4 mb-lg-0 feature-text-left">
              <h3 className="fw-bold feature-heading">Unified Patient Journal</h3>
              <p className="feature-description">
                A continuous, holistic medical history overview. Unlike traditional systems, Lumiere allows you to browse patient records simultaneously without 'breaking the glass', solving the fragmented journal problem.
              </p>
            </div>
            <div className="col-lg-6">
              <div className="feature-img-wrapper right-align dual-images">
                <img src="/assets/patient_manager1.png" className="img-fluid feature-img main-img" alt="Unified Patient Journal" />
                <img src="/assets/patient_manager2.png" className="img-fluid feature-img overlay-img" alt="Patient Journal Details" />
              </div>
            </div>
          </div>

          {/* Feature 2: Detailed Clinical Dashboard */}
          <div className="row align-items-center feature-row">
            <div className="col-lg-6 order-lg-last mb-4 mb-lg-0 feature-text-right">
              <h3 className="fw-bold feature-heading">Detailed Clinical Dashboard</h3>
              <p className="feature-description">
                A 360-degree view of your practice. Effortlessly manage patient histories, clinical data, and practice metrics from a unified, meticulously designed dashboard.
              </p>
            </div>
            <div className="col-lg-6 order-lg-first">
              <div className="feature-img-wrapper left-align dual-images">
                <img src="/assets/detailed_dashboard.png" className="img-fluid feature-img main-img" alt="Detailed Clinical Dashboard" />
                <img src="/assets/editable_reports.png" className="img-fluid feature-img overlay-img" alt="Editable Clinical Data" />
              </div>
            </div>
          </div>

          {/* Feature 3: Multi-Access & Concurrent Collaboration */}
          <div className="row align-items-center feature-row">
            <div className="col-lg-6 mb-4 mb-lg-0 feature-text-left">
              <h3 className="fw-bold feature-heading">Multi-Access & Concurrent Collaboration</h3>
              <p className="feature-description">
                Role-Based Access Control with real-time multi-user sync. Whether you are a solo practitioner needing offline privacy, or a multi-doctor clinic requiring concurrent actions and editable reports in a single patient journal, Lumiere adapts to you.
              </p>
            </div>
            <div className="col-lg-6">
              <div className="feature-img-wrapper right-align dual-images">
                <img src="/assets/multiaccesslogin.png" className="img-fluid feature-img main-img" alt="Multi-Access Collaboration" />
                <img src="/assets/multiaccesslogin2.png" className="img-fluid feature-img overlay-img" alt="Secondary Multi-Access Login" />
              </div>
            </div>
          </div>

          {/* Feature 4: Intelligent Appointment Tracking */}
          <div className="row align-items-center feature-row">
            <div className="col-lg-6 order-lg-last mb-4 mb-lg-0 feature-text-right">
              <h3 className="fw-bold feature-heading">Intelligent Appointment Tracking</h3>
              <p className="feature-description">
                Seamless scheduling. Doctors and patients can track, manage, and review appointment details in real-time, reducing no-shows and optimizing valuable clinic time.
              </p>
            </div>
            <div className="col-lg-6 order-lg-first">
              <div className="feature-img-wrapper left-align dual-images">
                <img src="/assets/appoitment_tracking.png" className="img-fluid feature-img main-img" alt="Appointment Tracking" />
                <img src="/assets/appointment_details.png" className="img-fluid feature-img overlay-img" alt="Appointment Details" />
              </div>
            </div>
          </div>

          {/* Feature 5: Secure Outbox & Export Templates */}
          <div className="row align-items-center feature-row">
            <div className="col-lg-6 mb-4 mb-lg-0 feature-text-left">
              <h3 className="fw-bold feature-heading">Secure Outbox & Export Templates</h3>
              <p className="feature-description">
                Maintain complete oversight of your practice's communications. Securely track all exported data and use customizable report templates for external correspondence effortlessly through an integrated outbox.
              </p>
            </div>
            <div className="col-lg-6">
              <div className="feature-img-wrapper right-align dual-images">
                <img src="/assets/outboxdatatracking.png" className="img-fluid feature-img main-img" alt="Secure Outbox Data Tracking" />
                <img src="/assets/reporttemplates.png" className="img-fluid feature-img overlay-img" alt="Report Templates" />
              </div>
            </div>
          </div>

          {/* Feature 6: Offline-First Architecture */}
          <div className="row align-items-center feature-row">
            <div className="col-lg-6 order-lg-last mb-4 mb-lg-0 feature-text-right">
              <h3 className="fw-bold feature-heading">Offline-First Architecture</h3>
              <p className="feature-description">
                No internet? Server downtime? No problem. Lumiere is natively built with a powerful offline-first architecture. Access patient journals, create reports, and manage your practice continuously—all of your data automatically and securely syncs the moment your connection is restored.
              </p>
            </div>
            <div className="col-lg-6 order-lg-first">
              <div className="feature-img-wrapper left-align dual-images overlay-left">
                <img src="/assets/offline_clinician.jpg" className="img-fluid feature-img main-img" alt="Offline-First Architecture" />
                <img src="/assets/patient_manager1.png" className="img-fluid feature-img overlay-img" alt="Data Syncing" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section id="cta" className="cta-section">
        <div className="cta-content glass-card">
          <h3 className="fw-bold mb-3">Ready to Illuminate Your Practice?</h3>
          <p className="mb-4">Join healthcare professionals who trust Luminous to power their patient care. Start your free trial today!</p>
          <button onClick={openModal} className="btn-luminous-custom" type="button">Join the Waitlist</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container d-flex justify-content-between align-items-center">
          <div className="footer-brand d-flex align-items-center">
            <img src="/assets/appicon.png" alt="Icon" width="24" height="24" className="me-2" style={{ opacity: 0.8 }} />
            Luminous EHR
          </div>
          <div className="footer-copyright">&copy; 2024. All rights reserved.</div>
        </div>
      </footer>

      {/* Waitlist Modal */}
      {isModalOpen && (
        <div className="modal-custom show" onClick={(e) => e.target.classList.contains('modal-custom') && closeModal()}>
          <div className="modal-content-custom glass-modal">
            <span className="close-modal" onClick={closeModal}>&times;</span>

            {!isSubmitted ? (
              <>
                <h4 className="fw-bold mb-3 text-center pe-4">Join the Waitlist</h4>
                <p className="text-muted mb-4 text-center">Be the first to know when we launch. Enter your email below:</p>
                <form action="https://docs.google.com/forms/d/e/1FAIpQLSeI70DcqGU6rjLk0OpDBqDVXnwLGU9cw4I0SMLQ6E4PeU351w/formResponse" method="POST" target="hidden_iframe" onSubmit={handleSubmit}>
                  <div className="mb-3 text-start">
                    <label htmlFor="waitlistName" className="form-label fw-semibold">Name</label>
                    <input type="text" id="waitlistName" name="entry.90349186" placeholder="Your name" required className="form-control input-custom" />
                  </div>
                  <div className="mb-4 text-start">
                    <label htmlFor="waitlistEmail" className="form-label fw-semibold">Email address</label>
                    <input type="email" id="waitlistEmail" name="entry.1938026491" placeholder="Your email address" required className="form-control input-custom" />
                  </div>
                  <button type="submit" className="btn-luminous-custom w-100">Join Waitlist</button>
                </form>
              </>
            ) : (
              <div className="success-message-custom text-center py-4">
                <i className="bi bi-check-circle-fill d-block mb-3" style={{ fontSize: '3.5rem', color: 'var(--secondary-color)' }}></i>
                <h4 className="fw-bold mb-2">You're on the list!</h4>
                <p className="text-muted mb-0">Thank you for joining the waitlist. We'll be in touch soon.</p>
              </div>
            )}
            <iframe name="hidden_iframe" id="hidden_iframe" style={{ display: 'none' }}></iframe>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
