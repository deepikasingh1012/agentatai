// import React from "react";

// export default function HelpSection() {
//   return (
//     <div className="container-fluid mt-5 overflow-auto" style={{ maxHeight: '80vh' }}>
//       <h2 className="text-primary mb-3">Agent Dashboard Help</h2>
//       <p>Welcome to the Help Section. Here you will find all the necessary details on how to operate the Agent Dashboard.</p>

//       <div className="d-flex flex-column my-4">
//         {/* 1. Overview */}
//         <section className="mb-4">
//           <h4 className="text-primary">1. Overview of Agent Dashboard</h4>
//           <p>
//             Welcome to the Agent Dashboard! This dashboard allows you to manage, monitor,
//             and update various user-related requests and tickets.
//             Below is a guide on how to navigate and utilize the different sections:
//           </p>
//         </section>

//         {/* 2. Ticket Management */}
//         <section className="mb-4">
//           <h4 className="text-primary">2. Ticket Management</h4>
//           <p>
//             The Tickets section is where all ticket-related data is stored and managed. You can view, track, and manage tickets based on their current status.
//           </p>

//           <p><strong>a. What Can You Do in the Tickets Section?</strong></p>
//           <ul>
//             <li>View Ticket Categories:</li>
//             <ul>
//               <li><strong>Opened Tickets:</strong> Tickets that are still awaiting resolution.</li>
//               <li><strong>Closed Tickets:</strong> Tickets that have been resolved and are closed.</li>
//               <li><strong>Rated Tickets:</strong> Tickets that have received feedback or ratings.</li>
//             </ul>
//           </ul>

//           <p><strong>b. Interacting with Tickets</strong></p>
//           <ul>
//             <li><strong>View Ticket Details:</strong> Click on a ticket's ID to see the User Conversation.</li>
//             <li><strong>Filter Tickets:</strong> Use navigation tabs or buttons to filter by status.</li>
//           </ul>
//         </section>

//         {/* 3. User Conversations */}
//         <section className="mb-4">
//           <h4 className="text-primary">3. User Conversations</h4>
//           <p>This section shows the communication history between the Agent and the users.</p>

//           <p><strong>a. What Can You Do?</strong></p>
//           <ul>
//             <li><strong>View Conversations:</strong> Chat format with clear sender identification.</li>
//             <li><strong>Add Remarks:</strong> Add internal notes for tracking.</li>
//             <li><strong>Change Ticket Status:</strong> Update ticket progress with dropdown.</li>
//           </ul>

//           <p><strong>b. Ticket Details and Messages</strong></p>
//           <ul>
//             <li><strong>Ticket ID:</strong> Displayed at the top of the screen.</li>
//             <li><strong>Messages:</strong> Clearly styled by sender (Agent, User, Chatbot).</li>
//           </ul>

//           <p><strong>c. Actions</strong></p>
//           <ul>
//             <li><strong>Status Update:</strong> Open, Pending, or Closed.</li>
//             <li><strong>Submit Changes:</strong> Save remarks and status updates.</li>
//           </ul>
//         </section>

//         {/* 4. Callback Requests */}
//         <section className="mb-4">
//           <h4 className="text-primary">4. Callback Requests</h4>
//           <p>
//             Manage user requests for callbacks in this section.
//           </p>

//           <p><strong>a. What Can You Do?</strong></p>
//           <ul>
//             <li><strong>View Requests:</strong> Table of requests with user info and ticket ID.</li>
//             <li><strong>Status:</strong> Green = Done, Yellow = Pending.</li>
//             <li><strong>View Details:</strong> Click ticket ID for full conversation.</li>
//           </ul>
//         </section>

//         {/* 5. Contact Support */}
//         <section className="mb-4">
//           <h4 className="text-primary">5. Contact Support</h4>
//           <p>If you need further assistance:</p>
//           <p><strong>Support:</strong> +91 83 90 42 6222</p>
//           <p><strong>Email:</strong> <a href="mailto:info.ai@atjoin.in">info.ai@atjoin.in</a></p>
//         </section>
//       </div>
//     </div>
//   );
// }
import React from "react";

