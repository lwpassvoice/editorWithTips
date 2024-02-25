import React from 'react';
import './Tips.scss';

interface TipsProps {
  message: string;
  isShow: boolean;
}

const Tips: React.FC<TipsProps> = ({ message, isShow }) => {
  return (
    <span className="tips-container" style={{ display: isShow ? 'inline' : 'none' }}>
      {message}
    </span>
  );
};

export default Tips;