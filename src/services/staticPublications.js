const publications = [
  {
    title: "FabFed: Tool-Based Network Federation for Testbed of Testbeds-Paradigm and Practice",
    year: "2024",
    authors: "Xi Yang, Ezra Kissel, Abdelilah Essiari, Liang Zhang, Tom Lehman, Inder Monga, Paul Ruth, Komal Thareja, Ilya Baldin",
    link: "https://ieeexplore.ieee.org/document/10620897",
    project_name: "FABRIC Staff",
    project_uuid: "990d8a8b-7e50-4d13-a3be-0f133ffa8653"
  },
  {
    title: "Sliced WANs for Data-Intensive Science: Deployment Experiences and Performance Analysis",
    year: "2024",
    authors: "Edgard C. Pontes, Vitor Zanotelli, Magnos Martinello, Jordi Ros-Giralt, Everson S. Borges, Moisés R. N. Ribeiro and Harvey Newman",
    link: "https://sol.sbc.org.br/index.php/sbrc/article/download/29812/29615/",
    project_name: "PolKA - Polynomial Key-based Architecture for Source Routing",
    project_uuid: "4a1f84a9-83ae-40d9-8f9b-dc582eefce11"
  },
  {
    title: "Advancing Anomaly Detection in Computational Workflows with Active Learning",
    year: "2024",
    authors: "Krishnan Raghavan, George Papadimitriou, Hongwei Jin, Anirban Mandal, Mariam Kiran, Prasanna Balaprakash, Ewa Deelman",
    link: "https://arxiv.org/abs/2405.06133",
    project_name: "DOE PoSeiDon",
    project_uuid: "1a0f06eb-75ea-4258-9b92-ff4d8cf999b0"
  },
  {
    title: "Multi-Domain Secure DDS Networks for Aerial and Ground Vehicle Communications",
    year: "2024",
    authors: "Daniel Pendleton",
    link: "https://tigerprints.clemson.edu/cgi/viewcontent.cgi?article=5326&context=all_theses",
    project_name: "FABRIC Clemson",
    project_uuid: "7bc05490-ba40-45ba-99dc-b011680825d2"
  },
  {
    title: "Hydra: A Scalable Decentralized P2P Storage Federation for Large Scientific Datasets",
    year: "2024",
    authors: "Justin Presley, Xi Wang, Xusheng Ai, Tianyuan Yu, Tym Brandel, Proyash Podder, Varun Patil, Alex Afanasyev, F. Alex Feltus, Lixia Zhang, Susmit Shannigrahi",
    link: "http://www.conf-icnc.org/2024/papers/p810-presley.pdf",
    project_name: "The Genome Lake",
    project_uuid: "b3cffedd-ddb4-43ee-b57d-459b768e14ca"
  },
  {
    title: "P4-based In-Network Telemetry for FPGAs in the Open Cloud Testbed and FABRIC",
    year: "2024",
    authors: "Sandeep Bal, Zhaoyang Han, Suranga Handagala, Mert Cevik, Michael Zink, Miriam Leeser",
    link: "http://www1.coe.neu.edu/~zhhan/papers/sand_infocom24_wkshps.pdf",
    project_name: "PRATE",
    project_uuid: "c658fc95-b820-42eb-a40b-1770a913fab3"
  },
  {
    title: "To switch or not to switch to TCP Prague? Incentives for adoption in a partial L4S deployment",
    year: "2024",
    authors: "Fatih Berkay Sarpkaya, Ashutosh Srivastava, Fraida Fund, Shivendra Panwar",
    link: "https://arxiv.org/pdf/2407.00464",
    project_name: "nyunetworks",
    project_uuid: "073ee843-2310-45bd-a01f-a15d808827dc"
  },
  {
    title: "Offloading NVMe over Fabrics (NVMe-oF) to SmartNICs on an at-scale Distributed Testbed",
    year: "2024",
    authors: "Shoaib Basu, Deepak Nadig",
    link: "https://scholar.google.com/scholar_url?url=https://ieeexplore.ieee.org/abstract/document/10588915/&hl=en&sa=X&d=4097639911577649628&ei=WQKZZo_dCd246rQPnd604AU&scisig=AFWwaeYhPS-hd1hwlVvd86JuR3St&oi=scholaralrt&hist=_WCF8wgAAAAJ:10601601214210815374:AFWwaeYho19qVdQei1-kQz5oGItB&html=&pos=0&folt=kw",
    project_name: "Purdue CYAN Lab",
    project_uuid: "42b3494b-982f-4fe8-b160-26f28c3e33c0"
  },
  {
    title: "Investigating Data Center Network Protocols",
    year: "2024",
    authors: "Peter Willis, Nirmala Shenoy, Yin Pan, Bill Stackpole",
    link: "https://dl.acm.org/doi/10.1145/3673422.3674897",
    project_name: "Meshed Tree Protocol for Data Center Networks",
    project_uuid: "fec0d0d8-a7a8-4eac-b091-87f7914af796"
  },
  {
    title: "The Evolving ERN Cryo-EM Federated Instrument Pilot Project",
    year: "2024",
    authors: "Maureen Dougherty, Barr von Oehsen, Jason Kaelber, Jeremy Schafer, D. Balamurugan, Morgan Ludwig, John Goodhue",
    link: "https://dl.acm.org/doi/10.1145/3626203.3670592",
    project_name: "Ecosystem for Research Networking",
    project_uuid: "8e0099fa-e38f-4020-9959-4289039d36bd"
  },
  {
    title: "Post-Quantum Cryptography (PQC) Network Instrument: Measuring PQC Adoption Rates and Identifying Migration Pathways",
    year: "2024",
    authors: "Jakub Sowa, Bach Hoang, Advaith Yeluru, Steven Qie, Anita Nikolich, Ravishanka Iyer, Phuong Cao",
    link: "https://arxiv.org/pdf/2408.00054",
    project_name: "",
    project_uuid: ""
  },
  {
    title: "A Technique for Secure Variant Calling on Human Genome Sequences Using SmartNICs",
    year: "2024",
    authors: "Praveen Rao, Khawar Shehzad",
    link: "https://www.computer.org/csdl/proceedings-article/cloud/2024/685300a328/1ZMekOsdsD6",
    project_name: "GAF",
    project_uuid: "68926660-da26-475d-9c40-50ebf0a5a812"
  },
  {
    title: "Network Traffic as a Federated Service",
    year: "2023",
    authors: "Jack Brassil",
    link: "https://www.cs.princeton.edu/~jbrassil/public/projects/staas/IEEE-FNWF2022-STAAS.pdf",
    project_name: "staas",
    project_uuid: "17f7e488-e1b7-4ea9-b657-e69cdbb27a38"
  },
  {
    title: "Efficient Variant Calling on Human Genome Sequences Using a GPU-Enabled Commodity Cluster",
    year: "2023",
    authors: "Manas Jyoti Das, Khawar Shehzad, Praveen Rao",
    link: "https://dl.acm.org/doi/10.1145/3583780.3615268",
    project_name: "GAF",
    project_uuid: "68926660-da26-475d-9c40-50ebf0a5a812"
  },
  {
    title: "Evaluating SciStream (Federated Scientific Data Streaming Architecture) on FABRIC",
    year: "2023",
    authors: "Chengyi Qu, Joaquin Chung, Zhengchun Liu, Tekin Bicer, Rajkumar Kettimuthu",
    link: "https://ieeexplore.ieee.org/document/10024674",
    project_name: "SciStream",
    project_uuid: "f4344c37-52e3-4d0c-a354-9311342ec109"
  },
  {
    title: "Capture and Analysis of Traffic Traces on a Wide-Area NDN Testbed",
    year: "2023",
    authors: "Sankalpa Timilsina, Davide Pesavento, Junxiao Shi, Susmit Shannigrahi, Lotfi Benmohamed",
    link: "https://dl.acm.org/doi/10.1145/3623565.3623707",
    project_name: "NDN-DPDK",
    project_uuid: "d767bb56-903c-44e3-84a9-9aaa39acff98"
  },
  {
    title: "GNSGA: A Decentralized Data Replication Algorithm for Big Science Data",
    year: "2023",
    authors: "Xi Wang, Xusheng Ai, F. Alex Feltus, Susmit Shannigrahi",
    link: "https://ieeexplore.ieee.org/document/10186357",
    project_name: "The Genome Lake",
    project_uuid: "b3cffedd-ddb4-43ee-b57d-459b768e14ca"
  },
  {
    title: "Elephants Sharing the Highway: Studying TCP Fairness in Large Transfers over High Throughput Links",
    year: "2023",
    authors: "Imtiaz Mahmud, George Papadimitriou, Cong Wang, Mariam Kiran, Anirban Mandal, and Ewa Deelman",
    link: "https://dl.acm.org/doi/10.1145/3624062.3624594",
    project_name: "DOE PoSeiDon",
    project_uuid: "1a0f06eb-75ea-4258-9b92-ff4d8cf999b0"
  },
  {
    title: "Some of the Internet may be Heading Towards BBR Dominance: An Experimental Study ",
    year: "2023",
    authors: "A. Srivastava, F. Fund and S. S. Panwar",
    link: "https://witestlab.poly.edu/~ffund/pubs/bbr_cnert23.pdf",
    project_name: "nyunetworks",
    project_uuid: "073ee843-2310-45bd-a01f-a15d808827dc"
  },
  {
    title: "FABRIC Testbed from the Eyes of a Network Researcher",
    year: "2023",
    authors: "Edgard Pontes, Magnos Martinello, Christina Dominicini, Marcos Schwarz, Moises, Ribeiro, Everson Borges, Italo Brito, Jeronimo Bezerra, Marinho Barcellos",
    link: "https://www.scribd.com/document/711961374/FABRIC-Testbed-from-the-Eyes-of-a-Network-Researcher",
    project_name: "PolKA - Polynomial Key-based Architecture for Source Routing",
    project_uuid: "4a1f84a9-83ae-40d9-8f9b-dc582eefce11"
  },
  {
    title: "Network Services Management using Programmable Data Planes for Visual Cloud Computing",
    year: "2023",
    authors: "Alicia Esquivel Morel, Prasad Calyam, Chengyi Qu, Durbek Gafurov, Cong Wang, Komal Thareja, Anirban Mandal, Eric Lyons, Michael Zink, George Papadimitriou, Ewa Deelman",
    link: "https://ieeexplore.ieee.org/abstract/document/10074183",
    project_name: "Flynet",
    project_uuid: "f8a6e0b0-ad14-47cb-9764-74c20ef3e4fc"
  },
  {
    title: "Understanding the Performance of TCP BBRv2 Using FABRIC",
    year: "2023",
    authors: "Jose Gomez, Elie Kfoury, Jorge Crichign, Gautam Srivastava",
    link: "https://ieeexplore.ieee.org/abstract/document/10299749",
    project_name: "TCP and P4 Programmable Data Plane Switches",
    project_uuid: "8eaa3ec2-65e7-49a3-8c09-e1761141a6ad"
  },
  {
    title: "FlyNet: Drones on the Horizon",
    year: "2023",
    authors: "Alicia Esquivel Morel, Chengyi Qu, Prasad Calyam, Cong Wang, Komal Thareja, Anirban Mandal, Eric Lyons, Michael Zink, George Papadimitriou, Ewa Deelman",
    link: "https://ieeexplore.ieee.org/abstract/document/10122650",
    project_name: "Flynet",
    project_uuid: "f8a6e0b0-ad14-47cb-9764-74c20ef3e4fc"
  },
  {
    title: 'Replication: "When to Use and When Not to Use BBR"',
    year: "2023",
    authors: "Soumyadeep Datta, Fraida Fund",
    link: "https://dl.acm.org/doi/10.1145/3618257.3624837",
    project_name: "nyunetworks",
    project_uuid: "073ee843-2310-45bd-a01f-a15d808827dc"
  },
  {
    title: "Some of the Internet may be Heading Towards BBR Dominance: An Experimental Study",
    year: "2023",
    authors: "Ashutosh Srivastava, Fraida Fund, Shivendra S. Panwar",
    link: "https://witestlab.poly.edu/~ffund/pubs/bbr_cnert23.pdf",
    project_name: "nyunetworks",
    project_uuid: "073ee843-2310-45bd-a01f-a15d808827dc"
  },
  {
    title: "Experiments on Network Services for Video Transmission using FABRIC Instrument Resources",
    year: "2023",
    authors: "Alicia Esquivel Morel, Durbek Gafurov, Prasad Calyam, Cong Wang, Komal Thareja, Anirban Mandal, Eric Lyons, Michael Zink, George Papadimitriou, Ewa Deelman",
    link: "https://ieeexplore.ieee.org/document/10225817",
    project_name: "Flynet",
    project_uuid: "f8a6e0b0-ad14-47cb-9764-74c20ef3e4fc"
  },
  {
    title: "A Data Set and Reference Experiments for Multipath Wireless Emulation on Public Testbeds",
    year: "2023",
    authors: "Ilknur Aydin, Fraida Fund, Shivendra S. Panwar",
    link: "https://ieeexplore.ieee.org/abstract/document/10225842/",
    project_name: "nyunetworks",
    project_uuid: "073ee843-2310-45bd-a01f-a15d808827dc"
  },
  {
    title: "A Framework for Location Independent Data and Compute for Data Intensive Science",
    year: "2023",
    authors: "Sankalpa Timilsina",
    link: "https://search.proquest.com/openview/02572b110d9a657fb5e0c9a13f76796c/1?pq-origsite=gscholar&cbl=18750&diss=y",
    project_name: "NDN-DPDK",
    project_uuid: "d767bb56-903c-44e3-84a9-9aaa39acff98"
  },
  {
    title: "A Federated Data Repository Using Named Data Networking",
    year: "2023",
    authors: "Justin Corbin Presley",
    link: "https://search.proquest.com/openview/d06f45ffdf16b1e8da7078e2b326cc5b/1?pq-origsite=gscholar&cbl=18750&diss=y",
    project_name: "The Genome Lake",
    project_uuid: "b3cffedd-ddb4-43ee-b57d-459b768e14ca"
  },
  {
    title: "Inverse Response Time Ratio Scheduler: Optimizing Throughput and Response Time for Serverless Computing",
    year: "2023",
    authors: "Mina Williams, Ibrahim Matta",
    link: "https://ieeexplore.ieee.org/document/10475800",
    project_name: "",
    project_uuid: ""
  },
  {
    title: "Hydra -- A Federated Data Repository over NDN",
    year: "2022",
    authors: "Justin Presley, Xi Wang, Tym Brandel, Xusheng Ai, Proyash Podder, Tianyuan Yu, Varun Patil, Lixia Zhang, Alex Afanasyev, F. Alex Feltus, Susmit Shannigrahi",
    link: "https://arxiv.org/abs/2211.00919",
    project_name: "The Genome Lake",
    project_uuid: "b3cffedd-ddb4-43ee-b57d-459b768e14ca"
  },
  {
    title: "FABRIC network service model",
    year: "2022",
    authors: "Paul Ruth, Ilya Baldin, Komal Thareja, Tom Lehman, Xi Yang, Ezra Kissel",
    link: "https://ieeexplore.ieee.org/abstract/document/9829810",
    project_name: "FABRIC Staff",
    project_uuid: "990d8a8b-7e50-4d13-a3be-0f133ffa8653"
  },
  {
    title: "Fabric: A national-scale programmable experimental network infrastructure",
    year: "2019",
    authors: "Ilya Baldin, Anita Nikolich, James Griffioen, Indermohan Inder S Monga, Kuang-Ching Wang, Tom Lehman, Paul Ruth",
    link: "https://ieeexplore.ieee.org/abstract/document/8972790/",
    project_name: "FABRIC Staff",
    project_uuid: "990d8a8b-7e50-4d13-a3be-0f133ffa8653"
  }
]

export default publications;