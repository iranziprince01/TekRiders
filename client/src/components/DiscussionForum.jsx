import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiMessageSquare, FiThumbsUp, FiShare2, FiBookmark, FiMoreVertical } from 'react-icons/fi';

const DiscussionForum = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - replace with API call
  const topics = [
    {
      id: 1,
      title: t('How to get started with Python programming?'),
      author: {
        name: 'John Doe',
        avatar: 'https://ui-avatars.com/api/?name=John+Doe'
      },
      category: 'programming',
      tags: ['python', 'beginner'],
      replies: 12,
      views: 150,
      lastActivity: '2 hours ago',
      isPinned: true
    },
    {
      id: 2,
      title: t('Best practices for responsive web design'),
      author: {
        name: 'Jane Smith',
        avatar: 'https://ui-avatars.com/api/?name=Jane+Smith'
      },
      category: 'design',
      tags: ['web-design', 'css'],
      replies: 8,
      views: 120,
      lastActivity: '5 hours ago',
      isPinned: false
    }
  ];

  const categories = [
    { id: 'all', name: t('All Topics') },
    { id: 'programming', name: t('Programming') },
    { id: 'design', name: t('Design') },
    { id: 'business', name: t('Business') },
    { id: 'general', name: t('General') }
  ];

  const filteredTopics = topics.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeTab === 'all' || topic.category === activeTab;
    return matchesSearch && matchesCategory;
  });

  const TopicCard = ({ topic }) => (
    <motion.div
      whileHover={{ y: -5 }}
      className="card border-0 shadow-sm mb-3"
    >
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="d-flex align-items-center">
            <img
              src={topic.author.avatar}
              alt={topic.author.name}
              className="rounded-circle me-3"
              style={{ width: 40, height: 40 }}
            />
            <div>
              <h5 className="mb-1">
                {topic.isPinned && (
                  <span className="badge bg-primary me-2">{t('Pinned')}</span>
                )}
                {topic.title}
              </h5>
              <p className="text-muted small mb-0">
                {t('Posted by')} {topic.author.name} • {topic.lastActivity}
              </p>
            </div>
          </div>
          <div className="dropdown">
            <button
              className="btn btn-link text-muted"
              type="button"
              data-bs-toggle="dropdown"
            >
              <FiMoreVertical />
            </button>
            <ul className="dropdown-menu">
              <li>
                <button className="dropdown-item">
                  <FiBookmark className="me-2" />
                  {t('Save')}
                </button>
              </li>
              <li>
                <button className="dropdown-item">
                  <FiShare2 className="me-2" />
                  {t('Share')}
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="d-flex flex-wrap gap-2 mb-3">
          {topic.tags.map(tag => (
            <span key={tag} className="badge bg-light text-dark">
              #{tag}
            </span>
          ))}
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <button className="btn btn-sm btn-outline-primary me-2">
              <FiMessageSquare className="me-1" />
              {topic.replies} {t('replies')}
            </button>
            <button className="btn btn-sm btn-outline-primary">
              <FiThumbsUp className="me-1" />
              {t('Like')}
            </button>
          </div>
          <small className="text-muted">
            {topic.views} {t('views')}
          </small>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">{t('Discussion Forum')}</h2>
        <button className="btn btn-primary">
          <FiMessageSquare className="me-2" />
          {t('New Topic')}
        </button>
      </div>

      {/* Search and Filter */}
      <div className="row mb-4">
        <div className="col-md-8">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder={t('Search topics...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Topics List */}
      <div className="row">
        <div className="col-md-8">
          {filteredTopics.map(topic => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
        <div className="col-md-4">
          {/* Popular Topics */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0">{t('Popular Topics')}</h5>
            </div>
            <div className="card-body">
              <ul className="list-unstyled mb-0">
                <li className="mb-3">
                  <a href="#" className="text-decoration-none">
                    <h6 className="mb-1">{t('Getting started with React')}</h6>
                    <small className="text-muted">
                      25 {t('replies')} • 300 {t('views')}
                    </small>
                  </a>
                </li>
                <li className="mb-3">
                  <a href="#" className="text-decoration-none">
                    <h6 className="mb-1">{t('CSS Grid vs Flexbox')}</h6>
                    <small className="text-muted">
                      18 {t('replies')} • 250 {t('views')}
                    </small>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Categories */}
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0">{t('Categories')}</h5>
            </div>
            <div className="card-body">
              <div className="d-flex flex-wrap gap-2">
                {categories.filter(cat => cat.id !== 'all').map(category => (
                  <button
                    key={category.id}
                    className={`btn btn-sm ${
                      activeTab === category.id
                        ? 'btn-primary'
                        : 'btn-outline-primary'
                    }`}
                    onClick={() => setActiveTab(category.id)}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscussionForum; 