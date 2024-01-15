import meter1 from "../assets/img/meter1.svg";
import meter2 from "../assets/img/meter2.svg";
import meter3 from "../assets/img/meter3.svg";

export const Skills = () => {
  return (
    <section className="skill" id="skills">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="skill-bx">
              <h2>Skills</h2>
              <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry...</p>
              <div className="skills-grid">
                <div className="skill-item">
                  <img src={meter1} alt="Web Development" />
                  <h5>Web Development</h5>
                </div>
                <div className="skill-item">
                  <img src={meter2} alt="Brand Identity" />
                  <h5>Brand Identity</h5>
                </div>
                <div className="skill-item">
                  <img src={meter3} alt="Logo Design" />
                  <h5>Logo Design</h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
