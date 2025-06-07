import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiEdit2, FiAward, FiBook, FiClock, FiStar, FiSettings } from 'react-icons/fi';

const UserProfile = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - replace with API call
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://ui-avatars.com/api/?name=John+Doe&size=200',
    role: 'Student',
    joinDate: 'January 2024',
    bio: 'Passionate about learning and technology. Currently focusing on web development and programming.',
    stats: {
      coursesEnrolled: 5,
      coursesCompleted: 3,
      certificatesEarned: 2,
      totalPoints: 1500
    },
    achievements: [
      {
        id: 1,
        title: 'Quick Learner',
        description: 'Completed 3 courses in one week',
        icon: '🚀',
        date: '2 days ago'
      },
      {
        id: 2,
        title: 'Perfect Score',
        description: 'Got 100% on a quiz',
        icon: '⭐',
        date: '1 week ago'
      }
    ],
    enrolledCourses: [
      {
        id: 1,
        title: 'Introduction to Programming',
        progress: 75,
        lastAccessed: '2 hours ago',
        thumbnail: 'https://picsum.photos/300/200'
      },
      {
        id: 2,
        title: 'Web Development Fundamentals',
        progress: 30,
        lastAccessed: '1 day ago',
        thumbnail: 'https://picsum.photos/300/200'
      }
    ],
    certificates: [
      {
        id: 1,
        title: 'Python Programming',
        issueDate: 'January 15, 2024',
        issuer: 'TekRiders Academy'
      },
      {
        id: 2,
        title: 'Web Development Basics',
        issueDate: 'February 1, 2024',
        issuer: 'TekRiders Academy'
      }
    ]
  };

  const TabButton = ({ icon: Icon, label, active, onClick }) => (
    <button
      className={`btn ${active ? 'btn-primary' : 'btn-outline-primary'} me-2`}
      onClick={onClick}
    >
      <Icon className="me-2" />
      {label}
    </button>
  );

  const StatCard = ({ icon: Icon, value, label }) => (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body text-center">
        <Icon className="display-4 text-primary mb-3" />
        <h3>{value}</h3>
        <p className="text-muted mb-0">{label}</p>
      </div>
    </div>
  );

  const CourseCard = ({ course }) => (
    <motion.div
      whileHover={{ y: -5 }}
      className="card border-0 shadow-sm mb-3"
    >
      <div className="row g-0">
        <div className="col-md-4">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="img-fluid rounded-start h-100"
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div className="col-md-8">
          <div className="card-body">
            <h5 className="card-title">{course.title}</h5>
            <div className="mb-3">
              <div className="progress" style={{ height: 6 }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
              <small className="text-muted">
                {course.progress}% {t('complete')}
              </small>
            </div>
            <p className="text-muted small mb-0">
              {t('Last accessed')}: {course.lastAccessed}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const CertificateCard = ({ certificate }) => (
    <motion.div
      whileHover={{ y: -5 }}
      className="card border-0 shadow-sm mb-3"
    >
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h5 className="mb-1">{certificate.title}</h5>
            <p className="text-muted small mb-0">
              {t('Issued by')}: {certificate.issuer}
            </p>
            <p className="text-muted small mb-0">
              {t('Date')}: {certificate.issueDate}
            </p>
          </div>
          <button className="btn btn-outline-primary">
            {t('View')}
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="container py-4">
      {/* Profile Header */}
      <div className="row mb-4">
        <div className="col-md-3 text-center">
          <img
            src={user.avatar}
            alt={user.name}
            className="rounded-circle mb-3"
            style={{ width: 200, height: 200, objectFit: 'cover' }}
          />
          <button className="btn btn-outline-primary">
            <FiEdit2 className="me-2" />
            {t('Edit Profile')}
          </button>
        </div>
        <div className="col-md-9">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h2 className="mb-1">{user.name}</h2>
              <p className="text-muted mb-2">{user.role}</p>
              <p className="mb-3">{user.bio}</p>
              <div className="d-flex gap-3">
                <div>
                  <FiClock className="me-2" />
                  {t('Joined')} {user.joinDate}
                </div>
                <div>
                  <FiStar className="me-2" />
                  {user.stats.totalPoints} {t('points')}
                </div>
              </div>
            </div>
            <button className="btn btn-outline-primary">
              <FiSettings className="me-2" />
              {t('Settings')}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <StatCard
            icon={FiBook}
            value={user.stats.coursesEnrolled}
            label={t('Courses Enrolled')}
          />
        </div>
        <div className="col-md-3">
          <StatCard
            icon={FiAward}
            value={user.stats.coursesCompleted}
            label={t('Courses Completed')}
          />
        </div>
        <div className="col-md-3">
          <StatCard
            icon={FiStar}
            value={user.stats.certificatesEarned}
            label={t('Certificates')}
          />
        </div>
        <div className="col-md-3">
          <StatCard
            icon={FiAward}
            value={user.stats.totalPoints}
            label={t('Total Points')}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-4">
        <TabButton
          icon={FiBook}
          label={t('Overview')}
          active={activeTab === 'overview'}
          onClick={() => setActiveTab('overview')}
        />
        <TabButton
          icon={FiAward}
          label={t('Achievements')}
          active={activeTab === 'achievements'}
          onClick={() => setActiveTab('achievements')}
        />
        <TabButton
          icon={FiStar}
          label={t('Certificates')}
          active={activeTab === 'certificates'}
          onClick={() => setActiveTab('certificates')}
        />
      </div>

      {/* Content */}
      {activeTab === 'overview' && (
        <div>
          <h4 className="mb-4">{t('Enrolled Courses')}</h4>
          {user.enrolledCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}

      {activeTab === 'achievements' && (
        <div>
          <h4 className="mb-4">{t('Recent Achievements')}</h4>
          {user.achievements.map(achievement => (
            <motion.div
              key={achievement.id}
              whileHover={{ y: -5 }}
              className="card border-0 shadow-sm mb-3"
            >
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="display-4 me-3">{achievement.icon}</div>
                  <div>
                    <h5 className="mb-1">{achievement.title}</h5>
                    <p className="text-muted small mb-0">
                      {achievement.description}
                    </p>
                    <small className="text-muted">
                      {achievement.date}
                    </small>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'certificates' && (
        <div>
          <h4 className="mb-4">{t('Certificates')}</h4>
          {user.certificates.map(certificate => (
            <CertificateCard key={certificate.id} certificate={certificate} />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserProfile; 