export default function HelpSection() {
  return (
    <div
      className="container-fluid mt-5 overflow-auto"
      style={{ maxHeight: "80vh" }}
    >
      <h2 className="text-primary mb-3">Agent Dashboard Help</h2>
      <p>
        Welcome to the Help Section. Here you will find all the necessary
        guidance on how to operate the Agent Dashboard effectively.
      </p>

      <div className="d-flex flex-column my-4">
        {/* 1. Overview */}
        <section className="mb-4">
          <h4 className="text-primary">1. Overview of Agent Dashboard</h4>
          <p>
            The Agent Dashboard provides a comprehensive view of ticket
            statistics, including total, opened, closed, and in-progress
            inquiries. It features interactive bar and pie charts that visualize
            ticket distribution, and allows agents to quickly navigate to
            filtered ticket views by clicking on chart elements. This dashboard
            enables agents to efficiently monitor inquiry statuses and gain
            actionable insights from the visual data representation.
          </p>
        </section>

        {/* 2. Ticket Management */}
        <section className="mb-4">
          <h4 className="text-primary">2. Ticket Management</h4>
          <p>
            The Tickets section allows agents to manage and monitor user
            inquiries effectively. It provides categorized views, filtering
            tools, and navigation to detailed conversations.
          </p>

          <p>
            <strong>a. Ticket Categories</strong>
          </p>
          <ul>
            <li>
              <strong>Opened Tickets:</strong> Tickets currently open and
              awaiting resolution (status: <code>OPN</code>).
            </li>
            <li>
              <strong>In-Progress Tickets:</strong> Tickets marked as being
              worked on by an agent (status: <code>INP</code>).
            </li>
            <li>
              <strong>Closed Tickets:</strong> Tickets that have been resolved (
              <code>CRS</code>) or closed without response (<code>CNR</code>).
            </li>
          </ul>

          <p>
            <strong>b. Interactions in the Ticket Section</strong>
          </p>
          <ul>
            <li>
              <strong>View Ticket Details:</strong> Click a ticket ID to view
              the full conversation and update ticket status or remarks.
            </li>
            <li>
              <strong>Search Tickets:</strong> Use the top search bar to find
              tickets by Ticket ID or Client Name.
            </li>
            <li>
              <strong>Filter by Status:</strong> Use status tabs (All, Open,
              In-Progress, Closed) to narrow down the ticket list.
            </li>
            <li>
              <strong>Date Filtering:</strong> Use date filters like Today, This
              Week, This Month, and This Year, or apply a custom date range
              using From and To date pickers.
            </li>
            <li>
              <strong>Pagination:</strong> Browse through multiple pages of
              tickets using pagination controls at the bottom of the list.
            </li>
          </ul>
        </section>

        {/* 3. User Conversations */}
        <section className="mb-4">
          <h4 className="text-primary">3. User Conversations</h4>
          <p>
            This section manages the conversation and status tracking for a
            specific user inquiry. It fetches user messages and allows the agent
            to interact with the ticket.
          </p>

          <p>
            <strong>a. What Can You Do?</strong>
          </p>
          <ul>
            <li>
              <strong>View Conversation:</strong> Displays past messages
              exchanged between the user, agent, and chatbot.
            </li>
            <li>
              <strong>Update Inquiry:</strong> Submit new agent remarks, set a
              follow-up date, and change the current ticket status.
            </li>
            <li>
              <strong>Form Validation:</strong> Prevents empty submissions and
              disallows status changes before the follow-up date is reached.
            </li>
          </ul>

          <p>
            <strong>b. Ticket Details and Messages</strong>
          </p>
          <ul>
            <li>
              <strong> Ticket ID:</strong> 
              displayed for reference.
            </li>
            <li>
              <strong>Client Info:</strong> Client name, contact, email.
            
            </li>
            <li>
              <strong>Remarks & Status:</strong> Agents can write remarks and
              choose status like Open, In Progress, CRS, or CNR.
            </li>
            <li>
              <strong>Follow-Up Date:</strong> Future dates can be selected
              unless the status is Closed.
            </li>
          </ul>

          <p>
            <strong>c. Actions</strong>
          </p>
          <ul>
            <li>
              <strong>Status Restriction:</strong> Closed statuses (CRS, CNR)
              lock the follow-up input and can only be selected after the
              current follow-up date.
            </li>
            <li>
              <strong>Form Submission:</strong> Submits the updated inquiry
             with all changes.
            </li> 
            <li>
              <strong>Auto Redirect:</strong> On successful update, you are
              redirected to the Tickets list with refreshed data.
            </li>
            <li>
              <strong>Error Handling:</strong> Displays clear messages for
              missing fields or attempts to update already closed tickets.
            </li>
          </ul>
        </section>

          {/* 4. Self-Assessment Section */}
          <section className="mb-4">
          <h4 className="text-primary">4. Self-Assessment</h4>
          <p>
            The Self-Assessment section allows agents to filter and review their
            tickets based on various statuses and time periods. It provides a
            detailed breakdown of the tickets' status counts and allows agents
            to view tickets within a custom date range.
          </p>

          <p>
            <strong>a. Key Features of the Self-Assessment Page</strong>
          </p>
          <ul>
            <li>
              <strong>Filtering by Date:</strong> Agents can filter tickets based
              on a custom date range using the "From Date" and "To Date" fields.
            </li>
            <li>
              <strong>Ticket Status Overview:</strong> The page displays the
              count of tickets categorized as  "In-Progress", and
              "Closed", with corresponding badges for each status.
            </li>
            <li>
              <strong>Pagination:</strong> The tickets are paginated, showing a
              specific number of tickets per page. Pagination controls are
              available to navigate through multiple pages.
            </li>
            <li>
              <strong>Ticket Details:</strong> Each ticket shows the ID, Client
              Name, Created At timestamp, and the current Status.
            </li>

            </ul>
            </section>

        {/* 5. Contact Support */}
        <section className="mb-4">
          <h4 className="text-primary">5. Contact Support</h4>
          <p>If you need additional help, please contact our support team.</p>
          <p>
            <strong>Phone:</strong> +91 83 90 42 6222
          </p>
          <p>
            <strong>Email:</strong>{" "}
            <a href="mailto:info.ai@atjoin.in">info.ai@atjoin.in</a>
          </p>
        </section>
      </div>
    </div>
  );
}
