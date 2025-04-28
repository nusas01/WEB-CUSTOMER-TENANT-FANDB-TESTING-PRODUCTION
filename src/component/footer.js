// import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import "../style/footer.css"; 
import "../style/add.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-row">
          <div className="footer-section">
            <div className="footer-section-header">
              <p class="text mb-10">NusasFood tersedia di</p>
              <p className="footer-text">
                Indonesia 
              </p>
            </div>
            <div className="footer-section-buttom">
              <p className="footer-muted mb-10">© Nusas 2025</p>
              <p>
                <a href="#" className="footer-link">Ketentuan Layanan</a>• 
                <a href="#" className="footer-link">  Kebijakan Privasi</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
