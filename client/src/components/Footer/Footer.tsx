import * as React from 'react';
import './footer.css';

type FooterProps = object; //empty object

const Footer: React.FC<FooterProps> = () => {
    return (
        <div className="footer">
            <div className="footer-content">
                Réalisé avec ❤ à Montréal par des finissant•e•s de l&apos;ETS
            </div>
            <div className="footer-links">
                <a href="https://github.com/ets-cfuhrman-pfe/EvalueTonSavoir/">GitHub</a>
                <span className="divider">|</span>
                <a href="https://github.com/ets-cfuhrman-pfe/EvalueTonSavoir/wiki">Wiki GitHub</a>
            </div>
        </div>
    );
};

export default Footer;
