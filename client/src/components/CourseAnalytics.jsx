import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiUsers, FiTrendingUp, FiDollarSign, FiStar, FiClock, FiAward } from 'react-icons/fi';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const CourseAnalytics = () => {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState('week');

  // Mock data - replace with API call
  const course = {
    title: 'Introduction to Programming',
    instructor: 'John Doe',
    stats: {
      totalEnrollments: 1250,
      activeStudents: 850,
      completionRate: 68,
      averageRating: 4.5,
      totalRevenue: 12500,
      averageCompletionTime: '4.5 hours'
    },
    enrollmentData: [
      { date: '2024-01-01', enrollments: 120 },
      { date: '2024-01-08', enrollments: 150 },
      { date: '2024-01-15', enrollments: 180 },
      { date: '2024-01-22', enrollments: 200 },
      { date: '2024-01-29', enrollments: 250 }
    ],
    revenueData: [
      { date: '2024-01-01', revenue: 1200 },
      { date: '2024-01-08', revenue: 1500 },
      { date: '2024-01-15', revenue: 1800 },
      { date: '2024-01-22', revenue: 2000 },
      { date: '2024-01-29', revenue: 2500 }
    ],
    studentDemographics: [
      { name: '18-24', value: 35 },
      { name: '25-34', value: 45 },
      { name: '35-44', value: 15 },
      { name: '45+', value: 5 }
    ],
    topPerformingLessons: [
      {
        title: 'Variables and Data Types',
        completionRate: 95,
        averageScore: 92,
        studentCount: 850
      },
      {
        title: 'Control Flow',
        completionRate: 88,
        averageScore: 85,
        studentCount: 780
      },
      {
        title: 'Functions',
        completionRate: 82,
        averageScore: 80,
        studentCount: 720
      }
    ],
    studentFeedback: [
      {
        rating: 5,
        count: 450
      },
      {
        rating: 4,
        count: 300
      },
      {
        rating: 3,
        count: 150
      },
      {
        rating: 2,
        count: 50
      },
      {
        rating: 1,
        count: 20
      }
    ]
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const StatCard = ({ icon: Icon, value, label, trend }) => (
    <motion.div
      whileHover={{ y: -5 }}
      className="card border-0 shadow-sm h-100"
    >
      <div className="card-body">
        <div className="d-flex align-items-center mb-3">
          <div className="display-4 text-primary me-3">
            <Icon />
          </div>
          <div>
            <h3 className="mb-0">{value}</h3>
            <p className="text-muted mb-0">{label}</p>
          </div>
        </div>
        {trend && (
          <div className="d-flex align-items-center">
            <FiTrendingUp className="text-success me-2" />
            <span className="text-success">{trend}</span>
          </div>
        )}
      </div>
    </motion.div>
  );

  const LessonCard = ({ lesson }) => (
    <motion.div
      whileHover={{ y: -5 }}
      className="card border-0 shadow-sm mb-3"
    >
      <div className="card-body">
        <h6 className="mb-3">{lesson.title}</h6>
        <div className="row">
          <div className="col-md-4">
            <div className="mb-2">
              <small className="text-muted">{t('Completion Rate')}</small>
              <div className="progress" style={{ height: 6 }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{ width: `${lesson.completionRate}%` }}
                />
              </div>
              <small>{lesson.completionRate}%</small>
            </div>
          </div>
          <div className="col-md-4">
            <div className="mb-2">
              <small className="text-muted">{t('Average Score')}</small>
              <div className="progress" style={{ height: 6 }}>
                <div
                  className="progress-bar bg-success"
                  role="progressbar"
                  style={{ width: `${lesson.averageScore}%` }}
                />
              </div>
              <small>{lesson.averageScore}%</small>
            </div>
          </div>
          <div className="col-md-4">
            <small className="text-muted">{t('Students')}</small>
            <h6 className="mb-0">{lesson.studentCount}</h6>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">{course.title}</h2>
          <p className="text-muted mb-0">
            {t('Instructor')}: {course.instructor}
          </p>
        </div>
        <div className="btn-group">
          <button
            className={`btn ${
              timeRange === 'week' ? 'btn-primary' : 'btn-outline-primary'
            }`}
            onClick={() => setTimeRange('week')}
          >
            {t('Week')}
          </button>
          <button
            className={`btn ${
              timeRange === 'month' ? 'btn-primary' : 'btn-outline-primary'
            }`}
            onClick={() => setTimeRange('month')}
          >
            {t('Month')}
          </button>
          <button
            className={`btn ${
              timeRange === 'year' ? 'btn-primary' : 'btn-outline-primary'
            }`}
            onClick={() => setTimeRange('year')}
          >
            {t('Year')}
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <StatCard
            icon={FiUsers}
            value={course.stats.totalEnrollments}
            label={t('Total Enrollments')}
            trend="+15% this week"
          />
        </div>
        <div className="col-md-3">
          <StatCard
            icon={FiTrendingUp}
            value={`${course.stats.completionRate}%`}
            label={t('Completion Rate')}
            trend="+5% this week"
          />
        </div>
        <div className="col-md-3">
          <StatCard
            icon={FiDollarSign}
            value={`$${course.stats.totalRevenue}`}
            label={t('Total Revenue')}
            trend="+20% this week"
          />
        </div>
        <div className="col-md-3">
          <StatCard
            icon={FiStar}
            value={course.stats.averageRating}
            label={t('Average Rating')}
          />
        </div>
      </div>

      {/* Charts */}
      <div className="row g-4 mb-4">
        <div className="col-md-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="mb-4">{t('Enrollment Trends')}</h5>
              <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={course.enrollmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="enrollments"
                      stroke="#0088FE"
                      name={t('Enrollments')}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="mb-4">{t('Student Demographics')}</h5>
              <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={course.studentDemographics}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {course.studentDemographics.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performing Lessons */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <h5 className="mb-4">{t('Top Performing Lessons')}</h5>
          {course.topPerformingLessons.map(lesson => (
            <LessonCard key={lesson.title} lesson={lesson} />
          ))}
        </div>
      </div>

      {/* Student Feedback */}
      <div className="row g-4">
        <div className="col-md-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="mb-4">{t('Student Feedback')}</h5>
              <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={course.studentFeedback}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="rating" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="count"
                      fill="#0088FE"
                      name={t('Number of Reviews')}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="mb-4">{t('Course Metrics')}</h5>
              <div className="d-flex flex-column gap-3">
                <div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>{t('Active Students')}</span>
                    <span className="text-primary">
                      {course.stats.activeStudents}
                    </span>
                  </div>
                  <div className="progress" style={{ height: 6 }}>
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{
                        width: `${(course.stats.activeStudents / course.stats.totalEnrollments) * 100}%`
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>{t('Average Completion Time')}</span>
                    <span className="text-primary">
                      {course.stats.averageCompletionTime}
                    </span>
                  </div>
                  <div className="progress" style={{ height: 6 }}>
                    <div
                      className="progress-bar bg-success"
                      role="progressbar"
                      style={{ width: '75%' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseAnalytics; 