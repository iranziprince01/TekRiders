import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import HeroIllustration from '../assets/illustrations/learn.svg';
import AboutIllustration from '../assets/illustrations/learn2.svg';
import UNICEFLogo from '../assets/UNICEF.jpg';
import RISALogo from '../assets/risa.jpg';
import UNHCRLogo from '../assets/unhcr.png';
import MineducLogo from '../assets/mieduc.png.avif';
import AlightLogo from '../assets/Alight.png';
import Footer from '../components/Footer';

const Home = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: 'wifi-off',
      title: t('Offline Access'),
      description: t('No internet? No problem! Download courses and learn anytime, anywhere.')
    },
    {
      icon: 'book',
      title: t('Interactive Learning'),
      description: t('Engage with interactive content, quizzes, and practical exercises for deeper understanding.')
    },
    {
      icon: 'translate',
      title: t('Multilingual Content'),
      description: t('Learn in Kinyarwanda or English. Our platform breaks language barriers for all.')
    },
    {
      icon: 'people',
      title: t('Community Powered'),
      description: t('Join a supportive community of learners and mentors, sharing knowledge and encouragement.')
    },
    {
      icon: 'person-heart',
      title: t('Mentorship & Support'),
      description: t('Get guidance from local mentors and peers who understand your journey.')
    },
    {
      icon: 'laptop',
      title: t('Easy to Use'),
      description: t('Simple, intuitive design for all ages and abilities, including those new to technology.')
    }
  ];

  const courses = [
    { title: t('Digital Literacy Basics'), desc: t('Start your digital journey with essential computer skills.'), category: t('Technology') },
    { title: t('Entrepreneurship 101'), desc: t('Learn how to start and grow your own business.'), category: t('Business') },
    { title: t('English for Beginners'), desc: t('Build your language skills for work and life.'), category: t('Language') },
    { title: t('Health & Wellbeing'), desc: t('Empower yourself with knowledge about health and wellness.'), category: t('Life Skills') },
  ];

  const stories = [
    { name: 'Amina', location: t('Kigali'), quote: t('I never thought I could learn without internet. Now I help others in my village.'), avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { name: 'Jean', location: t('Rubavu'), quote: t('Learning in Kinyarwanda made everything easier for me.'), avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { name: 'Chantal', location: t('Huye'), quote: t('The community support and mentorship changed my life.'), avatar: 'https://randomuser.me/api/portraits/women/65.jpg' },
  ];

  const partners = [
    { name: 'UNICEF', logo: UNICEFLogo },
    { name: 'RISA', logo: RISALogo },
    { name: 'UNHCR', logo: UNHCRLogo },
    { name: 'Ministry of Education', logo: MineducLogo },
    { name: 'Alight', logo: AlightLogo },
  ];

  return (
    <div className="home" aria-label={t('TekRiders E-learning Homepage')}>
      {/* Header handled globally */}

      {/* Hero Section - Modern Creative Enhanced */}
      <section className="hero-modern" aria-labelledby="hero-title">
        <div className="hero-bg-shapes">
          <svg className="blob blob1" viewBox="0 0 320 320"><ellipse cx="160" cy="160" rx="160" ry="160" /></svg>
          <svg className="blob blob2" viewBox="0 0 220 220"><ellipse cx="110" cy="110" rx="110" ry="110" /></svg>
        </div>
        <div className="container hero-modern-container">
          <div className="hero-modern-content">
            <span className="hero-badge">{t("Empowering Rwanda's Next Generation")}</span>
            <h1 id="hero-title">
              {t('Learn From')} <span className="gradient-text">{t('Anywhere, Anytime.')}</span>
            </h1>
            <p className="hero-subtitle">
              {t('Inclusive, offline digital education for every youth—no matter where you live or what language you speak.')}
            </p>
            <div className="hero-cta-group">
              <Link to="/signup" className="btn btn-primary hero-cta">{t('Get Started')}</Link>
              <Link to="/login" className="btn btn-outline-primary hero-cta">{t('Explore Courses')}</Link>
            </div>
            <div className="hero-trusted">
              <span>{t('Trusted by')}</span>
              <img src={UNICEFLogo} alt="UNICEF" />
              <img src={RISALogo} alt="RISA" />
              <img src={UNHCRLogo} alt="UNHCR" />
              <img src={MineducLogo} alt="Ministry of Education" />
              <img src={AlightLogo} alt="Alight" />
            </div>
          </div>
          <div className="hero-modern-visual" data-aos="zoom-in">
            <div className="hero-glass-card">
              <img src={HeroIllustration} alt={t('Inclusive e-learning illustration')} />
              <button className="hero-play-btn" aria-label="Watch intro video">
                <i className="bi bi-play-circle"></i>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About/Mission Section */}
      <section className="section about" data-aos="fade-up" aria-labelledby="about-title">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-7">
              <h2 className="section-title" id="about-title">{t('Education Without Barriers')}</h2>
              <p className="section-subtitle">
                {t('TekRiders is dedicated to breaking down barriers for marginalized youth in Rwanda and beyond. Our mission is to provide accessible, offline, and multilingual digital learning—empowering every learner to reach their full potential, regardless of location, gender, or background.')}
              </p>
              <Link to="/login" className="btn btn-link px-0" aria-label={t('Learn more about TekRiders')}>{t('Learn More')}</Link>
            </div>
            <div className="col-md-5 text-center">
              <img src={AboutIllustration} alt={t('Mission illustration')} className="img-fluid" style={{maxHeight: 260, minHeight: 160, width: '90%', maxWidth: 340}} />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section features" data-aos="fade-up" aria-labelledby="features-title">
        <div className="container">
          <h2 className="section-title text-center mb-5" id="features-title">{t('Key Features')}</h2>
          <div className="row g-4">
            {features.map((feature, index) => (
              <div key={index} className="col-md-6 col-lg-4">
                <div className="feature-card h-100 text-center" data-aos="zoom-in" data-aos-delay={index * 100} tabIndex={0} aria-label={feature.title}>
                  <div className="icon-wrapper mx-auto mb-3">
                    <i className={`bi bi-${feature.icon}`}></i>
                  </div>
                  <h3 className="h5 mb-3">{feature.title}</h3>
                  <p className="mb-0">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact/Storytelling Section */}
      <section className="section testimonial" data-aos="fade-up" aria-labelledby="impact-title">
        <div className="container">
          <h2 className="section-title text-center mb-5" id="impact-title">{t('Transforming Lives, One Learner at a Time')}</h2>
          <div className="row justify-content-center">
            {stories.map((story, idx) => (
              <div className="col-md-4 mb-4" key={idx}>
                <div className="testimonial-card position-relative h-100 text-center p-4">
                  <i className="bi bi-quote quote-icon"></i>
                  <img src={story.avatar} alt={story.name + ' avatar'} className="rounded-circle mb-3" width="72" height="72" />
                  <blockquote className="blockquote mb-3">
                    <p className="mb-0">"{story.quote}"</p>
                  </blockquote>
                  <footer className="blockquote-footer">{story.name}, {story.location}</footer>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-3">
            <Link to="/stories" className="btn btn-outline-primary">{t('Share Your Story')}</Link>
          </div>
        </div>
      </section>

      {/* Courses Preview Section */}
      <section className="section features" data-aos="fade-up" aria-labelledby="courses-title">
        <div className="container">
          <h2 className="section-title text-center mb-5" id="courses-title">{t('Explore Our Courses')}</h2>
          <div className="row g-4">
            {courses.map((course, idx) => (
              <div className="col-md-6 col-lg-3" key={idx}>
                <div className="feature-card h-100 text-center p-3" tabIndex={0} aria-label={course.title}>
                  <div className="icon-wrapper mx-auto mb-3" style={{background: '#fff'}}>
                    <i className="bi bi-mortarboard"></i>
                  </div>
                  <h3 className="h6 mb-2">{course.title}</h3>
                  <div className="text-muted mb-2" style={{fontSize: '0.95rem'}}>{course.category}</div>
                  <p className="mb-2" style={{fontSize: '0.97rem'}}>{course.desc}</p>
                  <Link to="/login" className="btn btn-sm btn-outline-primary">{t('View Course')}</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners & Recognition Section */}
      <section className="section about" data-aos="fade-up" aria-labelledby="partners-title">
        <div className="container text-center">
          <h2 className="section-title mb-4" id="partners-title">{t('Proudly Supported By')}</h2>
          <div className="d-flex flex-wrap justify-content-center align-items-center gap-4">
            {partners.map((partner, idx) => (
              <div key={idx} className="bg-white rounded-3 shadow-sm p-3 d-flex align-items-center" style={{height: 70}} aria-label={partner.name}>
                <img src={partner.logo} alt={partner.name + ' logo'} style={{maxHeight: 40, maxWidth: 120}} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section cta" data-aos="fade-up" aria-labelledby="cta-title">
        <div className="container text-center">
          <h2 className="section-title" id="cta-title">{t('Ready to Start Your Journey?')}</h2>
          <p className="section-subtitle">
            {t('Join a movement of change-makers. Sign up, log in, or explore our courses to begin your learning adventure.')}
          </p>
          <div className="d-flex flex-wrap gap-3 justify-content-center mt-3">
            <Link to="/signup" className="btn btn-light d-flex align-items-center gap-2">
              <i className="bi bi-person-plus"></i> {t('Sign Up Now')}
            </Link>
            <Link to="/login" className="btn btn-outline-primary d-flex align-items-center gap-2">
              <i className="bi bi-box-arrow-in-right"></i> {t('Log In')}
            </Link>
            <Link to="/login" className="btn btn-outline-primary d-flex align-items-center gap-2">
              <i className="bi bi-mortarboard"></i> {t('Explore Courses')}
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home; 