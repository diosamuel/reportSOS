// Layout.jsx
import React from 'react';

const Layout = ({ className, children }) => {
  return (
    <section className="flex items-center justify-center">
      <div className="md:w-5/12 w-full bg-white border-x-2 shadow-lg">
        <div className={`${className}}`}>{children}</div>
      </div>
    </section>
  );
};

export default Layout;
