import React from "react";
import Sujata from "../../assets/imgs/sac/banerjee-sujata.jpg";
import TerryBenzel from "../../assets/imgs/sac/benzel-terry.jpg";
import CeesdeLaat from "../../assets/imgs/sac/de-laat-cees.jpg";
import PhillipaGill from "../../assets/imgs/sac/gill-jennifer.jpg";
import CraigPartridge from "../../assets/imgs/sac/partridge-chris.jpg";
import ScottShenker from "../../assets/imgs/sac/shenker-scott.jpg";
import FrankWuerthwein from "../../assets/imgs/sac/wuerthwien-frank.jpg";
import BackgroundImage from "../../assets/imgs/network-bg.svg";

const sacMembers = [
  {
    "name": "Sujata Banerjee",
    "photo": Sujata,
    "organization": "VMware Research",
    "url": "https://research.vmware.com/researchers/sujata-banerjee",
    "description": "Sujata Banerjee is a Sr. Director of Research at VMware. Her expertise is in topics related to software defined networking and network functions virtualization, and she is broadly interested in network automation and performance. Prior to VMware, she was a distinguished technologist and research director at Hewlett Packard Enterprise Labs, leading a network systems research group which conducted research on enterprise, service provider and datacenter networks. Before her industrial research career, she held a tenured Associate Professor position at the University of Pittsburgh. She received her Ph.D. from the University of Southern California (USC), along with B.Tech. and M.Tech. degrees from the Indian Institute of Technology (IIT) Bombay in Electrical Engineering. She holds 35 US patents and is a recipient of the U.S. National Science Foundation (NSF) CAREER award."
  },
  {
    "name": "Terry Benzel",
    "photo": TerryBenzel,
    "organization": "University of Southern California",
    "url": "https://www.isi.edu/people/tbenzel/about",
    "description": "Ms. Terry Benzel is the Director of the Internet and Networked Systems Division at USC Information Sciences Institute (ISI). Ms. Benzel has served as the PI and Director of Outreach for the DETER Cyber Security Experimentation Project for over 10 years. She is responsible for overall project management, R&D and advanced testbed development and operations. Her research interests are in the science of cyber security experimentation and next generation distributed experimentation methodologies. She is a key contributor to the NSF sponsored report Cyber Experimentation of the Future. Ms. Benzel is a member of the NSF CISE Advisory Committee, the NSF CISE Committee of Visitors, Sandia National Labs SECURE External Advisory Board and a member of several private boards. She has testified twice before the U.S. House Committee on Science."
  },
  {
    "name": "Cees de Laat",
    "photo": CeesdeLaat,
    "organization": "University of Amsterdam",
    "url": "https://delaat.net/",
    "description": "Cees de Laat is chair of the System and Network Engineering research group at the University of Amsterdam. Research in his group includes optical/switched networking for Internet transport of massive amounts of data in petascale eScience applications, semantic web to describe networks and associated resources, distributed cross-organization authorization architectures, service composition in virtualized (cloud) context, and systems security and privacy of information in distributed environments. De Laat serves as a board member of Open Grid Forum and is chair of GridForum.nl. He is a co-founder and organizer of several of the past meetings of the Global Lambda Integrated Facility (GLIF) and a founding member of CineGrid.org."
  },
  {
    "name": "Phillipa Gill",
    "photo": PhillipaGill,
    "organization": "University of Massachusetts, Amherst",
    "url": "https://people.cs.umass.edu/~phillipa/",
    "description": "Phillipa Gill is an associate professor of Computer Science at the University of Massachusetts -- Amherst. Prior to joining the University of Massachusetts, she spent three years as an assistant professor at Stony Brook University. Before joining Stony Brook, she spent a year as a postdoctoral fellow at The Citizen Lab in the Munk School of Global Affairs at the University of Toronto. Prior to her postdoc, she completed a PhD in Computer Science at the University of Toronto. While working on her PhD, she spent time in the eXtreme Computing Group (XCG) at Microsoft Research, Boston University Security Group, and AT&T Labs--Research."
  },
  {
    "name": "Craig Partridge",
    "photo": CraigPartridge,
    "organization": "Colorado State University",
    "url": "https://compsci.colostate.edu/person/?id=B671CC0FDBA374C584551B7982C0D4DE&sq=t",
    "description": "Craig Partridge is a professor and department chair in the department of Computer Science at CSU. Before coming to CSU, he spent 35 years working for Raytheon BBN Technologies. As chief scientist for networking research at Raytheon BBN, he oversaw 70 researchers working on projects primarily funded by the U.S. Department of Defense. Partridge received his AB in History and his MSc and PhD in Computer Science from Harvard University. He has held adjunct faculty positions at Stanford University and the University of Michigan and is a fellow of the Institute for Electrical and Electronic Engineers and the Association of Computing Machinery. In 2017, Partridge was inducted into the Internet Hall of Fame."
  },
  {
    "name": "Scott Shenker",
    "photo": ScottShenker,
    "organization": "University of California, Berkeley",
    "url": "https://www2.eecs.berkeley.edu/Faculty/Homepages/shenker.html",
    "description": "Scott Shenker spent his academic youth studying theoretical physics but soon gave up chaos theory for computer science. Continuing to display a remarkably short attention span, his research over the years has wandered from performance modeling and networking to game theory and economics. Unable to focus on any single topic, his current research projects include software-defined networking, network function virtualization, far memory, edge computing, and Internet architecture. Unable to hold a steady job, he currently splits his time between the UC Berkeley Computer Science Division and the International Computer Science Institute."
  },
  {
    "name": "Frank Wuerthwein",
    "photo": FrankWuerthwein,
    "organization": "University of California, San Diego",
    "url": "https://www.sdsc.edu/research/researcher_spotlight/wuerthwein_frank.html",
    "description": "Frank Würthwein is the Executive Director of the Open Science Grid, a national cyberinfrastructure to advance the sharing of resources, software, and knowledge, and a physics professor at UC San Diego. He received his PhD from Cornell in 1995. After holding appointments at Caltech and MIT, he joined the UC San Diego faculty in 2003. His research focuses on experimental particle physics and distributed high-throughput computing. His primary physics interests lie in searching for new phenomena at the high energy frontier with the CMS detector at the Large Hadron Collider. His topics of interest include, but are not limited to, the search for dark matter, supersymmetry, and electroweak symmetry breaking. As an experimentalist, he is interested in instrumentation and data analysis. In recent years, this meant developing, deploying, and operating a worldwide distributed computing system for high-throughput computing with large data volumes."
  }
]

