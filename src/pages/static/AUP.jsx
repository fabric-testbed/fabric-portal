import React from "react";

const AUP = () => {
  return (
    <div className="container pb-5">
      <h1 className="mb-4">FABRIC Acceptable Use Policy</h1>
      <h2>Introduction </h2>
      <p>FABRIC is a National Science Foundation (NSF) funded scientific infrastructure for open research. As a condition of using FABRIC for experimentation, you agree to the terms and conditions of usage below. This policy applies to everyone who uses FABRIC resources or data, whether physically located on a campus hosting FABRIC resources or remotely accessing them. Although users’ local information technology services may have supplemental policies regarding acceptable use and user privacy expectations, those policies cannot diminish the FABRIC policies as set forth below. The FABRIC project reserves the right to change these Terms of Use at any time. The Terms of Use are available online at: <a href="https://whatisfabric.net/" target="_blank" rel="noopener noreferrer">whatisfabric.net</a>.</p>
      <h2>I. Applicable Laws and Policies </h2>
      <p>You agree not to use FABRIC in violation of any applicable law. The use of FABRIC is subject to all applicable laws, and to all applicable policies and regulations of the Universities and sites at which FABRIC operates infrastructure. 
      Applicable laws and regulations include, but are not limited to, export control laws and regulations and the regulations administered by the Office of Foreign Assets Control (OFAC) with respect to sanctioned countries and regions. See <a href="http://www.treasury.gov/resource-center/sanctions/Programs/Pages/Programs.aspx" target="_blank" rel="noopener noreferrer">http://www.treasury.gov/resource-center/sanctions/Programs/Pages/Programs.aspx</a>.
      </p>

      <h2>II. Security </h2>
      <p>The University is committed to maximizing the availability of FABRIC while protecting the security of users. To achieve this high level of security, user cooperation is required. </p>
      <p>You agree to: </p>
      <p>
        <ul>
          <li>not utilize FABRIC for any criminal activity; </li>
          <li>not attempt to disable or circumvent any FABRIC security controls; </li>
          <li>abide by all applicable intellectual property rights; </li>
          <li>protect access credentials and authentication devices for Your use only; </li>
          <li>report lost or stolen FABRIC credentials or authentication devices; </li>
          <li>not enable other users to access FABRIC with Your account and/or credentials;</li>
          <li>maintain up-to-date contact information with FABRIC;</li>
          <li>appropriately secure your computers that access FABRIC;</li>
          <li>not intentionally interfere with system operation or other system users;</li>
          <li>report any suspected security breaches or misuses of FABRIC to info@fabric.net.</li>
        </ul>
      </p>
      <p>While You are subject to your own University policies, the following clarifications are provided specifically with respect to using FABRIC: </p>
      <ul>
        <li>Logged information, including information provided by the users during registration processes, access to and use of FABRIC, shall be used for administrative, operational,
        accounting, research and security monitoring purposes only. This information may be disclosed to other organizations for these purposes. Although efforts are made to maintain confidentiality of sensitive information, no guarantees are given. As a publicly funded, open system, usage information of FABRIC will be openly shared and reported as the project sees fit;
        </li>
        <li>FABRIC may retain all access logs and usage information for up to one year and possibly beyond;</li>
        <li>FABRIC is shared by many users and provides the standard file permission tools and virtual machines for users to protect their data from unauthorized access by other users and groups. It is the PI and his/her team's responsibility to set appropriate permissions or use any extra tools (e.g. encryption tools) to protect their data. It is possible to expose confidential data through misconfiguration of permissions by the user. FABRIC uses many best practices to monitor and protect the system but proper data management is primarily the responsibility of the user.</li>
      </ul>

      <h2>III. Data </h2>
      <p>The Principal Investigator of each project that uses FABRIC is the project lead and is responsible for all data associated with the PI's project and for compliance with data management policies. All data associated with the project must be removed from the FABRIC system within 90 days of the project's allocation being terminated. </p>

      <h2>IV. Authorized Use </h2>
      <p>You are responsible for avoiding any use that interferes with others’ legitimate access to and use of FABRIC system resources. You agree to use FABRIC only for projects for which an active and approved project account exists, or for other purposes specifically authorized by FABRIC, and in accordance with the directions of the project's PI or the PI's delegate. </p>
      <p>FABRIC maintains the authority to limit access to its resources and to partner resources and to remove material stored or posted on FABRIC provided resources when applicable policies, contractual obligations, or applicable laws are or likely have been violated. </p>
      <p>Email communications sent to the email address associated with Your user account FABRIC is considered official communication to You as the user of the account. Reading and responding, as appropriate, to these communications is an obligation of using FABRIC. </p>
      
      <h2>V. Enforcement</h2>
      <p>Non-compliance with this policy may be cause for suspension or termination of access to FABRIC resources. Depending on the circumstances, applicable laws may permit civil or criminal litigation and/or restitution, fines, and/or penalties for action that would violate this policy.</p>
    </div>
  );
};

export default AUP;
