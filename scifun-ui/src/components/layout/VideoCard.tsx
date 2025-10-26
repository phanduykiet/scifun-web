import React from "react";

interface VideoCardProps {
  video: {
    _id: string;
    url: string;
    title?: string;
  };
  index?: number;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, index = 0 }) => {
  return (
    <div className="mb-3">
      {/* Tên bài học */}
      <h5 className="mb-2 fw-semibold" style={{ color: "#333" }}>
        {video.title || `Bài ${index + 1}`}
      </h5>
      
      {/* Video iframe */}
      <div className="ratio ratio-16x9">
        <iframe
          src={video.url}
          title={video.title || `video-${index}`}
          allowFullScreen
          style={{ border: "none", borderRadius: "8px" }}
        ></iframe>
      </div>
    </div>
  );
};

export default VideoCard;