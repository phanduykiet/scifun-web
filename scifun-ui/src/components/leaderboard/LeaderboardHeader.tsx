import React from "react";
import { Button, Form } from "react-bootstrap";

interface LeaderboardHeaderProps {
  selectedSubject: string;
  subjects: string[];
  onSubjectChange: (subject: string) => void;
  onRefresh: () => void;
}

const LeaderboardHeader: React.FC<LeaderboardHeaderProps> = ({
  selectedSubject,
  subjects,
  onSubjectChange,
  onRefresh,
}) => {
  return (
    <div className="d-flex justify-content-center align-items-center gap-3 mb-4 flex-wrap">
      <Form.Select
        value={selectedSubject}
        onChange={(e) => onSubjectChange(e.target.value)}
        style={{ width: "220px" }}
      >
        {subjects.map((subj) => (
          <option key={subj} value={subj}>
            {subj}
          </option>
        ))}
      </Form.Select>

      <Button variant="success" onClick={onRefresh}>
        🔄 Làm mới
      </Button>
    </div>
  );
};

export default LeaderboardHeader;
