import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-Mossy1 text-white text-center py-4 w-screen">
            <div className="container mx-auto">
                <p>&copy; 2024 Siege Market Analyst. All Rights Reserved.</p>
                <p>
                    Made with <span className="text-red-500">♥</span> for the Rainbow Six Siege community.
                </p>
                <a href="https://github.com/jackkbowen/R6-Market-Tracker"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:underline"
                >
                    GitHub Repository
                </a>
            </div>
        </footer>
    );
};

export default Footer;
