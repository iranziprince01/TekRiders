import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiDownload, FiBookmark, FiShare2 } from 'react-icons/fi';

const CourseMarketplace = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Mock data - replace with API call
  const courses = [
    {
      id: 1,
      title: 'Introduction to Programming',
      description: 'Learn the basics of programming with Python',
      instructor: 'John Doe',
      price: 0,
      rating: 4.5,
      students: 1200,
      language: 'rw',
      category: 'programming',
      thumbnail: 'https://picsum.photos/300/200',
      duration: '8 hours',
      level: 'Beginner'
    },
    // Add more courses...
  ];

  const categories = [
    { id: 'all', name: t('All Categories') },
    { id: 'programming', name: t('Programming') },
    { id: 'design', name: t('Design') },
    { id: 'business', name: t('Business') },
    { id: 'marketing', name: t('Marketing') }
  ];

  const languages = [
    { id: 'all', name: t('All Languages') },
    { id: 'rw', name: t('Kinyarwanda') },
    { id: 'en', name: t('English') },
    { id: 'fr', name: t('French') }
  ];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesLanguage = selectedLanguage === 'all' || course.language === selectedLanguage;
    return matchesSearch && matchesCategory && matchesLanguage;
  });

  const CourseCard = ({ course }) => (
    <motion.div
      whileHover={{ y: -5 }}
      className="card h-100 border-0 shadow-sm"
    >
      <div className="position-relative">
        <img
          src={course.thumbnail}
          className="card-img-top"
          alt={course.title}
          style={{ height: 200, objectFit: 'cover' }}
        />
        <div className="position-absolute top-0 end-0 m-2">
          <span className="badge bg-primary">
            {course.language === 'rw' ? t('Kinyarwanda') : t('English')}
          </span>
        </div>
      </div>
      <div className="card-body">
        <h5 className="card-title">{course.title}</h5>
        <p className="text-muted small mb-2">{course.instructor}</p>
        <p className="card-text small">{course.description}</p>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <span className="text-warning">★</span>
            <span className="ms-1">{course.rating}</span>
            <span className="text-muted ms-2">({course.students} {t('students')})</span>
          </div>
          <span className="badge bg-light text-dark">{course.level}</span>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <span className="text-muted small">{course.duration}</span>
          </div>
          <div className="btn-group">
            <button className="btn btn-sm btn-outline-primary">
              <FiDownload className="me-1" />
              {t('Download')}
            </button>
            <button className="btn btn-sm btn-outline-primary">
              <FiBookmark className="me-1" />
              {t('Save')}
            </button>
            <button className="btn btn-sm btn-outline-primary">
              <FiShare2 className="me-1" />
              {t('Share')}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="container py-4">
      {/* Search and Filter */}
      <div className="row mb-4">
        <div className="col-md-8">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <FiSearch className="text-muted" />
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder={t('Search courses...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-4">
          <button
            className="btn btn-outline-primary w-100"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FiFilter className="me-2" />
            {t('Filters')}
          </button>
        </div>
      </div>

      {/* Filters */}
      <motion.div
        initial={false}
        animate={{ height: showFilters ? 'auto' : 0 }}
        className="overflow-hidden"
      >
        <div className="row mb-4">
          <div className="col-md-6">
            <label className="form-label">{t('Category')}</label>
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">{t('Language')}</label>
            <select
              className="form-select"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              {languages.map(language => (
                <option key={language.id} value={language.id}>
                  {language.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Course Grid */}
      <div className="row g-4">
        {filteredCourses.map(course => (
          <div key={course.id} className="col-md-4">
            <CourseCard course={course} />
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredCourses.length === 0 && (
        <div className="text-center py-5">
          <h4 className="text-muted">{t('No courses found')}</h4>
          <p className="text-muted">
            {t('Try adjusting your search or filter criteria')}
          </p>
        </div>
      )}
    </div>
  );
};

export default CourseMarketplace; 