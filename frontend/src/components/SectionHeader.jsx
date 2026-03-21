import React from 'react';

const SectionHeader = ({ orangeText, regularText, isDark = false }) => {
  return (
    <div className="flex items-center justify-center gap-4 mb-12">
      <div className={`h-0.5 w-16 ${isDark ? 'bg-orange-500' : 'bg-orange-500'}`} />
      <h2 className={`text-4xl font-bold ${
        isDark ? 'text-white' : 'text-gray-900'
      }`}>
        <span className="text-orange-500">{orangeText}</span> {regularText}
      </h2>
      <div className={`h-0.5 w-16 ${isDark ? 'bg-orange-500' : 'bg-orange-500'}`} />
    </div>
  );
};

export default SectionHeader;
