// services/notificationTemplates.ts

export const NotificationTemplates = {
  // ==================== QUIZ NOTIFICATIONS ====================
  
  // Khi Admin tạo Quiz mới
  QUIZ_CREATED: (quizTitle: string, subjectName: string) => ({
    type: "QUIZ" as const,
    title: "📝 Bài Quiz mới",
    message: `Quiz "${quizTitle}" trong môn ${subjectName} vừa được tạo. Hãy tham gia ngay!`,
    sendEmail: true,
  }),

  // Khi Admin cập nhật Quiz
  QUIZ_UPDATED: (quizTitle: string) => ({
    type: "QUIZ" as const,
    title: "🔄 Quiz đã được cập nhật",
    message: `Quiz "${quizTitle}" đã có thay đổi mới. Vui lòng xem lại!`,
    sendEmail: false,
  }),

  // Khi Admin xóa Quiz
  QUIZ_DELETED: (quizTitle: string) => ({
    type: "QUIZ" as const,
    title: "🗑️ Quiz đã bị xóa",
    message: `Quiz "${quizTitle}" đã bị xóa khỏi hệ thống.`,
    sendEmail: true,
  }),

  // Khi User hoàn thành Quiz
  QUIZ_COMPLETED: (quizTitle: string, score: number, totalScore: number) => ({
    type: "SCORE" as const,
    title: "✅ Hoàn thành Quiz",
    message: `Bạn đã hoàn thành quiz "${quizTitle}". Điểm số: ${score}/${totalScore}`,
    sendEmail: true,
  }),

  // Khi User đạt điểm cao
  HIGH_SCORE_ACHIEVED: (quizTitle: string, score: number) => ({
    type: "SCORE" as const,
    title: "🏆 Điểm số xuất sắc!",
    message: `Chúc mừng! Bạn đạt ${score} điểm trong quiz "${quizTitle}"`,
    sendEmail: true,
  }),

  // ==================== SUBJECT NOTIFICATIONS ====================
  
  // Khi Admin tạo Subject mới
  SUBJECT_CREATED: (subjectName: string) => ({
    type: "SUBJECT" as const,
    title: "📚 Môn học mới",
    message: `Môn học "${subjectName}" vừa được thêm vào hệ thống.`,
    sendEmail: true,
  }),

  // Khi Admin cập nhật Subject
  SUBJECT_UPDATED: (subjectName: string) => ({
    type: "SUBJECT" as const,
    title: "🔄 Môn học đã cập nhật",
    message: `Thông tin môn học "${subjectName}" đã được cập nhật.`,
    sendEmail: false,
  }),

  // Khi Admin xóa Subject
  SUBJECT_DELETED: (subjectName: string) => ({
    type: "SUBJECT" as const,
    title: "🗑️ Môn học đã bị xóa",
    message: `Môn học "${subjectName}" đã bị xóa khỏi hệ thống.`,
    sendEmail: true,
  }),

  // ==================== TOPIC NOTIFICATIONS ====================
  
  // Khi Admin tạo Topic mới
  TOPIC_CREATED: (topicTitle: string, subjectName: string) => ({
    type: "TOPIC" as const,
    title: "📖 Chủ đề mới",
    message: `Chủ đề "${topicTitle}" trong môn ${subjectName} vừa được thêm.`,
    sendEmail: true,
  }),

  // Khi Admin cập nhật Topic
  TOPIC_UPDATED: (topicTitle: string) => ({
    type: "TOPIC" as const,
    title: "🔄 Chủ đề đã cập nhật",
    message: `Nội dung chủ đề "${topicTitle}" đã được cập nhật.`,
    sendEmail: false,
  }),

  // Khi có Video mới trong Topic
  VIDEO_ADDED: (topicTitle: string) => ({
    type: "TOPIC" as const,
    title: "🎥 Video mới",
    message: `Video học tập mới đã được thêm vào chủ đề "${topicTitle}".`,
    sendEmail: true,
  }),

  // ==================== USER ACCOUNT NOTIFICATIONS ====================
  
  // Khi Admin tạo tài khoản cho User
  ACCOUNT_CREATED: (userName: string) => ({
    type: "ACCOUNT" as const,
    title: "🎉 Chào mừng bạn!",
    message: `Tài khoản của bạn đã được tạo thành công. Hãy bắt đầu học tập ngay!`,
    sendEmail: true,
  }),

  // Khi User đăng ký thành công
  REGISTRATION_SUCCESS: () => ({
    type: "ACCOUNT" as const,
    title: "✅ Đăng ký thành công",
    message: `Chào mừng bạn đến với hệ thống! Hãy khám phá các khóa học ngay.`,
    sendEmail: true,
  }),

  // Khi Admin xóa User
  ACCOUNT_DELETED: () => ({
    type: "ACCOUNT" as const,
    title: "⚠️ Tài khoản đã bị xóa",
    message: `Tài khoản của bạn đã bị xóa khỏi hệ thống.`,
    sendEmail: true,
  }),

  // Khi User cập nhật thông tin
  PROFILE_UPDATED: () => ({
    type: "ACCOUNT" as const,
    title: "✅ Cập nhật thành công",
    message: `Thông tin cá nhân của bạn đã được cập nhật.`,
    sendEmail: false,
  }),

  // Khi User đổi mật khẩu
  PASSWORD_CHANGED: () => ({
    type: "ACCOUNT" as const,
    title: "🔒 Mật khẩu đã thay đổi",
    message: `Mật khẩu của bạn đã được thay đổi thành công.`,
    sendEmail: true,
  }),

  // ==================== LEARNING PROGRESS NOTIFICATIONS ====================
  
  // Khi User hoàn thành một Subject
  SUBJECT_COMPLETED: (subjectName: string, completionRate: number) => ({
    type: "SYSTEM" as const,
    title: "🎓 Hoàn thành môn học",
    message: `Chúc mừng! Bạn đã hoàn thành ${completionRate}% môn học "${subjectName}".`,
    sendEmail: true,
  }),

  // Nhắc nhở học tập
  LEARNING_REMINDER: (daysInactive: number) => ({
    type: "SYSTEM" as const,
    title: "📚 Đã lâu rồi bạn không học!",
    message: `Bạn đã ${daysInactive} ngày không học. Hãy tiếp tục hành trình học tập nhé!`,
    sendEmail: true,
  }),

  // ==================== ADMIN NOTIFICATIONS ====================
  
  // Khi có User mới đăng ký
  NEW_USER_REGISTERED: (userName: string, userEmail: string) => ({
    type: "USER" as const,
    title: "👤 Người dùng mới",
    message: `${userName} (${userEmail}) vừa đăng ký tài khoản.`,
    sendEmail: false,
  }),

  // Khi có nhiều User làm Quiz
  QUIZ_POPULAR: (quizTitle: string, attemptCount: number) => ({
    type: "QUIZ" as const,
    title: "🔥 Quiz phổ biến",
    message: `Quiz "${quizTitle}" đã có ${attemptCount} lượt thực hiện.`,
    sendEmail: false,
  }),

  // Thống kê hàng ngày cho Admin
  DAILY_STATISTICS: (newUsers: number, quizCompleted: number) => ({
    type: "SYSTEM" as const,
    title: "📊 Thống kê hôm nay",
    message: `Hôm nay có ${newUsers} người dùng mới và ${quizCompleted} lượt hoàn thành quiz.`,
    sendEmail: true,
  }),
};