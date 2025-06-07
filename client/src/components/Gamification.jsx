import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiAward, FiStar, FiUsers, FiTrendingUp } from 'react-icons/fi';

const Gamification = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('achievements');

  // Mock data - replace with API call
  const achievements = [
    {
      id: 1,
      title: t('First Course Completed'),
      description: t('Complete your first course'),
      icon: '🎓',
      progress: 100,
      completed: true,
      points: 100
    },
    {
      id: 2,
      title: t('Perfect Score'),
      description: t('Get 100% on any quiz'),
      icon: '⭐',
      progress: 0,
      completed: false,
      points: 200
    },
    {
      id: 3,
      title: t('Helpful Student'),
      description: t('Answer 5 questions in the forum'),
      icon: '🤝',
      progress: 60,
      completed: false,
      points: 150
    }
  ];

  const badges = [
    {
      id: 1,
      title: t('Quick Learner'),
      description: t('Complete 3 courses in one week'),
      icon: '🚀',
      unlocked: true
    },
    {
      id: 2,
      title: t('Team Player'),
      description: t('Participate in 5 group discussions'),
      icon: '👥',
      unlocked: false
    },
    {
      id: 3,
      title: t('Night Owl'),
      description: t('Study for 5 hours after 8 PM'),
      icon: '🌙',
      unlocked: false
    }
  ];

  const leaderboard = [
    {
      id: 1,
      name: 'John Doe',
      points: 2500,
      rank: 1,
      avatar: 'https://ui-avatars.com/api/?name=John+Doe'
    },
    {
      id: 2,
      name: 'Jane Smith',
      points: 2300,
      rank: 2,
      avatar: 'https://ui-avatars.com/api/?name=Jane+Smith'
    },
    {
      id: 3,
      name: 'Bob Johnson',
      points: 2100,
      rank: 3,
      avatar: 'https://ui-avatars.com/api/?name=Bob+Johnson'
    }
  ];

  const stats = {
    totalPoints: 1500,
    rank: 4,
    coursesCompleted: 5,
    badgesEarned: 3
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

  const AchievementCard = ({ achievement }) => (
    <motion.div
      whileHover={{ y: -5 }}
      className="card border-0 shadow-sm mb-3"
    >
      <div className="card-body">
        <div className="d-flex align-items-center mb-3">
          <div className="display-4 me-3">{achievement.icon}</div>
          <div>
            <h5 className="mb-1">{achievement.title}</h5>
            <p className="text-muted small mb-0">{achievement.description}</p>
          </div>
        </div>
        <div className="progress mb-2" style={{ height: 6 }}>
          <div
            className="progress-bar"
            role="progressbar"
            style={{ width: `${achievement.progress}%` }}
          />
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <small className="text-muted">
            {achievement.progress}% {t('complete')}
          </small>
          <span className="badge bg-primary">
            {achievement.points} {t('points')}
          </span>
        </div>
      </div>
    </motion.div>
  );

  const BadgeCard = ({ badge }) => (
    <motion.div
      whileHover={{ y: -5 }}
      className="card border-0 shadow-sm mb-3"
    >
      <div className="card-body">
        <div className="d-flex align-items-center">
          <div className="display-4 me-3">{badge.icon}</div>
          <div>
            <h5 className="mb-1">{badge.title}</h5>
            <p className="text-muted small mb-0">{badge.description}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const LeaderboardCard = ({ user }) => (
    <motion.div
      whileHover={{ y: -5 }}
      className="card border-0 shadow-sm mb-3"
    >
      <div className="card-body">
        <div className="d-flex align-items-center">
          <div className="position-relative me-3">
            <img
              src={user.avatar}
              alt={user.name}
              className="rounded-circle"
              style={{ width: 50, height: 50 }}
            />
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary">
              #{user.rank}
            </span>
          </div>
          <div className="flex-grow-1">
            <h5 className="mb-1">{user.name}</h5>
            <div className="d-flex align-items-center">
              <FiStar className="text-warning me-1" />
              <span>{user.points} {t('points')}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="container py-4">
      {/* Stats Overview */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <FiAward className="display-4 text-primary mb-3" />
              <h3>{stats.totalPoints}</h3>
              <p className="text-muted mb-0">{t('Total Points')}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <FiTrendingUp className="display-4 text-primary mb-3" />
              <h3>#{stats.rank}</h3>
              <p className="text-muted mb-0">{t('Your Rank')}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <FiStar className="display-4 text-primary mb-3" />
              <h3>{stats.coursesCompleted}</h3>
              <p className="text-muted mb-0">{t('Courses Completed')}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <FiUsers className="display-4 text-primary mb-3" />
              <h3>{stats.badgesEarned}</h3>
              <p className="text-muted mb-0">{t('Badges Earned')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-4">
        <TabButton
          icon={FiAward}
          label={t('Achievements')}
          active={activeTab === 'achievements'}
          onClick={() => setActiveTab('achievements')}
        />
        <TabButton
          icon={FiStar}
          label={t('Badges')}
          active={activeTab === 'badges'}
          onClick={() => setActiveTab('badges')}
        />
        <TabButton
          icon={FiUsers}
          label={t('Leaderboard')}
          active={activeTab === 'leaderboard'}
          onClick={() => setActiveTab('leaderboard')}
        />
      </div>

      {/* Content */}
      <div className="row">
        <div className="col-md-8">
          {activeTab === 'achievements' && (
            <div>
              {achievements.map(achievement => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
            </div>
          )}
          {activeTab === 'badges' && (
            <div>
              {badges.map(badge => (
                <BadgeCard key={badge.id} badge={badge} />
              ))}
            </div>
          )}
          {activeTab === 'leaderboard' && (
            <div>
              {leaderboard.map(user => (
                <LeaderboardCard key={user.id} user={user} />
              ))}
            </div>
          )}
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0">{t('Your Progress')}</h5>
            </div>
            <div className="card-body">
              <div className="mb-4">
                <h6 className="text-muted mb-2">{t('Next Level')}</h6>
                <div className="progress mb-2" style={{ height: 6 }}>
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: '75%' }}
                  />
                </div>
                <small className="text-muted">
                  750/1000 {t('points to level up')}
                </small>
              </div>
              <div>
                <h6 className="text-muted mb-2">{t('Recent Activity')}</h6>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <small className="text-muted">2 hours ago</small>
                    <p className="mb-0">{t('Completed Introduction to Programming')}</p>
                  </li>
                  <li className="mb-2">
                    <small className="text-muted">1 day ago</small>
                    <p className="mb-0">{t('Earned Quick Learner badge')}</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gamification; 