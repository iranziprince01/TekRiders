import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiPlay, FiPause, FiVolume2, FiVolumeX, FiMaximize, FiBookmark, FiDownload } from 'react-icons/fi';

const CoursePlayer = () => {
  const { t } = useTranslation();
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const [showSidebar, setShowSidebar] = useState(true);

  // Mock data - replace with API call
  const course = {
    title: 'Introduction to Programming',
    instructor: 'John Doe',
    sections: [
      {
        id: 1,
        title: 'Getting Started',
        lessons: [
          {
            id: 1,
            title: 'Welcome to the Course',
            duration: '5:30',
            videoUrl: 'https://example.com/video1.mp4',
            completed: true
          },
          {
            id: 2,
            title: 'Setting Up Your Development Environment',
            duration: '10:15',
            videoUrl: 'https://example.com/video2.mp4',
            completed: false
          }
        ]
      },
      {
        id: 2,
        title: 'Basic Concepts',
        lessons: [
          {
            id: 3,
            title: 'Variables and Data Types',
            duration: '15:20',
            videoUrl: 'https://example.com/video3.mp4',
            completed: false
          },
          {
            id: 4,
            title: 'Control Flow',
            duration: '12:45',
            videoUrl: 'https://example.com/video4.mp4',
            completed: false
          }
        ]
      }
    ]
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
  }, []);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video) {
      const progress = (video.currentTime / video.duration) * 100;
      setProgress(progress);
      setCurrentTime(video.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (video) {
      setDuration(video.duration);
    }
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleProgressClick = (e) => {
    const video = videoRef.current;
    const progressBar = e.currentTarget;
    const clickPosition = (e.clientX - progressBar.getBoundingClientRect().left) / progressBar.offsetWidth;
    if (video) {
      video.currentTime = clickPosition * video.duration;
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const LessonItem = ({ lesson, isActive }) => (
    <motion.div
      whileHover={{ x: 5 }}
      className={`p-3 border-bottom cursor-pointer ${
        isActive ? 'bg-light' : ''
      }`}
    >
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h6 className="mb-1">{lesson.title}</h6>
          <small className="text-muted">{lesson.duration}</small>
        </div>
        {lesson.completed && (
          <span className="badge bg-success">{t('Completed')}</span>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="container-fluid p-0">
      <div className="row g-0">
        {/* Video Player */}
        <div className={`col ${showSidebar ? 'col-lg-9' : 'col-12'}`}>
          <div className="position-relative bg-black">
            <video
              ref={videoRef}
              className="w-100"
              style={{ maxHeight: 'calc(100vh - 200px)' }}
              src={course.sections[activeSection].lessons[0].videoUrl}
            />
            
            {/* Video Controls */}
            <div className="position-absolute bottom-0 start-0 end-0 bg-dark bg-opacity-75 p-3">
              <div className="d-flex align-items-center mb-2">
                <button
                  className="btn btn-link text-white"
                  onClick={togglePlay}
                >
                  {isPlaying ? <FiPause /> : <FiPlay />}
                </button>
                <button
                  className="btn btn-link text-white"
                  onClick={toggleMute}
                >
                  {isMuted ? <FiVolumeX /> : <FiVolume2 />}
                </button>
                <div className="flex-grow-1 mx-3">
                  <div
                    className="progress"
                    style={{ height: 5, cursor: 'pointer' }}
                    onClick={handleProgressClick}
                  >
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                <span className="text-white me-3">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
                <button className="btn btn-link text-white">
                  <FiMaximize />
                </button>
              </div>
            </div>
          </div>

          {/* Course Info */}
          <div className="p-4">
            <div className="d-flex justify-content-between align-items-start mb-4">
              <div>
                <h2>{course.title}</h2>
                <p className="text-muted mb-0">
                  {t('Instructor')}: {course.instructor}
                </p>
              </div>
              <div className="btn-group">
                <button className="btn btn-outline-primary">
                  <FiBookmark className="me-2" />
                  {t('Save')}
                </button>
                <button className="btn btn-outline-primary">
                  <FiDownload className="me-2" />
                  {t('Download')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Course Content Sidebar */}
        {showSidebar && (
          <div className="col-lg-3 border-start">
            <div className="p-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">{t('Course Content')}</h5>
                <button
                  className="btn btn-link"
                  onClick={() => setShowSidebar(false)}
                >
                  {t('Hide')}
                </button>
              </div>
              {course.sections.map((section, index) => (
                <div key={section.id} className="mb-4">
                  <h6 className="mb-3">
                    {index + 1}. {section.title}
                  </h6>
                  {section.lessons.map(lesson => (
                    <LessonItem
                      key={lesson.id}
                      lesson={lesson}
                      isActive={activeSection === index}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursePlayer; 