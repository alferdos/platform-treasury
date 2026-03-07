import React, { memo } from "react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="footer_grid">

        {/* Column 1 — Brand */}
        <div className="footer_brand">
          <Link to="/">
            <img src="/theme/images/logo_white.png" alt="Treasury" style={{ maxWidth: "90px", height: "auto" }} />
          </Link>
          <p className="footer_tagline">
            Tokenizing Saudi real estate.<br />
            Accessible. Transparent. Regulated.
          </p>
        </div>

        {/* Column 2 — Platform */}
        <div className="footer_col">
          <h4 className="footer_col_title">Platform</h4>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/howitwork">How It Works</Link>
          <Link to="/portfolio">Portfolio</Link>
        </div>

        {/* Column 3 — Company */}
        <div className="footer_col">
          <h4 className="footer_col_title">Company</h4>
          <Link to="/blog">Blog</Link>
          <Link to="/contactus">Contact Us</Link>
          <Link to="/privacypolicy">Privacy Policy</Link>
          <Link to="/termsofuse">Terms of Use</Link>
        </div>

        {/* Column 4 — Contact */}
        <div className="footer_col">
          <h4 className="footer_col_title">Contact</h4>
          <a href="mailto:partnerships@treasury.sa">partnerships@treasury.sa</a>
          <span className="footer_address">7076 Al Sahaba Rd., Ishbiliyah<br />Riyadh 13225, Saudi Arabia</span>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="footer_bottom">
        <p>© {new Date().getFullYear()} Treasury. All rights reserved.</p>
        <p className="footer_legal">
          <Link to="/privacypolicy">Privacy Policy</Link>
          <span className="footer_sep">·</span>
          <Link to="/termsofuse">Terms of Use</Link>
        </p>
      </div>
    </div>
  </footer>
);

export default memo(Footer);
