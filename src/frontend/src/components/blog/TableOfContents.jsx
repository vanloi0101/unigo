import React, { useState, useEffect } from 'react';

/**
 * TableOfContents - Mục lục từ headings H2, H3
 * Có thể sticky hoặc không
 */
const TableOfContents = ({ content, sticky = false }) => {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState('');

  // Extract headings from HTML content
  useEffect(() => {
    if (!content) return;

    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const elements = doc.querySelectorAll('h2, h3');
    
    const items = Array.from(elements).map((el, index) => {
      const id = el.id || `heading-${index}`;
      return {
        id,
        text: el.textContent,
        level: el.tagName === 'H2' ? 2 : 3,
      };
    });

    setHeadings(items);
  }, [content]);

  // Track active heading on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0px -80% 0px',
      }
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [headings]);

  const handleClick = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Header height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  if (headings.length === 0) return null;

  return (
    <nav
      className={`${
        sticky ? 'lg:sticky lg:top-24' : ''
      } bg-white border border-gray-200 rounded-lg p-4`}
    >
      <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
        Mục lục
      </h4>
      <ul className="space-y-2">
        {headings.map(({ id, text, level }) => (
          <li
            key={id}
            className={level === 3 ? 'pl-4' : ''}
          >
            <a
              href={`#${id}`}
              onClick={(e) => handleClick(e, id)}
              className={`
                block text-sm leading-relaxed transition-colors duration-200
                ${
                  activeId === id
                    ? 'text-brand-purple font-medium'
                    : 'text-gray-600 hover:text-gray-900'
                }
              `}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TableOfContents;
