
import React from "react";

const Footer = () => {
  return (
    <footer className="w-full py-4 px-6 border-t">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ClickHouse Data Bridge
          </p>
          <div className="flex space-x-4 mt-2 md:mt-0">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Documentation
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Support
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
