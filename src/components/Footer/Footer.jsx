import React from "react";
import "./Footer.css";

import { Link } from "react-router-dom";
import { siteConfig } from "../../data";

const Footer = () => {
  const { person, contact, footer } = siteConfig;
  const emailParts = person.email.split("@");
  const emailUser = emailParts[0] || "";
  const emailDomain = emailParts[1] || "";

  return (
    <div className="footer">
      <div className="footer-row">
        <div className="footer-contact">
          <h3>
            {contact.header} <br />
            {emailUser}
            <span>@</span>
            {emailDomain}
          </h3>

          <p className="secondary">
            {contact.description}
          </p>

          <Link to={contact.cta.to} className="btn">
            {contact.cta.label}
          </Link>
        </div>

        <div className="footer-nav">
          <Link to="/" className="footer-nav-item">
            <span>Home</span>
            <span>&#8594;</span>
          </Link>

          <Link to="/work" className="footer-nav-item">
            <span>Work</span>
            <span>&#8594;</span>
          </Link>

          <Link to="/about" className="footer-nav-item">
            <span>About</span>
            <span>&#8594;</span>
          </Link>

          <Link to="/contact" className="footer-nav-item">
            <span>Contact</span>
            <span>&#8594;</span>
          </Link>

          <Link to="/faq" className="footer-nav-item">
            <span>FAQ</span>
            <span>&#8594;</span>
          </Link>
        </div>
      </div>
      <div className="footer-row">
        <div className="footer-header">
          <p className="footer-brand-line">{footer.brandLine1}</p>
          <p className="footer-brand-line">{footer.brandLine2}</p>
        </div>

        <div className="footer-copyright-line">
          <p className="primary sm">
            &copy; {person.fullName} {footer.copyrightYear}
          </p>
          <p className="primary sm">{footer.templateCredit}</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
