import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Leaderboard.css";
import LeaderboardHeader from "../components/leaderboard/LeaderboardHeader";
import LeaderboardTop3 from "../components/leaderboard/LeaderboardTop3";
import LeaderboardList from "../components/leaderboard/LeaderboardList";
import { getLeaderBoardApi, resetLeaderBoardApi } from "../util/api";
import Header from "../components/layout/Header";
import { socket } from "../util/socket";

interface Student {
  rank: number;
  name: string;
  score: number;
  avatar: string;
  isPlaceholder?: boolean;
}

interface RankChangeNotification {
  subjectId: string;
  subjectName: string;
  period: "daily" | "weekly" | "monthly" | "alltime";
  oldRank: number;
  newRank: number;
  change: "up" | "down";
}

// Confetti component với fullscreen overlay
const Confetti: React.FC = () => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    left: number;
    delay: number;
    duration: number;
    color: string;
    size: number;
  }>>([]);

  useEffect(() => {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#ff69b4', '#ffd700', '#00fa9a'];
    const newParticles = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.8,
      duration: 2 + Math.random() * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 8 + Math.random() * 8,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <>
      {/* Fullscreen overlay với gradient vàng óng ánh */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle, rgba(255,215,0,0.3) 0%, rgba(255,255,255,0.1) 100%)',
        pointerEvents: 'none',
        zIndex: 9998,
        animation: 'glowPulse 1.5s ease-in-out infinite',
      }} />
      
      {/* Confetti particles */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9999,
        overflow: 'hidden',
      }}>
        {particles.map((particle) => (
          <div
            key={particle.id}
            style={{
              position: 'absolute',
              left: `${particle.left}%`,
              top: '-20px',
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              animation: `confettiFall ${particle.duration}s linear ${particle.delay}s forwards`,
              transform: `rotate(${Math.random() * 360}deg)`,
              borderRadius: Math.random() > 0.5 ? '50%' : '0',
              boxShadow: `0 0 10px ${particle.color}`,
            }}
          />
        ))}
      </div>
    </>
  );
};

// Rain component với hiệu ứng tối và sấm sét
const RainStorm: React.FC = () => {
  const [drops, setDrops] = useState<Array<{
    id: number;
    left: number;
    delay: number;
    duration: number;
  }>>([]);
  const [lightning, setLightning] = useState(false);

  useEffect(() => {
    const newDrops = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 0.8 + Math.random() * 0.7,
    }));
    setDrops(newDrops);

    // Trigger lightning 3 times
    const lightningTimings = [300, 1000, 1800];
    lightningTimings.forEach(timing => {
      setTimeout(() => {
        setLightning(true);
        setTimeout(() => setLightning(false), 150);
      }, timing);
    });
  }, []);

  return (
    <>
      {/* Dark overlay với hiệu ứng tối dần */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        pointerEvents: 'none',
        zIndex: 9998,
        animation: 'darkFadeIn 0.5s ease-out',
      }} />

      {/* Lightning flash */}
      {lightning && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          pointerEvents: 'none',
          zIndex: 9999,
          animation: 'lightningFlash 0.15s ease-out',
        }} />
      )}

      {/* Rain drops */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9999,
        overflow: 'hidden',
      }}>
        {drops.map((drop) => (
          <div
            key={drop.id}
            style={{
              position: 'absolute',
              left: `${drop.left}%`,
              top: '-30px',
              width: '2px',
              height: '30px',
              background: 'linear-gradient(to bottom, transparent, rgba(174, 194, 224, 0.8))',
              animation: `rainFall ${drop.duration}s linear ${drop.delay}s infinite`,
              filter: 'blur(0.5px)',
            }}
          />
        ))}
      </div>

      {/* Thunder clouds at top */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '30%',
        background: 'linear-gradient(to bottom, rgba(50, 50, 70, 0.8), transparent)',
        pointerEvents: 'none',
        zIndex: 9998,
        animation: 'cloudDrift 3s ease-in-out',
      }} />
    </>
  );
};

const LeaderboardPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [rankChangeAlert, setRankChangeAlert] = useState<RankChangeNotification | null>(null);
  const [showEffect, setShowEffect] = useState(false);

  const createPlaceholders = (count: number, startRank: number): Student[] => {
    return Array.from({ length: count }, (_, i) => ({
      rank: startRank + i,
      name: "Chưa có người chơi",
      score: 0,
      avatar: "https://png.pngtree.com/png-vector/20220616/ourmid/pngtree-trophy-cartoon-illustration-png-image_5102874.png",
      isPlaceholder: true,
    }));
  };

  const fetchLeaderboard = async (subjectId: string) => {
    try {
      const res = await getLeaderBoardApi(subjectId, 1, 50, "alltime");
      const list = res.data || [];
      const formatted = list.map((item: any) => ({
        rank: item.rank || 0,
        name: item.userName || "Người dùng",
        score: item.totalScore || 0,
        avatar: item.userAvatar || "https://i.pravatar.cc/150",
        userId: item.userId,
        isPlaceholder: false,
      }));

      let finalList = [...formatted];
      const totalNeeded = 5;
      
      if (finalList.length < totalNeeded) {
        const placeholdersNeeded = totalNeeded - finalList.length;
        const startRank = finalList.length + 1;
        const placeholders = createPlaceholders(placeholdersNeeded, startRank);
        finalList = [...finalList, ...placeholders];
      }

      setStudents(finalList);
    } catch (error) {
      console.error("❌ Lỗi lấy bảng xếp hạng:", error);
      setStudents(createPlaceholders(5, 1));
    }
  };

  const rebuildAndFetchLeaderboard = async (subjectId: string) => {
    try {
      setIsRefreshing(true);
      await resetLeaderBoardApi(subjectId);
      await fetchLeaderboard(subjectId);
    } catch (error) {
      console.error("❌ Lỗi rebuild leaderboard:", error);
      await fetchLeaderboard(subjectId);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const handleRankChange = (data: RankChangeNotification) => {
      console.log("🔔 Rank changed:", data);
      
      setRankChangeAlert(data);
      setShowEffect(true);
      
      setTimeout(() => {
        setShowEffect(false);
      }, 3000);
      
      setTimeout(() => {
        setRankChangeAlert(null);
      }, 8000);

      if (typeof Notification !== 'undefined' && Notification.permission === "granted") {
        const diff = Math.abs(data.newRank - data.oldRank);
        const changeText = data.change === "up" 
          ? `Chúc mừng! Bạn đã tăng ${diff} hạng (${data.oldRank} → ${data.newRank})`
          : `Hạng của bạn đã giảm ${diff} hạng (${data.oldRank} → ${data.newRank})`;
        
        new Notification(`Thay đổi xếp hạng - ${data.subjectName}`, {
          body: changeText,
          icon: data.change === "up" 
            ? "https://cdn-icons-png.flaticon.com/512/179/179386.png"
            : "https://cdn-icons-png.flaticon.com/512/179/179377.png",
        });
      }

      if (data.subjectId === selectedSubject) {
        fetchLeaderboard(selectedSubject);
      }
    };

    socket.on("leaderboard:rankChanged", handleRankChange);
    return () => {
      socket.off("leaderboard:rankChanged", handleRankChange);
    };
  }, [selectedSubject]);

  useEffect(() => {
    if (typeof Notification !== 'undefined' && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (selectedSubject) {
      rebuildAndFetchLeaderboard(selectedSubject);
    }
  }, [selectedSubject]);

  const handleRefresh = () => {
    if (selectedSubject) {
      rebuildAndFetchLeaderboard(selectedSubject);
    }
  };

  const top3 = students.slice(0, 3);
  const others = students.slice(3);

  return (
    <>
      <Header />
      
      {/* Fullscreen Effects */}
      {showEffect && rankChangeAlert?.change === "up" && <Confetti />}
      {showEffect && rankChangeAlert?.change === "down" && <RainStorm />}
      
      <div className="container py-5 text-center" style={{ marginTop: "50px" }}>
        <h2 className="fw-bold mb-4 text-success">🏆 Bảng Xếp Hạng Học Tập 🏆</h2>

        <LeaderboardHeader
          selectedSubject={selectedSubject}
          onSubjectChange={setSelectedSubject}
          onRefresh={handleRefresh}
        />

        {isRefreshing && (
          <div className="alert alert-info my-3">
            <span className="spinner-border spinner-border-sm me-2"></span>
            Đang cập nhật bảng xếp hạng...
          </div>
        )}

        {/* Rank Change Alert */}
        {rankChangeAlert && (
          <div 
            className={`alert alert-${rankChangeAlert.change === "up" ? "success" : "warning"} alert-dismissible fade show my-3`}
            role="alert"
            style={{
              animation: "bounceIn 0.8s ease-out",
              boxShadow: rankChangeAlert.change === "up" 
                ? "0 8px 32px rgba(40, 167, 69, 0.6)" 
                : "0 8px 32px rgba(255, 193, 7, 0.6)",
              border: rankChangeAlert.change === "up" 
                ? "3px solid #28a745" 
                : "3px solid #ffc107",
              background: rankChangeAlert.change === "up"
                ? "linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)"
                : "linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)",
              position: 'relative',
              zIndex: 10000,
            }}
          >
            <div className="d-flex align-items-center">
              <div 
                className="me-3" 
                style={{ 
                  fontSize: "3.5rem",
                  animation: rankChangeAlert.change === "up" ? "spin 2s ease-in-out" : "shake 1s ease-in-out",
                }}
              >
                {rankChangeAlert.change === "up" ? "🎉" : "😢"}
              </div>
              <div className="text-start flex-grow-1">
                <h4 
                  className="alert-heading mb-2 fw-bold"
                  style={{
                    color: rankChangeAlert.change === "up" ? "#155724" : "#856404",
                    textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
                  }}
                >
                  {rankChangeAlert.change === "up" 
                    ? "🎊 Chúc mừng! Bạn đã thăng hạng!" 
                    : "⚡ Hạng của bạn đã giảm"}
                </h4>
                <div className="mt-2">
                  <span 
                    className="badge me-2" 
                    style={{ 
                      fontSize: "1rem",
                      padding: "0.5rem 1rem",
                      backgroundColor: rankChangeAlert.change === "up" ? "#28a745" : "#856404",
                      color: "white",
                    }}
                  >
                    📚 {rankChangeAlert.subjectName}
                  </span>
                  <span 
                    className="badge"
                    style={{ 
                      fontSize: "1.1rem",
                      padding: "0.5rem 1rem",
                      backgroundColor: rankChangeAlert.change === "up" ? "#155724" : "#f39c12",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    Hạng {rankChangeAlert.oldRank} → Hạng {rankChangeAlert.newRank}
                    <span style={{ marginLeft: "0.5rem" }}>
                      {rankChangeAlert.change === "up" 
                        ? `(+${rankChangeAlert.oldRank - rankChangeAlert.newRank} ⬆️)`
                        : `(-${rankChangeAlert.newRank - rankChangeAlert.oldRank} ⬇️)`}
                    </span>
                  </span>
                </div>
                {rankChangeAlert.change === "up" && (
                  <p className="mb-0 mt-2 fst-italic" style={{ color: "#155724", fontSize: "0.95rem" }}>
                    Thật tuyệt vời! Hãy tiếp tục phát huy! 💪
                  </p>
                )}
                {rankChangeAlert.change === "down" && (
                  <p className="mb-0 mt-2 fst-italic" style={{ color: "#856404", fontSize: "0.95rem" }}>
                    Đừng nản chí! Cố gắng lên nhé! 💪
                  </p>
                )}
              </div>
            </div>
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => {
                setRankChangeAlert(null);
                setShowEffect(false);
              }}
              aria-label="Close"
            ></button>
          </div>
        )}

        <LeaderboardTop3 top3={top3} />
        <LeaderboardList students={others} />
      </div>

      <style>{`
        @keyframes confettiFall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        @keyframes rainFall {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh);
            opacity: 0.2;
          }
        }

        @keyframes glowPulse {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }

        @keyframes darkFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes lightningFlash {
          0% {
            opacity: 0;
          }
          50% {
            opacity: 0.9;
          }
          100% {
            opacity: 0;
          }
        }

        @keyframes cloudDrift {
          0% {
            transform: translateX(-100%);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateX(0);
            opacity: 0.8;
          }
        }

        @keyframes bounceIn {
          0% {
            transform: scale(0.3);
            opacity: 0;
          }
          50% {
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes spin {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-15deg); }
          75% { transform: rotate(15deg); }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
      `}</style>
    </>
  );
};

export default LeaderboardPage;