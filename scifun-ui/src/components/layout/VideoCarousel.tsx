import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Video {
  _id: string;
  url: string;
  title?: string;
}

interface VideoCarouselProps {
  videos: Video[];
}

const VideoCarousel: React.FC<VideoCarouselProps> = ({ videos }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const videosPerPage = 3;
  const totalPages = Math.ceil(videos.length / videosPerPage);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  const startIndex = currentIndex * videosPerPage;
  const visibleVideos = videos.slice(startIndex, startIndex + videosPerPage);

  if (videos.length === 0) {
    return <p className="ms-2">Chưa có video nào cho chủ đề này.</p>;
  }

  return (
    <div className="position-relative">
      {/* Navigation Buttons */}
      {totalPages > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="btn btn-light position-absolute start-0 top-50 translate-middle-y shadow-sm"
            style={{ zIndex: 10, borderRadius: "50%", width: "40px", height: "40px", marginLeft: "-20px" }}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={handleNext}
            className="btn btn-light position-absolute end-0 top-50 translate-middle-y shadow-sm"
            style={{ zIndex: 10, borderRadius: "50%", width: "40px", height: "40px", marginRight: "-20px" }}
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* Videos Grid */}
      <div className="row mt-3">
        {visibleVideos.map((video, index) => (
          <div className="col-md-4 mb-3" key={video._id}>
            <div className="mb-3">
              {/* Tên bài học */}
              <h5 className="mb-2 fw-semibold" style={{ color: "#333" }}>
                {video.title || `Bài ${startIndex + index + 1}`}
              </h5>
              
              {/* Video iframe */}
              <div className="ratio ratio-16x9">
                <iframe
                  src={video.url}
                  title={video.title || `video-${startIndex + index}`}
                  allowFullScreen
                  style={{ border: "none", borderRadius: "8px" }}
                ></iframe>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Dots */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-3 gap-2">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className="btn p-0"
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: idx === currentIndex ? "#28a745" : "#ddd",
                border: "none",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoCarousel;