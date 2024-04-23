import { Col } from "react-bootstrap";

export const ProjectCard = ({ title, description, imgUrl, githubUrl }) => {
  const handleClick = () => {
    if (githubUrl) {
      window.open(githubUrl, "_blank");
    }
  };

  return (
    <Col size={12} sm={6} md={4}>
      <div className="project-link" onClick={handleClick} style={{ cursor: githubUrl ? 'pointer' : 'default' }}>
        <div className="proj-imgbx">
          <img src={imgUrl} alt={title} />
          <div className="proj-txtx">
            <h4>{title}</h4>
            <span>{description}</span>
          </div>
        </div>
      </div>
    </Col>
  );
};
