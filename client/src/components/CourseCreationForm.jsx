import { useTranslation } from 'react-i18next';
import { FiPlus, FiTrash2, FiUpload, FiVideo, FiFile, FiImage } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

export default function CourseCreationForm({ onSuccess, formData, setFormData, isEdit, onSubmit }) {
  const { t } = useTranslation();
  const { user } = useAuth();

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Lessons logic
  const handleLessonChange = (idx, field, value) => {
    setFormData(prev => ({
      ...prev,
      lessons: prev.lessons.map((l, i) => i === idx ? { ...l, [field]: value } : l)
    }));
  };
  const addLesson = () => {
    setFormData(prev => ({
      ...prev,
      lessons: [...(prev.lessons || []), { title: '', description: '', file: null }]
    }));
  };
  const removeLesson = idx => {
      setFormData(prev => ({
        ...prev,
      lessons: prev.lessons.filter((_, i) => i !== idx)
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (isEdit && onSubmit) {
      await onSubmit(formData);
      return;
    }
    if (!user) {
      toast.error(t('Please log in to create a course'));
      return;
    }
    try {
      const formDataToSend = new FormData();
      
      // Add basic course information
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('language', formData.language);
      formDataToSend.append('contentType', formData.contentType);
      
      // Add thumbnail if exists
      if (formData.thumbnail) {
        formDataToSend.append('image', formData.thumbnail);
      }

      // Add course content
      formDataToSend.append('content', JSON.stringify(formData.lessons));

      // Add video files
      if (formData.contentType === 'Video') {
        (formData.lessons || []).forEach((lesson, idx) => {
          if (lesson.file) {
            formDataToSend.append('video', lesson.file);
          }
        });
      }

      const response = await fetch('/api/courses', {
        method: 'POST',
        body: formDataToSend,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to create course');
      }

      const data = await response.json();
      toast.success(t('Course created successfully'));
      onSuccess && onSuccess(data);
    } catch (error) {
      console.error('Error creating course:', error);
      toast.error(t('Failed to create course. Please try again.'));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">{t('Course Title')}</label>
        <input
          type="text"
          className="form-control"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder={t('Enter course title')}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">{t('Description')}</label>
        <textarea
          className="form-control"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder={t('Enter course description')}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">{t('Category')}</label>
        <select
          className="form-select"
          name="category"
          value={formData.category}
          onChange={handleChange}
        >
          <option value="">{t('Select category')}</option>
          <option value="Coding">{t('Coding')}</option>
          <option value="General IT">{t('General IT')}</option>
          <option value="Business Tech">{t('Business Tech')}</option>
        </select>
      </div>
      <div className="mb-3">
        <label className="form-label">{t('Content Type')}</label>
        <select
          className="form-select"
          name="contentType"
          value={formData.contentType || ''}
          onChange={handleChange}
        >
          <option value="">{t('Select type')}</option>
          <option value="Video">{t('Video')}</option>
          <option value="Audio">{t('Audio')}</option>
          <option value="Doc">{t('Doc')}</option>
        </select>
            </div>
      {formData.contentType && (
        <div className="mb-3">
          <label className="form-label">{t('Lessons')}</label>
          {(formData.lessons || []).map((lesson, idx) => (
            <div key={idx} className="d-flex mb-2 align-items-center gap-2">
              <input
                type="text"
                className="form-control"
                value={lesson.title}
                onChange={e => handleLessonChange(idx, 'title', e.target.value)}
                placeholder={t('Lesson Title')}
              />
              <input
                type="text"
                className="form-control"
                value={lesson.description}
                onChange={e => handleLessonChange(idx, 'description', e.target.value)}
                placeholder={t('Lesson Description')}
              />
              {(formData.contentType === 'Video' || formData.contentType === 'Audio' || formData.contentType === 'Doc') && (
                <input
                  type="file"
                  className="form-control"
                  accept={formData.contentType === 'Video' ? 'video/*' : formData.contentType === 'Audio' ? 'audio/*' : 'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'}
                  onChange={e => handleLessonChange(idx, 'file', e.target.files[0])}
              />
            )}
              <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => removeLesson(idx)}>&times;</button>
          </div>
        ))}
          <button type="button" className="btn btn-outline-primary btn-sm" onClick={addLesson}>{t('Add Lesson')}</button>
        </div>
      )}
      <div className="mb-3">
        <label className="form-label">{t('Language')}</label>
        <select
          className="form-select"
          name="language"
          value={formData.language}
          onChange={handleChange}
        >
          <option value="en">English</option>
          <option value="rw">Kinyarwanda</option>
        </select>
      </div>
      <div className="mb-3">
        <label className="form-label">{t('Course Thumbnail')}</label>
        <input
          type="file"
          className="form-control"
          accept="image/*"
          onChange={e => setFormData(prev => ({ ...prev, thumbnail: e.target.files[0] }))}
        />
      </div>
      <button className="btn btn-primary" type="submit">{isEdit ? t('Save') : t('Submit')}</button>
    </form>
  );
} 