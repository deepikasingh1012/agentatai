import React from 'react';

const AtaiTour = () => {
  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10">
          <h2 className="mb-4 text-center">Admin Login & Dashboard Flow</h2>

          <div className="mb-4">
            <h4>First-Time Login Experience</h4>
            <p>
              When an administrator logs into the system for the first time, they are redirected to the Atai Tool instead of the dashboard. This ensures essential organizational configurations and question trainings are completed first.
            </p>
          </div>

          <div className="mb-4">
            <h4>Returning User Flow</h4>
            <p>
              Returning admins are directed straight to the Dashboard since initial setup is assumed complete. They can still access other configuration tools as needed.
            </p>
          </div>

          <div className="mb-4">
            <h4>Dashboard Section</h4>
            <p>The Dashboard serves as the main control panel, showing ticket activity and system insights.</p>
            <ul>
              <li><strong>Total Tickets:</strong> Total inquiries in the system</li>
              <li><strong>Opened Tickets:</strong> Awaiting resolution</li>
              <li><strong>Closed Tickets:</strong> Resolved and completed</li>
              <li><strong>In-progress Tickets:</strong> Currently being addressed</li>
            </ul>
          </div>

          <div className="mb-4">
            <h4>Configure Atai Section</h4>
            <p>This section enables admins to train the Atai system with organization-specific data and rules.</p>
            <ul>
              <li><strong>Train Atai:</strong> Input domain-specific knowledge</li>
              <li><strong>Add Custom Questions:</strong> Tailor questions to organizational needs</li>
              <li><strong>Drag-and-Drop Support:</strong> Organize options hierarchically</li>
            </ul>
            <p>Drag-and-drop rules:</p>
            <ul>
              <li>No duplicate option texts or labels</li>
              <li>No circular hierarchies (a parent cannot become its own child)</li>
            </ul>
          </div>

          <div className="mb-4">
            <h4>Manage Option Section</h4>
            <p>Admins can edit existing options without starting from scratch.</p>
            <ul>
              <li>Edit option text and labels</li>
              <li>Update terminology and reflect organizational changes</li>
            </ul>
          </div>

          <div className="mb-4">
            <h4>Add Staff Section</h4>
            <p>Admins can onboard new staff with email-based verification.</p>
            <ul>
              <li>Staff receive verification emails upon addition</li>
              <li>Ensures authorized and valid users only</li>
            </ul>
          </div>

          <div className="mb-4">
            <h4>Manage Staff Section</h4>
            <p>Admins can modify or deactivate staff members while preserving data.</p>
            <ul>
              <li>Edit name, email, and phone number</li>
              <li>Email changes trigger new verification</li>
              <li>Deletion changes status to <strong>Inactive</strong></li>
              <li>Disabled delete for already inactive staff</li>
            </ul>
          </div>

          <div className="mb-4">
            <h4>Atai Tour Section</h4>
            <p>The Atai Tour acts as an interactive guide and configuration assistant.</p>
            <ul>
              <li>Provides training on how to use and manage Atai</li>
              <li>Supports new and returning users</li>
              <li>Explains option flows and configuration logic</li>
              <li>Helps admins fully utilize the platform’s capabilities</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AtaiTour;
