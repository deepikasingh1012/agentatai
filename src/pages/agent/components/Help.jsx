import React from "react";

export default function HelpSection() {
  return (
    <div className="container-fluid mt-5 overflow-auto" style={{ maxHeight: '80vh' }}>
      <h2 className="text-primary mb-3">Agent Dashboard Help</h2>
      <p>Welcome to the Help Section. Here you will find all the necessary details on how to operate the Agent Dashboard.</p>

      <div className="d-flex flex-column my-4">
        {/* 1. Overview */}
        <section className="mb-4">
          <h4 className="text-primary">1. Overview of Agent Dashboard</h4>
          <p>
            Welcome to the Agent Dashboard! This dashboard allows you to manage, monitor,
            and update various user-related requests and tickets.
            Below is a guide on how to navigate and utilize the different sections:
          </p>
        </section>

        {/* 2. Ticket Management */}
        <section className="mb-4">
          <h4 className="text-primary">2. Ticket Management</h4>
          <p>
            The Tickets section is where all ticket-related data is stored and managed. You can view, track, and manage tickets based on their current status.
          </p>

          <p><strong>a. What Can You Do in the Tickets Section?</strong></p>
          <ul>
            <li>View Ticket Categories:</li>
            <ul>
              <li><strong>Opened Tickets:</strong> Tickets that are still awaiting resolution.</li>
              <li><strong>Closed Tickets:</strong> Tickets that have been resolved and are closed.</li>
              <li><strong>Rated Tickets:</strong> Tickets that have received feedback or ratings.</li>
            </ul>
          </ul>

          <p><strong>b. Interacting with Tickets</strong></p>
          <ul>
            <li><strong>View Ticket Details:</strong> Click on a ticket's ID to see the User Conversation.</li>
            <li><strong>Filter Tickets:</strong> Use navigation tabs or buttons to filter by status.</li>
          </ul>
        </section>

        {/* 3. User Conversations */}
        <section className="mb-4">
          <h4 className="text-primary">3. User Conversations</h4>
          <p>This section shows the communication history between the Agent and the users.</p>

          <p><strong>a. What Can You Do?</strong></p>
          <ul>
            <li><strong>View Conversations:</strong> Chat format with clear sender identification.</li>
            <li><strong>Add Remarks:</strong> Add internal notes for tracking.</li>
            <li><strong>Change Ticket Status:</strong> Update ticket progress with dropdown.</li>
          </ul>

          <p><strong>b. Ticket Details and Messages</strong></p>
          <ul>
            <li><strong>Ticket ID:</strong> Displayed at the top of the screen.</li>
            <li><strong>Messages:</strong> Clearly styled by sender (Agent, User, Chatbot).</li>
          </ul>

          <p><strong>c. Actions</strong></p>
          <ul>
            <li><strong>Status Update:</strong> Open, Pending, or Closed.</li>
            <li><strong>Submit Changes:</strong> Save remarks and status updates.</li>
          </ul>
        </section>

        {/* 4. Callback Requests */}
        <section className="mb-4">
          <h4 className="text-primary">4. Callback Requests</h4>
          <p>
            Manage user requests for callbacks in this section.
          </p>

          <p><strong>a. What Can You Do?</strong></p>
          <ul>
            <li><strong>View Requests:</strong> Table of requests with user info and ticket ID.</li>
            <li><strong>Status:</strong> Green = Done, Yellow = Pending.</li>
            <li><strong>View Details:</strong> Click ticket ID for full conversation.</li>
          </ul>
        </section>

        {/* 5. Contact Support */}
        <section className="mb-4">
          <h4 className="text-primary">5. Contact Support</h4>
          <p>If you need further assistance:</p>
          <p><strong>Support:</strong> +91 83 90 42 6222</p>
          <p><strong>Email:</strong> <a href="mailto:info.ai@atjoin.in">info.ai@atjoin.in</a></p>
        </section>
      </div>
    </div>
  );
}
