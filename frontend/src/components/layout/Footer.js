import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-200 px-4 py-3">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="text-sm text-gray-500 mb-2 md:mb-0">
          <a href="/privacy-policy" className="hover:text-primary">Privacy Policy</a>
          <span className="mx-2">|</span>
          <a href="/terms-of-use" className="hover:text-primary">Terms of Use</a>
        </div>
        <div className="text-sm text-gray-500">
          ©{currentYear} Powered by EVERNOTE, Made with ❤️ by GEVEO
        </div>
      </div>
    </footer>
  );
};

export default Footer;