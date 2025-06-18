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
import { useEffect, useState } from 'react';
import aminaImg from '../assets/amina.jpg';
import gateteImg from '../assets/gatete.avif';
import muhozaImg from '../assets/muhoza.avif';

const Home = () => {
  const { t } = useTranslation();
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  // Featured courses data matching the shared image
  const featuredCourses = [
    {
      title: t('IT Fundamentals'),
      desc: t('A beginner-friendly course introduces the essential skills needed to confidently use computers, smartphones, and the internet.'),
      badge: t('New'),
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80',
      rating: 4,
    },
    {
      title: t('Introduction to Programming'),
      desc: t('Introduces the world of programming and computational thinking. Explore how code powers everyday technology and practice writing simple programs using beginner-friendly tools.'),
      badge: t('Free'),
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80',
      rating: 4,
    },
    {
      title: t('Web Development for Beginners'),
      desc: t('Learn how to create your own website using HTML, CSS, and JavaScript, like personal blog, community page, and portfolio.'),
      badge: t('New'),
      image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80',
      rating: 4,
    },
    {
      title: t('Introduction to AI and ChatGPT'),
      desc: t('Designed to make AI approachable, explores what artificial intelligence is, how it\'s used in real life, and how to interact with tools like ChatGPT.'),
      badge: t('New'),
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
      rating: 2,
    },
    {
      title: t('Tech for Business & Entrepreneurship'),
      desc: t('From creating documents and presentations, explore tools that help you to become a digital entrepreneur.'),
      badge: t('Free'),
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80',
      rating: 3,
    },
    {
      title: t('Graphic Design Basics with Canva'),
      desc: t('Helps students express their creativity and build visual communication skills using Canva — a free, easy-to-use design tool.'),
      badge: t('Free'),
      image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80',
      rating: 2,
    },
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
      <section className="hero-modern" aria-labelledby="hero-title" style={{padding: '7rem 0 4rem 0', minHeight: '85vh'}}>
        <div className="hero-bg-shapes">
          <svg className="blob blob1" viewBox="0 0 320 320"><ellipse cx="160" cy="160" rx="160" ry="160" /></svg>
          <svg className="blob blob2" viewBox="0 0 220 220"><ellipse cx="110" cy="110" rx="110" ry="110" /></svg>
        </div>
        <div className="container hero-modern-container">
          <div className="row align-items-center">
            <div className="col-12 col-lg-6 mb-4 mb-lg-0">
              <h1 id="hero-title" className="display-4 fw-bold mb-4" style={{color: '#399ff7', lineHeight: 1.08, fontFamily: 'Inter, sans-serif', letterSpacing: '-2px'}}>
                {t('Learn Modern')}<br/>
                <span style={{color: '#FAB500', fontWeight: 900}}>{t('Digital')}</span> {t('Skills In')}<br/>
                {t('Kinyarwanda.')}
              </h1>
              <p className="lead mb-4" style={{color: '#222', fontWeight: 500, letterSpacing: '-0.5px', whiteSpace: 'pre-line'}}>
                {t('Inclusive, offline digital education for every youth in Rwanda, Burundi and DRC — no matter where you live or what language you speak.')}
                <br/>
                {t('Empower yourself with practical skills for the digital world.')}
              </p>
              <div className="d-flex flex-wrap gap-3 mb-5" style={{marginTop: '2rem'}}>
                <Link to="/signup" className="btn btn-primary hero-cta fw-bold px-4 py-3">{t('Get Started')}</Link>
                <Link to="/login" className="btn btn-outline-primary hero-cta fw-bold px-4 py-3">{t('Explore Courses')}</Link>
              </div>
            </div>
            <div className="col-12 col-lg-6 text-center">
              <img src={HeroIllustration} alt={t('Inclusive e-learning illustration')} className="img-fluid" style={{maxWidth: 420, width: '100%', height: 'auto'}} />
            </div>
          </div>
        </div>
      </section>

      {/* About/Mission Section */}
      <section className="section about" data-aos="fade-up" aria-labelledby="about-title" style={{padding: '7rem 0 7rem 0', background: '#fff', position: 'relative'}}>
        {/* Optional faint yellow blob for visual interest */}
        <div style={{position: 'absolute', top: '-60px', left: '-80px', width: 260, height: 180, background: 'radial-gradient(circle, #ffe9b3 0%, transparent 70%)', opacity: 0.25, zIndex: 1, borderRadius: '50%'}}></div>
        <div className="container" style={{position: 'relative', zIndex: 2}}>
          <div className="row align-items-center justify-content-center">
            <div className="col-md-7">
              <div style={{background: '#fff', borderRadius: 24, boxShadow: '0 4px 32px rgba(56, 189, 248, 0.10)', padding: '2.5rem 2.2rem 2.2rem 2.2rem', position: 'relative', zIndex: 2, borderTop: '6px solid #399ff7'}}>
                <div className="d-flex align-items-center mb-3">
                  <span style={{display: 'inline-block', width: 8, height: 36, borderRadius: 6, background: '#399ff7', marginRight: 16}}></span>
                  <h2 className="section-title mb-0" id="about-title" style={{color: '#399ff7', fontWeight: 800, fontSize: '2.1rem', letterSpacing: '-1px'}}>{t('Education Without Barriers')}</h2>
                </div>
                <p className="section-subtitle" style={{fontSize: '1.13rem', color: '#444', marginBottom: '2.2rem', fontWeight: 500, lineHeight: 1.6}}>
                  {t('TekRiders is dedicated to breaking down barriers for marginalized youth in Rwanda and beyond. Our mission is to provide accessible, offline, and multilingual digital learning—empowering every learner to reach their full potential, regardless of location, gender, or background.')}
                </p>
                <Link to="/login" className="btn btn-primary px-4 py-2" aria-label={t('Learn more about TekRiders')} style={{fontWeight: 700, fontSize: '1.08rem', borderRadius: 10}}>{t('Learn More')}</Link>
              </div>
            </div>
            <div className="col-md-5 text-center" style={{position: 'relative', zIndex: 3}}>
              <img src={AboutIllustration} alt={t('Mission illustration')} className="img-fluid" style={{maxHeight: 300, minHeight: 160, width: '95%', maxWidth: 360, marginTop: '-2.5rem', boxShadow: '0 8px 32px rgba(56, 189, 248, 0.10)', borderRadius: 20, position: 'relative', right: '-18px'}} />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section (moved up) */}
      <section id="courses-section" className="section features" data-aos="fade-up" aria-labelledby="courses-title" style={{padding: '7rem 0 7rem 0', marginTop: 0}}>
        <div className="container">
          <h2 className="section-title text-left mb-5" id="courses-title" style={{color: '#399ff7', fontWeight: 700, fontSize: '2.2rem', marginBottom: '3rem'}}>{t('Featured Courses')}</h2>
          <div className="row g-5">
            {featuredCourses.map((course, idx) => {
              const isTop = idx < 3;
              return (
                <div className="col-lg-4 col-md-6" key={idx}>
                  <div
                    className="feature-card h-100 text-left p-0"
                    tabIndex={0}
                    aria-label={course.title}
                    style={{
                      background: isTop ? '#399ff7' : '#fff',
                      border: isTop ? '2px solid #399ff7' : '2px solid #399ff7',
                      borderRadius: 18,
                      boxShadow: isTop ? '0 4px 24px rgba(56, 159, 247, 0.13)' : 'none',
                      transition: 'box-shadow 0.2s, transform 0.2s',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      minHeight: 370,
                      maxWidth: 340,
                      margin: '0 auto',
                    }}
                  >
                    <div style={{position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden', borderTopLeftRadius: 14, borderTopRightRadius: 14}}>
                      {/* Badge */}
                      <span style={{
                        position: 'absolute',
                        top: 16,
                        left: 16,
                        background: course.badge === 'New' ? '#FAB500' : '#ff6f00',
                        color: '#fff',
                        fontWeight: 700,
                        borderRadius: 10,
                        padding: '0.38rem 1.1rem',
                        fontSize: 16,
                        boxShadow: '0 2px 8px rgba(56,159,247,0.13)',
                        zIndex: 2,
                        letterSpacing: '0.01em',
                      }}>{course.badge}</span>
                      <img
                        src={course.image}
                        alt={course.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderTopLeftRadius: 14,
                          borderTopRightRadius: 14,
                          display: 'block',
                          transition: 'transform 0.2s',
                        }}
                      />
                    </div>
                    <div style={{padding: '2rem 1.5rem 1.2rem 1.5rem', flex: 1, display: 'flex', flexDirection: 'column'}}>
                      <h3 className="h5 mb-2" style={{fontWeight: 800, color: isTop ? '#fff' : '#399ff7', fontSize: '1.18rem', marginBottom: 8, lineHeight: 1.25}}>{course.title}</h3>
                      <p className="mb-2" style={{fontSize: '0.97rem', color: isTop ? '#e6f6fc' : '#444', minHeight: 48, marginBottom: 0, fontWeight: 500, lineHeight: 1.45}}>{course.desc}</p>
                      <div style={{flex: 1}}></div>
                      <Link
                        to="/login"
                        className={isTop ? 'btn btn-light w-100 mb-2' : 'btn btn-primary w-100 mb-2'}
                        style={{
                          fontWeight: 700,
                          fontSize: '1.05rem',
                          borderRadius: 10,
                          padding: '0.7rem 0',
                          color: isTop ? '#399ff7' : '#fff',
                          background: isTop ? '#fff' : '#399ff7',
                          border: isTop ? 'none' : undefined,
                        }}
                      >
                        Enroll Now
                      </Link>
                      {/* Rating */}
                      <div style={{color: isTop ? '#FAB500' : '#399ff7', fontSize: 18, letterSpacing: 2, marginTop: 0}}>
                        {'★'.repeat(course.rating)}<span style={{color: '#bbb'}}>{'★'.repeat(5-course.rating)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 text-left">
            <Link to="/signup" className="btn btn-outline-warning btn-sm px-3 py-2" style={{fontWeight: 700, color: '#FAB500', borderColor: '#FAB500', background: '#fff', fontSize: '1rem'}}>Explore More Courses</Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section features" data-aos="fade-up" aria-labelledby="features-title" style={{padding: '7rem 0 7rem 0', marginTop: 0}}>
        <div className="container">
          <h2 className="section-title text-left mb-5" id="features-title" style={{color: '#399ff7', fontWeight: 700, fontSize: '2.2rem', marginTop: 0}}>{t('Key Features')}</h2>
          <div className="row g-5">
            {features.map((feature, index) => (
              <div key={index} className="col-md-6 col-lg-4">
                <div
                  className="feature-card h-100 text-left"
                  data-aos="zoom-in"
                  data-aos-delay={index * 100}
                  tabIndex={0}
                  aria-label={feature.title}
                  style={{
                    background: '#fff',
                    border: '2px solid #399ff7',
                    borderRadius: 18,
                    boxShadow: '0 4px 24px rgba(56, 159, 247, 0.08)',
                    padding: '2.2rem 1.5rem 1.5rem 1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    minHeight: 260,
                  }}
                >
                  <div className="icon-wrapper mb-3 d-flex align-items-center justify-content-center" style={{background: '#e6f6fc', borderRadius: 12, width: 56, height: 56, marginBottom: 18}}>
                    <i className={`bi bi-${feature.icon}`} style={{fontSize: 28, color: '#399ff7'}}></i>
                  </div>
                  <h3 className="h5 mb-2" style={{fontWeight: 700, color: '#399ff7', fontSize: '1.18rem', marginBottom: 8, lineHeight: 1.25}}>{feature.title}</h3>
                  <p className="mb-0" style={{fontSize: '1rem', color: '#444', fontWeight: 500, lineHeight: 1.5}}>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section testimonial" aria-labelledby="impact-title" style={{background: '#e6f6fc', borderRadius: 0, boxShadow: 'none', padding: '7rem 0 7rem 0', marginBottom: 0}}>
        <div className="container">
          <h2 className="section-title text-left" id="impact-title" style={{color: '#2997f7', fontWeight: 800, fontSize: '2.5rem', marginBottom: '3.5rem', fontFamily: 'Inter, sans-serif', letterSpacing: '-1px', textAlign: 'left'}}>{t('Transforming Lives, One Learner at a Time')}</h2>
          <div className="row justify-content-center" style={{gap: '2.5rem', display: 'flex', flexWrap: 'nowrap'}}>
            {/* Card 1 */}
            <div className="col" style={{flex: 1, minWidth: 320, maxWidth: 390}}>
              <div style={{background: '#fff', borderRadius: 16, boxShadow: '0 8px 32px rgba(56, 189, 248, 0.10)', padding: '2.5rem 2.2rem 2.2rem 2.2rem', position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                <span style={{fontSize: '3.5rem', color: '#e6f6fc', position: 'absolute', top: 28, left: 28, fontWeight: 900, lineHeight: 1}}>&ldquo;</span>
                <div style={{marginTop: 16, marginBottom: 24, minHeight: 80, color: '#222', fontSize: '1.08rem', fontWeight: 500, letterSpacing: '-0.2px'}}>
                  {t('I never thought I could learn without internet. Now I help others in my village.')}
                </div>
                <div style={{marginBottom: 18}}>
                  <span style={{color: '#1ec773', fontSize: 22, marginRight: 2}}>&#9733;&#9733;&#9733;&#9733;</span><span style={{color: '#d3d3d3', fontSize: 22}}>&#9733;</span>
                </div>
                <hr style={{border: 'none', borderTop: '1.5px solid #f2eaea', margin: '0 0 18px 0'}} />
                <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
                  <img src={aminaImg} alt="Amina Iradukunda" style={{width: 54, height: 54, borderRadius: '50%', objectFit: 'cover', border: '3px solid #e6f6fc'}} />
                  <div>
                    <div style={{fontWeight: 700, fontSize: '1.08rem', color: '#222'}}>Amina Iradukunda</div>
                    <div style={{fontSize: '0.98rem', color: '#888'}}>Learner, Gatsibo</div>
                  </div>
                </div>
              </div>
            </div>
            {/* Card 2 */}
            <div className="col" style={{flex: 1, minWidth: 320, maxWidth: 390}}>
              <div style={{background: '#fff', borderRadius: 16, boxShadow: '0 8px 32px rgba(56, 189, 248, 0.10)', padding: '2.5rem 2.2rem 2.2rem 2.2rem', position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                <span style={{fontSize: '3.5rem', color: '#e6f6fc', position: 'absolute', top: 28, left: 28, fontWeight: 900, lineHeight: 1}}>&ldquo;</span>
                <div style={{marginTop: 16, marginBottom: 24, minHeight: 80, color: '#222', fontSize: '1.08rem', fontWeight: 500, letterSpacing: '-0.2px'}}>
                  {t('Learning in Kinyarwanda made everything easier for me.')}
                </div>
                <div style={{marginBottom: 18}}>
                  <span style={{color: '#1ec773', fontSize: 22, marginRight: 2}}>&#9733;&#9733;&#9733;&#9733;</span><span style={{color: '#d3d3d3', fontSize: 22}}>&#9733;</span>
                </div>
                <hr style={{border: 'none', borderTop: '1.5px solid #f2eaea', margin: '0 0 18px 0'}} />
                <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
                  <img src={gateteImg} alt="Jean Gatete" style={{width: 54, height: 54, borderRadius: '50%', objectFit: 'cover', border: '3px solid #e6f6fc'}} />
                  <div>
                    <div style={{fontWeight: 700, fontSize: '1.08rem', color: '#222'}}>Jean Gatete</div>
                    <div style={{fontSize: '0.98rem', color: '#888'}}>Learner, Rubavu</div>
                  </div>
                </div>
              </div>
            </div>
            {/* Card 3 */}
            <div className="col" style={{flex: 1, minWidth: 320, maxWidth: 390}}>
              <div style={{background: '#fff', borderRadius: 16, boxShadow: '0 8px 32px rgba(56, 189, 248, 0.10)', padding: '2.5rem 2.2rem 2.2rem 2.2rem', position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                <span style={{fontSize: '3.5rem', color: '#e6f6fc', position: 'absolute', top: 28, left: 28, fontWeight: 900, lineHeight: 1}}>&ldquo;</span>
                <div style={{marginTop: 16, marginBottom: 24, minHeight: 80, color: '#222', fontSize: '1.08rem', fontWeight: 500, letterSpacing: '-0.2px'}}>
                  {t('The community support and mentorship changed my life.')}
                </div>
                <div style={{marginBottom: 18}}>
                  <span style={{color: '#1ec773', fontSize: 22, marginRight: 2}}>&#9733;&#9733;&#9733;&#9733;</span><span style={{color: '#d3d3d3', fontSize: 22}}>&#9733;</span>
                </div>
                <hr style={{border: 'none', borderTop: '1.5px solid #f2eaea', margin: '0 0 18px 0'}} />
                <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
                  <img src={muhozaImg} alt="Ninnette muhoza" style={{width: 54, height: 54, borderRadius: '50%', objectFit: 'cover', border: '3px solid #e6f6fc'}} />
                  <div>
                    <div style={{fontWeight: 700, fontSize: '1.08rem', color: '#222'}}>Ninnette muhoza</div>
                    <div style={{fontSize: '0.98rem', color: '#888'}}>Learner, Huye</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-start" style={{marginTop: '3.5rem'}}>
            <Link to="/login" className="btn" style={{border: '2px solid #2997f7', color: '#2997f7', fontWeight: 600, fontSize: '1.35rem', borderRadius: 10, padding: '0.7rem 2.5rem', background: 'none', boxShadow: 'none', outline: 'none', transition: 'background 0.2s, color 0.2s'}}>
              {t('Share Your Story')}
            </Link>
          </div>
        </div>
      </section>

      {/* Partners & Recognition Section */}
      <section className="section sponsors" aria-labelledby="partners-title" style={{background: 'transparent', borderRadius: 0, boxShadow: 'none', padding: '6rem 0 7rem 0', marginBottom: 0}}>
        <div className="container">
          <h2 className="section-title text-left" id="partners-title" style={{color: '#2997f7', fontWeight: 800, fontSize: '2.5rem', marginBottom: '3.5rem', fontFamily: 'Inter, sans-serif', letterSpacing: '-1px', textAlign: 'left'}}>{t('Proudly Supported By')}</h2>
          <div style={{borderRadius: 0, padding: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem', boxShadow: 'none', flexWrap: 'nowrap', background: 'transparent', overflowX: 'auto'}}>
            {/* UNICEF */}
            <div style={{background: '#fff', borderRadius: 18, boxShadow: '0 6px 24px rgba(56, 189, 248, 0.10)', padding: '1.7rem 2.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 150, maxWidth: 170, minHeight: 90, maxHeight: 100}}>
              <img src={UNICEFLogo} alt="UNICEF logo" style={{maxHeight: 40, maxWidth: 100, objectFit: 'contain'}} />
            </div>
            {/* RISA */}
            <div style={{background: '#fff', borderRadius: 18, boxShadow: '0 6px 24px rgba(56, 189, 248, 0.10)', padding: '1.7rem 2.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 170, maxWidth: 190, minHeight: 90, maxHeight: 100}}>
              <img src={RISALogo} alt="RISA logo" style={{maxHeight: 40, maxWidth: 130, objectFit: 'contain'}} />
            </div>
            {/* UNHCR */}
            <div style={{background: '#fff', borderRadius: 18, boxShadow: '0 6px 24px rgba(56, 189, 248, 0.10)', padding: '1.7rem 2.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 150, maxWidth: 170, minHeight: 90, maxHeight: 100}}>
              <img src={UNHCRLogo} alt="UNHCR logo" style={{maxHeight: 40, maxWidth: 100, objectFit: 'contain'}} />
            </div>
            {/* MINEDUC */}
            <div style={{background: '#fff', borderRadius: 18, boxShadow: '0 6px 24px rgba(56, 189, 248, 0.10)', padding: '1.7rem 2.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 110, maxWidth: 120, minHeight: 90, maxHeight: 100}}>
              <img src={MineducLogo} alt="MINEDUC logo" style={{maxHeight: 40, maxWidth: 60, objectFit: 'contain'}} />
            </div>
            {/* ALIGHT */}
            <div style={{background: '#fff', borderRadius: 18, boxShadow: '0 6px 24px rgba(56, 189, 248, 0.10)', padding: '1.7rem 2.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 170, maxWidth: 190, minHeight: 90, maxHeight: 100}}>
              <img src={AlightLogo} alt="ALIGHT logo" style={{maxHeight: 40, maxWidth: 130, objectFit: 'contain'}} />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section cta" aria-labelledby="cta-title" style={{background: '#38a6f7', borderRadius: 0, boxShadow: 'none', padding: '5.5rem 0 5.5rem 0', marginBottom: 0}}>
        <style>{`
          .cta-btn {
            transition: all 0.22s cubic-bezier(.4,1.3,.5,1), box-shadow 0.22s;
            will-change: transform, box-shadow, background, color;
          }
          .cta-btn.cta-btn-filled:hover {
            box-shadow: 0 8px 32px rgba(56, 189, 248, 0.18);
            transform: translateY(-5px) scale(1.04);
            background: #e6f6fc !important;
            color: #38a6f7 !important;
          }
          .cta-btn.cta-btn-outline:hover {
            background: #fff !important;
            color: #38a6f7 !important;
            box-shadow: 0 8px 32px rgba(56, 189, 248, 0.18);
            transform: translateY(-5px) scale(1.04);
            border-color: #fff !important;
          }
        `}</style>
        <div className="container" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2.5rem', flexWrap: 'wrap'}}>
          {/* Left: Text and Buttons */}
          <div style={{flex: '1 1 480px', minWidth: 320, maxWidth: 600}}>
            <h2 className="section-title" id="cta-title" style={{color: '#fff', fontWeight: 800, fontSize: '2.35rem', marginBottom: '2.2rem', fontFamily: 'Inter, sans-serif', letterSpacing: '-1px', textAlign: 'left', lineHeight: 1.08, whiteSpace: 'nowrap'}}>{t('Ready to Start Your Journey?')}</h2>
            <p className="section-subtitle" style={{color: '#fff', fontSize: '1.25rem', marginBottom: '2.8rem', textAlign: 'left', fontWeight: 500, lineHeight: 1.5, maxWidth: 540}}>
              {t('Join a movement of change-makers. Register, log in, or explore our courses to begin your learning adventure.')}
            </p>
            <div style={{display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center'}}>
              <Link to="/signup" className="btn cta-btn cta-btn-filled" style={{background: '#fff', color: '#38a6f7', fontWeight: 700, fontSize: '0.98rem', borderRadius: 7, padding: '0.5rem 1.2rem', border: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem', boxShadow: '0 2px 8px rgba(56, 189, 248, 0.10)'}}>
                <i className="bi bi-person-circle" style={{fontSize: '1.1rem'}}></i> {t('Register')}
              </Link>
              <Link to="/login" className="btn cta-btn cta-btn-outline" style={{background: 'none', color: '#fff', fontWeight: 700, fontSize: '0.98rem', borderRadius: 7, padding: '0.5rem 1.2rem', border: '1.5px solid #fff', display: 'flex', alignItems: 'center', gap: '0.4rem'}}>
                <i className="bi bi-arrow-right" style={{fontSize: '1.1rem'}}></i> {t('Log In')}
              </Link>
              <Link to="/login" className="btn cta-btn cta-btn-outline" style={{background: 'none', color: '#fff', fontWeight: 700, fontSize: '0.98rem', borderRadius: 7, padding: '0.5rem 1.2rem', border: '1.5px solid #fff', display: 'flex', alignItems: 'center', gap: '0.4rem'}}>
                <i className="bi bi-journal-bookmark" style={{fontSize: '1.1rem'}}></i> {t('Explore Courses')}
              </Link>
            </div>
          </div>
          {/* Right: Illustration */}
          <div style={{flex: '1 1 380px', minWidth: 260, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <img src={AboutIllustration} alt="Learning illustration" style={{maxWidth: 340, width: '100%', height: 'auto', display: 'block'}} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={handleBackToTop}
          aria-label={t('Back to top')}
          style={{
            position: 'fixed',
            bottom: 36,
            right: 36,
            zIndex: 9999,
            background: '#399ff7',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: 56,
            height: 56,
            boxShadow: '0 4px 16px rgba(56, 159, 247, 0.18)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 28,
            cursor: 'pointer',
            transition: 'background 0.2s, box-shadow 0.2s',
          }}
        >
          <span style={{fontWeight: 900, fontSize: 32, lineHeight: 1}}>&uarr;</span>
        </button>
      )}
    </div>
  );
};

export default Home; 