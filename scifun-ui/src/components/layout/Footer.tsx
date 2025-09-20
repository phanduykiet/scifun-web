import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark text-light mt-5">
      <div className="container py-4">
        <div className="row">
          {/* Giới thiệu */}
          <div className="col-md-4 mb-3">
            <h5>SciFun</h5>
            <p>
              Nền tảng học trực tuyến giúp bạn khám phá tri thức một cách dễ dàng
              và thú vị.
            </p>
          </div>

          {/* Liên kết nhanh */}
          <div className="col-md-4 mb-3">
            <h5>Liên kết</h5>
            <ul className="list-unstyled">
              <li>
                <a href="/" className="text-light text-decoration-none">
                  Trang chủ
                </a>
              </li>
              <li>
                <a href="/lessons" className="text-light text-decoration-none">
                  Bài học
                </a>
              </li>
              <li>
                <a href="/about" className="text-light text-decoration-none">
                  Giới thiệu
                </a>
              </li>
              <li>
                <a href="/contact" className="text-light text-decoration-none">
                  Liên hệ
                </a>
              </li>
            </ul>
          </div>

          {/* Liên hệ */}
          <div className="col-md-4 mb-3">
            <h5>Liên hệ</h5>
            <p>Email: support@scifun.com</p>
            <p>Điện thoại: +84 123 456 789</p>
            <div>
              <a href="#" className="text-light me-3">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="text-light me-3">
                <i className="bi bi-twitter"></i>
              </a>
              <a href="#" className="text-light">
                <i className="bi bi-youtube"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Bản quyền */}
        <div className="text-center pt-3 border-top">
          <small>© {new Date().getFullYear()} SciFun. All rights reserved.</small>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
