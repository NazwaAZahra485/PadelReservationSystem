import React from 'react';
import { Link } from 'react-router-dom';

export default function PublicDashboard() {
  return (
    <div style={{ padding: 24 }}>
      <h1>Home</h1>
      <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Deserunt assumenda dolor eius in nemo illo voluptas dolorum sequi delectus quam..</p>
      <section style={{ marginTop: 16 }}>
        <h2>Available information</h2>
        <ul>
          <li>List of courts (read-only)</li>
          <li>Upcoming public events</li>
          <li>Contact / help information</li>
        </ul>
      </section>
    </div>
  );
}
