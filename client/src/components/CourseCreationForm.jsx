import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiPlus, FiTrash2, FiUpload, FiVideo, FiFile, FiImage } from 'react-icons/fi';

const CourseCreationForm = () => {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(1);
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    category: '',
    language: 'en',
    price: 0,
    thumbnail: null,
    sections: [
      {
        id: 1,
        title: '',
        lessons: [
          {
            id: 1,
            title: '',
            type: 'video',
            content: null,
            duration: '',
            description: ''
          }
        ]
      }
    ]
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSectionChange = (sectionId, field, value) => {
    setCourseData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId
          ? { ...section, [field]: value }
          : section
      )
    }));
  };

  const handleLessonChange = (sectionId, lessonId, field, value) => {
    setCourseData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              lessons: section.lessons.map(lesson =>
                lesson.id === lessonId
                  ? { ...lesson, [field]: value }
                  : lesson
              )
            }
          : section
      )
    }));
  };

  const addSection = () => {
    setCourseData(prev => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          id: prev.sections.length + 1,
          title: '',
          lessons: [
            {
              id: 1,
              title: '',
              type: 'video',
              content: null,
              duration: '',
              description: ''
            }
          ]
        }
      ]
    }));
  };

  const addLesson = (sectionId) => {
    setCourseData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              lessons: [
                ...section.lessons,
                {
                  id: section.lessons.length + 1,
                  title: '',
                  type: 'video',
                  content: null,
                  duration: '',
                  description: ''
                }
              ]
            }
          : section
      )
    }));
  };

  const removeSection = (sectionId) => {
    setCourseData(prev => ({
      ...prev,
      sections: prev.sections.filter(section => section.id !== sectionId)
    }));
  };

  const removeLesson = (sectionId, lessonId) => {
    setCourseData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              lessons: section.lessons.filter(lesson => lesson.id !== lessonId)
            }
          : section
      )
    }));
  };

  const handleFileUpload = (e, sectionId, lessonId) => {
    const file = e.target.files[0];
    if (file) {
      handleLessonChange(sectionId, lessonId, 'content', file);
    }
  };

  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCourseData(prev => ({
        ...prev,
        thumbnail: file
      }));
    }
  };

  const StepIndicator = () => (
    <div className="d-flex justify-content-between mb-4">
      {[1, 2, 3].map(step => (
        <div
          key={step}
          className={`d-flex align-items-center ${
            step !== 3 ? 'flex-grow-1' : ''
          }`}
        >
          <div
            className={`rounded-circle d-flex align-items-center justify-content-center ${
              activeStep >= step ? 'bg-primary text-white' : 'bg-light'
            }`}
            style={{ width: 40, height: 40 }}
          >
            {step}
          </div>
          {step !== 3 && (
            <div
              className={`flex-grow-1 ms-2 ${
                activeStep > step ? 'bg-primary' : 'bg-light'
              }`}
              style={{ height: 2 }}
            />
          )}
        </div>
      ))}
    </div>
  );

  const BasicInfoStep = () => (
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <h4 className="mb-4">{t('Basic Information')}</h4>
        <div className="mb-3">
          <label className="form-label">{t('Course Title')}</label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={courseData.title}
            onChange={handleInputChange}
            placeholder={t('Enter course title')}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">{t('Description')}</label>
          <textarea
            className="form-control"
            name="description"
            value={courseData.description}
            onChange={handleInputChange}
            rows={4}
            placeholder={t('Enter course description')}
          />
        </div>
        <div className="row">
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label">{t('Category')}</label>
              <select
                className="form-select"
                name="category"
                value={courseData.category}
                onChange={handleInputChange}
              >
                <option value="">{t('Select category')}</option>
                <option value="programming">{t('Programming')}</option>
                <option value="design">{t('Design')}</option>
                <option value="business">{t('Business')}</option>
              </select>
            </div>
          </div>
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label">{t('Language')}</label>
              <select
                className="form-select"
                name="language"
                value={courseData.language}
                onChange={handleInputChange}
              >
                <option value="en">{t('English')}</option>
                <option value="rw">{t('Kinyarwanda')}</option>
                <option value="fr">{t('French')}</option>
              </select>
            </div>
          </div>
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label">{t('Price')}</label>
              <input
                type="number"
                className="form-control"
                name="price"
                value={courseData.price}
                onChange={handleInputChange}
                min="0"
              />
            </div>
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">{t('Course Thumbnail')}</label>
          <div className="d-flex align-items-center">
            {courseData.thumbnail ? (
              <img
                src={URL.createObjectURL(courseData.thumbnail)}
                alt="Thumbnail preview"
                className="me-3"
                style={{ width: 100, height: 100, objectFit: 'cover' }}
              />
            ) : (
              <div
                className="border rounded d-flex align-items-center justify-content-center me-3"
                style={{ width: 100, height: 100 }}
              >
                <FiImage className="text-muted" />
              </div>
            )}
            <div>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={handleThumbnailUpload}
              />
              <small className="text-muted">
                {t('Recommended size: 1280x720 pixels')}
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ContentStep = () => (
    <div>
      {courseData.sections.map((section, sectionIndex) => (
        <motion.div
          key={section.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card border-0 shadow-sm mb-4"
        >
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="mb-0">
                {t('Section')} {sectionIndex + 1}
              </h5>
              <button
                className="btn btn-outline-danger"
                onClick={() => removeSection(section.id)}
              >
                <FiTrash2 />
              </button>
            </div>
            <div className="mb-4">
              <input
                type="text"
                className="form-control"
                value={section.title}
                onChange={(e) => handleSectionChange(section.id, 'title', e.target.value)}
                placeholder={t('Enter section title')}
              />
            </div>
            {section.lessons.map((lesson, lessonIndex) => (
              <div key={lesson.id} className="card mb-3">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h6 className="mb-0">
                      {t('Lesson')} {lessonIndex + 1}
                    </h6>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => removeLesson(section.id, lesson.id)}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      value={lesson.title}
                      onChange={(e) => handleLessonChange(section.id, lesson.id, 'title', e.target.value)}
                      placeholder={t('Enter lesson title')}
                    />
                  </div>
                  <div className="mb-3">
                    <textarea
                      className="form-control"
                      value={lesson.description}
                      onChange={(e) => handleLessonChange(section.id, lesson.id, 'description', e.target.value)}
                      rows={2}
                      placeholder={t('Enter lesson description')}
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">{t('Lesson Type')}</label>
                        <select
                          className="form-select"
                          value={lesson.type}
                          onChange={(e) => handleLessonChange(section.id, lesson.id, 'type', e.target.value)}
                        >
                          <option value="video">{t('Video')}</option>
                          <option value="document">{t('Document')}</option>
                          <option value="quiz">{t('Quiz')}</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">{t('Duration')}</label>
                        <input
                          type="text"
                          className="form-control"
                          value={lesson.duration}
                          onChange={(e) => handleLessonChange(section.id, lesson.id, 'duration', e.target.value)}
                          placeholder="e.g. 10:30"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">{t('Content')}</label>
                    <div className="d-flex align-items-center">
                      {lesson.content ? (
                        <div className="me-3">
                          {lesson.type === 'video' ? (
                            <FiVideo className="display-4" />
                          ) : (
                            <FiFile className="display-4" />
                          )}
                        </div>
                      ) : (
                        <div
                          className="border rounded d-flex align-items-center justify-content-center me-3"
                          style={{ width: 100, height: 100 }}
                        >
                          <FiUpload className="text-muted" />
                        </div>
                      )}
                      <div>
                        <input
                          type="file"
                          className="form-control"
                          accept={lesson.type === 'video' ? 'video/*' : '.pdf,.doc,.docx'}
                          onChange={(e) => handleFileUpload(e, section.id, lesson.id)}
                        />
                        <small className="text-muted">
                          {lesson.type === 'video'
                            ? t('Supported formats: MP4, WebM')
                            : t('Supported formats: PDF, DOC, DOCX')}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <button
              className="btn btn-outline-primary"
              onClick={() => addLesson(section.id)}
            >
              <FiPlus className="me-2" />
              {t('Add Lesson')}
            </button>
          </div>
        </motion.div>
      ))}
      <button
        className="btn btn-outline-primary"
        onClick={addSection}
      >
        <FiPlus className="me-2" />
        {t('Add Section')}
      </button>
    </div>
  );

  const ReviewStep = () => (
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <h4 className="mb-4">{t('Review Course')}</h4>
        <div className="row">
          <div className="col-md-8">
            <h5>{courseData.title}</h5>
            <p className="text-muted">{courseData.description}</p>
            <div className="d-flex gap-3 mb-4">
              <span className="badge bg-primary">{courseData.category}</span>
              <span className="badge bg-secondary">{courseData.language}</span>
              <span className="badge bg-info">${courseData.price}</span>
            </div>
            <h6 className="mb-3">{t('Course Content')}</h6>
            {courseData.sections.map((section, index) => (
              <div key={section.id} className="mb-4">
                <h6 className="mb-2">
                  {index + 1}. {section.title}
                </h6>
                <ul className="list-unstyled">
                  {section.lessons.map(lesson => (
                    <li key={lesson.id} className="mb-2">
                      <div className="d-flex align-items-center">
                        {lesson.type === 'video' ? (
                          <FiVideo className="me-2" />
                        ) : (
                          <FiFile className="me-2" />
                        )}
                        <span>{lesson.title}</span>
                        <small className="text-muted ms-2">
                          ({lesson.duration})
                        </small>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="col-md-4">
            {courseData.thumbnail && (
              <img
                src={URL.createObjectURL(courseData.thumbnail)}
                alt="Course thumbnail"
                className="img-fluid rounded"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container py-4">
      <h2 className="mb-4">{t('Create New Course')}</h2>
      <StepIndicator />
      {activeStep === 1 && <BasicInfoStep />}
      {activeStep === 2 && <ContentStep />}
      {activeStep === 3 && <ReviewStep />}
      <div className="d-flex justify-content-between mt-4">
        <button
          className="btn btn-outline-primary"
          disabled={activeStep === 1}
          onClick={() => setActiveStep(prev => prev - 1)}
        >
          {t('Previous')}
        </button>
        <button
          className="btn btn-primary"
          onClick={() => {
            if (activeStep < 3) {
              setActiveStep(prev => prev + 1);
            } else {
              // Handle course submission
              console.log('Submitting course:', courseData);
            }
          }}
        >
          {activeStep === 3 ? t('Publish Course') : t('Next')}
        </button>
      </div>
    </div>
  );
};

export default CourseCreationForm; 