const SAC = () => {
  return (
    <div className="container pb-5 static-page">
      <img src={BackgroundImage} alt={`static page background`} className="static-page-bg"/>
      <h1 className="mb-4">Scientific Advisory Committee</h1>
      <p>The FABRIC Scientific Advisory Committee (SAC) will help guide the project by providing recommendations and critical feedback. Initially, the focus will be on reviewing the FABRIC design to ensure it can meet the diverse research needs of the future. The committee will also facilitate critical partnerships between collaborating institutions both within and outside of the US. As work progresses, the SAC will develop grand challenges that focus on solving key research problems using the FABRIC infrastructure.</p>
      <h2 className="text-primary mb-5">
        Meet the Committee
      </h2>
      {
        sacMembers.map((member, index) => 
        <div className="row mb-3" key={`fabric-sac-member-${index}`}>
          <div className="col-3">
            <img src={member.photo} alt={`FABRIC SAC ${member.name}`} className="member-photo-round"/>
          </div>
          <div className="col-9">
            <h3 className="text-primary mb-3">
              {member.name}
            </h3>
            <h5>
              {member.organization}
            </h5>
            <p>
              {member.description}
            </p>
            <div className="d-flex justify-content-end mb-4">
              <a href={member.url} target="_blank" rel="noreferrer">
                <u>&gt;&gt;&gt; Learn more about {member.name}</u>
              </a>
            </div>
          </div>
        </div>
        )
      }
    </div>
  );
};

export default SAC;
